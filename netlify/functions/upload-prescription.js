const { createClient } = require("@supabase/supabase-js");

const {
  SUPABASE_URL,
  SUPABASE_SERVER_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  GOOGLE_DRIVE_FOLDER_ID,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REFRESH_TOKEN
} = process.env;

const SUPABASE_ADMIN_KEY = SUPABASE_SERVER_KEY || SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_DRIVE_API_BASE = "https://www.googleapis.com/drive/v3/files";
const GOOGLE_UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,parents";
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

function sanitizeNamePart(value, fallback) {
  const cleaned = String(value || "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  return cleaned || fallback;
}

function extensionFromName(name, mimeType) {
  const explicit = String(name || "").match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase();
  if (explicit) {
    return explicit;
  }
  const map = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "application/pdf": "pdf"
  };
  return map[mimeType] || "bin";
}

function buildPatientFolderName(patientCode, patientPhone) {
  const code = sanitizeNamePart(patientCode, "PATIENT");
  const phone = sanitizeNamePart(patientPhone, "unknown");
  return `${code}_${phone}`;
}

function buildDateFolderName(consultationDate) {
  const [year, month, day] = String(consultationDate || "").split("-");
  if (year && month && day) {
    return `${day}-${month}-${String(year).slice(-2)}`;
  }
  const fallback = new Date().toISOString().slice(0, 10).split("-");
  return `${fallback[2]}-${fallback[1]}-${fallback[0].slice(-2)}`;
}

function buildDriveFileName({ patientCode, patientName, consultationDate, originalName, mimeType }) {
  const code = sanitizeNamePart(patientCode, "PATIENT");
  const name = sanitizeNamePart(patientName, "record");
  const date = sanitizeNamePart(consultationDate, new Date().toISOString().slice(0, 10));
  const ext = extensionFromName(originalName, mimeType);
  return `${code}_${name}_${date}_doc.${ext}`;
}

function escapeDriveQuery(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
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

async function getGoogleAccessToken() {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN,
      grant_type: "refresh_token"
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.access_token) {
    throw new Error(payload?.error_description || payload?.error || "Unable to authenticate with Google Drive.");
  }

  return payload.access_token;
}

async function createDriveFolder({ accessToken, name, parentId }) {
  const response = await fetch(`${GOOGLE_DRIVE_API_BASE}?fields=id,name,webViewLink`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      mimeType: FOLDER_MIME_TYPE,
      parents: [parentId]
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.id) {
    throw new Error(payload?.error?.message || "Unable to create patient folder in Google Drive.");
  }

  return {
    id: payload.id,
    folderUrl: payload.webViewLink || `https://drive.google.com/drive/folders/${payload.id}`
  };
}

async function ensurePatientFolder({ accessToken, patientCode, patientPhone }) {
  const folderName = buildPatientFolderName(patientCode, patientPhone);
  const query = [
    `name='${escapeDriveQuery(folderName)}'`,
    `mimeType='${FOLDER_MIME_TYPE}'`,
    `'${escapeDriveQuery(GOOGLE_DRIVE_FOLDER_ID)}' in parents`,
    "trashed=false"
  ].join(" and ");

  const response = await fetch(`${GOOGLE_DRIVE_API_BASE}?q=${encodeURIComponent(query)}&fields=files(id,name,webViewLink)&pageSize=1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || "Unable to locate patient folder in Google Drive.");
  }

  const existing = payload?.files?.[0];
  if (existing?.id) {
    return {
      id: existing.id,
      folderUrl: existing.webViewLink || `https://drive.google.com/drive/folders/${existing.id}`
    };
  }

  return createDriveFolder({ accessToken, name: folderName, parentId: GOOGLE_DRIVE_FOLDER_ID });
}

