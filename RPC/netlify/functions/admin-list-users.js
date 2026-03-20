const { createClient } = require("@supabase/supabase-js");

const {
  SUPABASE_URL,
  SUPABASE_SERVER_KEY,
  SUPABASE_SERVICE_ROLE_KEY
} = process.env;

const SUPABASE_ADMIN_KEY = SUPABASE_SERVER_KEY || SUPABASE_SERVICE_ROLE_KEY;

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

async function getVerifiedUser(adminSupabase, token) {
  const { data, error } = await adminSupabase.auth.getUser(token);
  if (!error && data?.user) {
    return { user: data.user, error: null };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_ADMIN_KEY,
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      return { user: null, error: payload?.msg || payload?.error_description || payload?.error || error?.message || "Invalid auth token" };
    }

    const user = await response.json();
    return { user, error: null };
  } catch (fallbackError) {
    return { user: null, error: fallbackError.message || error?.message || "Invalid auth token" };
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_ADMIN_KEY) {
    return json(500, { error: "Server env vars missing" });
  }

  const adminSupabase = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY, {
    auth: { persistSession: false }
  });

  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return json(401, { error: "Missing auth token" });
  }

  const { user, error: verifiedUserError } = await getVerifiedUser(adminSupabase, token);
  if (verifiedUserError || !user) {
    return json(401, { error: verifiedUserError || "Invalid auth token" });
  }

  const { data: adminProfile, error: profileError } = await adminSupabase
    .from("admin_profiles")
    .select("user_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !adminProfile) {
    return json(403, { error: "User is not an admin" });
  }

  if (adminProfile.role !== "lead_therapist") {
    return json(403, { error: "Only lead therapist can view access users" });
  }

  const { data: profiles, error: profilesError } = await adminSupabase
    .from("admin_profiles")
    .select("user_id, role, created_at")
    .order("created_at", { ascending: true });

  if (profilesError) {
    return json(500, { error: profilesError.message });
  }

  const { data: listedUsers, error: listedUsersError } = await adminSupabase.auth.admin.listUsers();
  if (listedUsersError) {
    return json(500, { error: listedUsersError.message });
  }

  const userMap = new Map((listedUsers?.users || []).map((user) => [user.id, user]));

  const users = (profiles || []).map((profile) => {
    const authUser = userMap.get(profile.user_id);
    return {
      userId: profile.user_id,
      role: profile.role,
      fullName: authUser?.user_metadata?.full_name || authUser?.email || "Unnamed user",
      email: authUser?.email || ""
    };
  });

  return json(200, {
    ok: true,
    users
  });
};

