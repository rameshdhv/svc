const { createClient } = require("@supabase/supabase-js");

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
} = process.env;

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: "Server env vars missing" });
  }

  const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return json(401, { error: "Missing auth token" });
  }

  const { data: userData, error: userError } = await adminSupabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return json(401, { error: "Invalid auth token" });
  }

  const { data: adminProfile, error: profileError } = await adminSupabase
    .from("admin_profiles")
    .select("user_id, role")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (profileError || !adminProfile) {
    return json(403, { error: "User is not an admin" });
  }

  if (adminProfile.role !== "dentist") {
    return json(403, { error: "Only dentist can view access users" });
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
