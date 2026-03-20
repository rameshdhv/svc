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

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
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
  if (event.httpMethod !== "POST") {
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
    return json(403, { error: "Only lead therapist can add new users" });
  }

  const body = JSON.parse(event.body || "{}");
  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = String(body.role || "staff").trim().toLowerCase();

  if (!isValidEmail(email)) {
    return json(400, { error: "Valid email is required" });
  }
  if (password.length < 6) {
    return json(400, { error: "Temporary password must be at least 6 characters" });
  }
  if (!["staff", "lead_therapist"].includes(role)) {
    return json(400, { error: "Role must be staff or lead therapist" });
  }

  const { data: createdUserData, error: createUserError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: fullName ? { full_name: fullName } : {}
  });

  if (createUserError || !createdUserData?.user?.id) {
    return json(400, { error: createUserError?.message || "Unable to create auth user" });
  }

  const newUserId = createdUserData.user.id;

  const { error: profileInsertError } = await adminSupabase
    .from("admin_profiles")
    .insert({
      user_id: newUserId,
      role
    });

  if (profileInsertError) {
    await adminSupabase.auth.admin.deleteUser(newUserId).catch(() => {});
    return json(400, { error: profileInsertError.message || "Unable to create admin profile" });
  }

  return json(200, {
    ok: true,
    message: `${role === "staff" ? "Staff" : "Lead therapist"} user created successfully.`,
    userId: newUserId
  });
};

