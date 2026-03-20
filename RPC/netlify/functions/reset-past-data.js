const { createClient } = require("@supabase/supabase-js");

const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVER_KEY,
  SUPABASE_SERVICE_ROLE_KEY
} = process.env;

const SUPABASE_ADMIN_KEY = SUPABASE_SERVER_KEY || SUPABASE_SERVICE_ROLE_KEY;

const adminSupabase = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY, {
  auth: { persistSession: false }
});

const anonSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

function parseCutoffDate(monthValue) {
  if (!/^\d{4}-\d{2}$/.test(monthValue)) {
    return null;
  }
  return `${monthValue}-01`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_ADMIN_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server env vars missing" }) };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: "Missing auth token" }) };
  }

  const { data: userData, error: userError } = await adminSupabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid auth token" }) };
  }

  const { data: adminProfile, error: profileError } = await adminSupabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (profileError || !adminProfile) {
    return { statusCode: 403, body: JSON.stringify({ error: "User is not an admin" }) };
  }

  const body = JSON.parse(event.body || "{}");
  const cutoffMonth = String(body.cutoffMonth || "");
  const password = String(body.password || "");
  const cutoffDate = parseCutoffDate(cutoffMonth);

  if (!cutoffDate) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid cutoff month" }) };
  }
  if (!password) {
    return { statusCode: 400, body: JSON.stringify({ error: "Password is required" }) };
  }
  if (!userData.user.email) {
    return { statusCode: 400, body: JSON.stringify({ error: "User email missing for password verification" }) };
  }

  const { error: passwordError } = await anonSupabase.auth.signInWithPassword({
    email: userData.user.email,
    password
  });
  if (passwordError) {
    return { statusCode: 401, body: JSON.stringify({ error: "Password verification failed" }) };
  }

  const appointmentStatuses = ["Completed", "Rejected", "No-show"];

  const { error: appointmentsError } = await adminSupabase
    .from("appointments")
    .delete()
    .lt("preferred_date", cutoffDate)
    .in("status", appointmentStatuses);

  if (appointmentsError) {
    return { statusCode: 500, body: JSON.stringify({ error: appointmentsError.message }) };
  }

  const { error: historyError } = await adminSupabase
    .from("appointment_status_history")
    .delete()
    .lt("changed_at", cutoffDate);

  if (historyError) {
    return { statusCode: 500, body: JSON.stringify({ error: historyError.message }) };
  }

  const { error: visitorsError } = await adminSupabase
    .from("visitor_events")
    .delete()
    .lt("created_at", cutoffDate);

  if (visitorsError) {
    return { statusCode: 500, body: JSON.stringify({ error: visitorsError.message }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, message: `Past records before ${cutoffMonth} deleted.` })
  };
};