async function ensureDateFolder({ accessToken, parentFolderId, consultationDate }) {
  const folderName = buildDateFolderName(consultationDate);
  const query = [
    `name='${escapeDriveQuery(folderName)}'`,
    `mimeType='${FOLDER_MIME_TYPE}'`,
    `'${escapeDriveQuery(parentFolderId)}' in parents`,
    "trashed=false"
  ].join(" and ");

  const response = await fetch(`${GOOGLE_DRIVE_API_BASE}?q=${encodeURIComponent(query)}&fields=files(id,name,webViewLink)&pageSize=1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || "Unable to locate consultation date folder in Google Drive.");
  }

  const existing = payload?.files?.[0];
  if (existing?.id) {
    return {
      id: existing.id,
      folderUrl: existing.webViewLink || `https://drive.google.com/drive/folders/${existing.id}`,
      folderName
    };
  }

  const created = await createDriveFolder({ accessToken, name: folderName, parentId: parentFolderId });
  return {
    ...created,
    folderName
  };
}

async function uploadToDrive({ accessToken, buffer, mimeType, fileName, parentFolderId }) {
  const boundary = `svc-drive-${Date.now()}`;
  const metadata = {
    name: fileName,
    parents: [parentFolderId]
  };

  const prefix = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`
  );
  const suffix = Buffer.from(`\r\n--${boundary}--`);
  const body = Buffer.concat([prefix, buffer, suffix]);

  const response = await fetch(GOOGLE_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
      "Content-Length": String(body.length)
    },
    body
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.id) {
    throw new Error(payload?.error?.message || "Unable to upload file to Google Drive.");
  }

  return {
    id: payload.id,
    driveUrl: payload.webViewLink || payload.webContentLink || `https://drive.google.com/file/d/${payload.id}/view`
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_ADMIN_KEY) {
    return json(500, { error: "Server env vars missing" });
  }

  if (!GOOGLE_DRIVE_FOLDER_ID || !GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET || !GOOGLE_OAUTH_REFRESH_TOKEN) {
    return json(500, { error: "Google OAuth env vars missing" });
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

  const body = JSON.parse(event.body || "{}");
  const fileName = String(body.fileName || "").trim();
  const mimeType = String(body.mimeType || "application/octet-stream").trim();
  const dataBase64 = String(body.dataBase64 || "").trim();
  const patientId = String(body.patientId || "").trim();
  const patientCode = String(body.patientCode || "").trim();
  const patientName = String(body.patientName || "").trim();
  const patientPhone = String(body.patientPhone || "").trim();
  const consultationDate = String(body.consultationDate || "").trim();

  if (!fileName || !dataBase64 || !patientId || !patientCode || !patientPhone) {
    return json(400, { error: "File, patient ID, patient code, and patient phone are required" });
  }

  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
  if (!allowedTypes.has(mimeType)) {
    return json(400, { error: "Unsupported file type" });
  }

  let fileBuffer;
  try {
    fileBuffer = Buffer.from(dataBase64, "base64");
  } catch (error) {
    return json(400, { error: "Invalid file payload" });
  }

  if (!fileBuffer.length || fileBuffer.length > MAX_UPLOAD_BYTES) {
    return json(400, { error: "File must be smaller than 8 MB" });
  }

  try {
    const accessToken = await getGoogleAccessToken();
    const folder = await ensurePatientFolder({ accessToken, patientCode, patientPhone });
    const dateFolder = await ensureDateFolder({
      accessToken,
      parentFolderId: folder.id,
      consultationDate
    });
    const uploaded = await uploadToDrive({
      accessToken,
      buffer: fileBuffer,
      mimeType,
      fileName: buildDriveFileName({ patientCode, patientName, consultationDate, originalName: fileName, mimeType }),
      parentFolderId: dateFolder.id
    });

    await adminSupabase
      .from("patients")
      .update({ drive_folder_url: folder.folderUrl })
      .eq("id", patientId);

    return json(200, {
      ok: true,
      driveFileId: uploaded.id,
      driveUrl: uploaded.driveUrl,
      folderUrl: folder.folderUrl,
      folderName: buildPatientFolderName(patientCode, patientPhone),
      dateFolderName: dateFolder.folderName,
      dateFolderUrl: dateFolder.folderUrl
    });
  } catch (error) {
    return json(500, { error: error.message || "Unable to upload docs" });
  }
};
