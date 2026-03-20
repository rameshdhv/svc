const twilio = require("twilio");
const { createClient } = require("@supabase/supabase-js");

const {
  SUPABASE_URL,
  SUPABASE_SERVER_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM
} = process.env;

const SUPABASE_ADMIN_KEY = SUPABASE_SERVER_KEY || SUPABASE_SERVICE_ROLE_KEY;

const adminSupabase = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY, {
  auth: { persistSession: false }
});

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function normalizePhone(phone) {
  const value = String(phone || "").trim();
  if (value.startsWith("+")) {
    return value;
  }
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  return `+${digits}`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  if (!SUPABASE_URL || !SUPABASE_ADMIN_KEY || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    return { statusCode: 500, body: "Server env vars missing" };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return { statusCode: 401, body: "Missing auth token" };
  }

  const { data: userData, error: userError } = await adminSupabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return { statusCode: 401, body: "Invalid auth token" };
  }

  const { data: adminProfile, error: profileError } = await adminSupabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (profileError || !adminProfile) {
    return { statusCode: 403, body: "User is not an admin" };
  }

  const body = JSON.parse(event.body || "{}");
  const {
    patientName,
    patientPhone,
    preferredDate,
    preferredSlot,
    service
  } = body;

  if (!patientName || !patientPhone || !preferredDate || !preferredSlot || !service) {
    return { statusCode: 400, body: "Missing required fields" };
  }

  const toPhone = normalizePhone(patientPhone);

  const message = [
    "GaitPhysioClinic",
    `Hi ${patientName}, your appointment is approved.`,
    `Date: ${preferredDate}`,
    `Slot: ${preferredSlot}`,
    `Service: ${service}`,
    "Reply to this message or call 8328010083 if you need changes."
  ].join("\n");

  try {
    await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${toPhone}`,
      body: message
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message })
    };
  }
};
