import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  CLINIC_NAME,
  CLINIC_PHONE,
  SERVICES,
  SLOT_DURATION_MINUTES,
  SLOT_END_MINUTES,
  SLOT_START_MINUTES,
  SUPABASE_ANON_KEY,
  SUPABASE_URL
} from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authCard = document.getElementById("authCard");
const authTitle = document.getElementById("authTitle");
const authLead = document.getElementById("authLead");
const dentistRoleBtn = document.getElementById("dentistRoleBtn");
const staffRoleBtn = document.getElementById("staffRoleBtn");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const confirmLinkForm = document.getElementById("confirmLinkForm");
const confirmLinkEmail = document.getElementById("confirmLinkEmail");
const confirmLinkBackBtn = document.getElementById("confirmLinkBackBtn");
const confirmLinkSubmitBtn = document.getElementById("confirmLinkSubmitBtn");
const forgotForm = document.getElementById("forgotForm");
const forgotEmail = document.getElementById("forgotEmail");
const forgotBackBtn = document.getElementById("forgotBackBtn");
const forgotSubmitBtn = document.getElementById("forgotSubmitBtn");
const forgotCooldownText = document.getElementById("forgotCooldownText");
const forgotSentPanel = document.getElementById("forgotSentPanel");
const forgotSentMessage = document.getElementById("forgotSentMessage");
const forgotSentBackBtn = document.getElementById("forgotSentBackBtn");
const forgotTryAgainBtn = document.getElementById("forgotTryAgainBtn");
const forgotSentResendConfirmBtn = document.getElementById("forgotSentResendConfirmBtn");
const resetForm = document.getElementById("resetForm");
const newPassword = document.getElementById("newPassword");
const confirmNewPassword = document.getElementById("confirmNewPassword");
const resetBackBtn = document.getElementById("resetBackBtn");
const mfaSetupPanel = document.getElementById("mfaSetupPanel");
const mfaQrWrap = document.getElementById("mfaQrWrap");
const mfaSecret = document.getElementById("mfaSecret");
const mfaEnrollCode = document.getElementById("mfaEnrollCode");
const mfaSetupCancelBtn = document.getElementById("mfaSetupCancelBtn");
const mfaSetupVerifyBtn = document.getElementById("mfaSetupVerifyBtn");
const mfaVerifyPanel = document.getElementById("mfaVerifyPanel");
const mfaVerifyCode = document.getElementById("mfaVerifyCode");
const mfaVerifyCancelBtn = document.getElementById("mfaVerifyCancelBtn");
const mfaVerifyBtn = document.getElementById("mfaVerifyBtn");
const loginStatus = document.getElementById("loginStatus");
const appStatus = document.getElementById("appStatus");
const toastRoot = document.getElementById("toastRoot");
const liveAlertRoot = document.getElementById("liveAlertRoot");
const dashboard = document.getElementById("dashboard");
const refreshDashboardBtn = document.getElementById("refreshDashboardBtn");
const tableBody = document.getElementById("appointmentsBody");
const appointmentsContent = document.getElementById("appointmentsContent");
const toggleAppointmentsBtn = document.getElementById("toggleAppointmentsBtn");
const statusFilter = document.getElementById("statusFilter");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const serviceFilter = document.getElementById("serviceFilter");

const blockForm = document.getElementById("blockForm");
const blockFromDate = document.getElementById("blockFromDate");
const blockToDate = document.getElementById("blockToDate");
const blockReason = document.getElementById("blockReason");
const blockedDatesBody = document.getElementById("blockedDatesBody");

const slotBlockForm = document.getElementById("slotBlockForm");
const slotBlockDate = document.getElementById("slotBlockDate");
const slotBlockLabel = document.getElementById("slotBlockLabel");
const slotBlockReason = document.getElementById("slotBlockReason");
const slotPickerOpenBtn = document.getElementById("slotPickerOpenBtn");
const slotPickerSummary = document.getElementById("slotPickerSummary");
const slotPickerModal = document.getElementById("slotPickerModal");
const slotPickerList = document.getElementById("slotPickerList");
const slotPickerCancelBtn = document.getElementById("slotPickerCancelBtn");
const slotPickerApplyBtn = document.getElementById("slotPickerApplyBtn");
const slotSelectAllBtn = document.getElementById("slotSelectAllBtn");
const slotClearBtn = document.getElementById("slotClearBtn");
const blockedSlotsBody = document.getElementById("blockedSlotsBody");
const manualBookingForm = document.getElementById("manualBookingForm");
const manualName = document.getElementById("manualName");
const manualPhone = document.getElementById("manualPhone");
const manualDate = document.getElementById("manualDate");
const manualSlot = document.getElementById("manualSlot");
const manualService = document.getElementById("manualService");
const manualNotes = document.getElementById("manualNotes");
const emergencyBlockContent = document.getElementById("emergencyBlockContent");
const toggleEmergencyBlockBtn = document.getElementById("toggleEmergencyBlockBtn");
const leaveBlockContent = document.getElementById("leaveBlockContent");
const toggleLeaveBlockBtn = document.getElementById("toggleLeaveBlockBtn");

const kpiVisits = document.getElementById("kpiVisits");
const kpiBookings = document.getElementById("kpiBookings");
const kpiPending = document.getElementById("kpiPending");
const kpiApproval = document.getElementById("kpiApproval");

const quickTabs = document.querySelectorAll(".quick-tab");
const timelineDate = document.getElementById("timelineDate");
const refreshTimelineBtn = document.getElementById("refreshTimelineBtn");
const toggleTimelineBtn = document.getElementById("toggleTimelineBtn");
const timelineContent = document.getElementById("timelineContent");
const timelineSummary = document.getElementById("timelineSummary");
const timelineBody = document.getElementById("timelineBody");
const confirmModal = document.getElementById("confirmModal");
const confirmMessage = document.getElementById("confirmMessage");
const confirmWhatsappWrap = document.getElementById("confirmWhatsappWrap");
const confirmWhatsappNotify = document.getElementById("confirmWhatsappNotify");
const confirmReasonWrap = document.getElementById("confirmReasonWrap");
const confirmReason = document.getElementById("confirmReason");
const confirmCancel = document.getElementById("confirmCancel");
const confirmOk = document.getElementById("confirmOk");
const whatsappConfirmModal = document.getElementById("whatsappConfirmModal");
const whatsappConfirmMessage = document.getElementById("whatsappConfirmMessage");
const whatsappConfirmCancel = document.getElementById("whatsappConfirmCancel");
const whatsappConfirmOpen = document.getElementById("whatsappConfirmOpen");
const whatsappConfirmSent = document.getElementById("whatsappConfirmSent");
const blockConflictModal = document.getElementById("blockConflictModal");
const blockConflictMessage = document.getElementById("blockConflictMessage");
const blockConflictList = document.getElementById("blockConflictList");
const blockConflictCancel = document.getElementById("blockConflictCancel");
const blockConflictProceed = document.getElementById("blockConflictProceed");
const noticeModal = document.getElementById("noticeModal");
const noticeMessage = document.getElementById("noticeMessage");
const noticeOk = document.getElementById("noticeOk");
const totpConfirmModal = document.getElementById("totpConfirmModal");
const totpConfirmMessage = document.getElementById("totpConfirmMessage");
const totpConfirmCode = document.getElementById("totpConfirmCode");
const totpConfirmCancel = document.getElementById("totpConfirmCancel");
const totpConfirmOk = document.getElementById("totpConfirmOk");
const openSettingsBtn = document.getElementById("openSettingsBtn");
const settingsModal = document.getElementById("settingsModal");
const settingsForm = document.getElementById("settingsForm");
const slotDurationSelect = document.getElementById("slotDurationSelect");
const slotEffectiveDate = document.getElementById("slotEffectiveDate");
const bookingWindowDays = document.getElementById("bookingWindowDays");
const weeklyOffCheckboxes = document.querySelectorAll(".weekly-off");
const settingsCancelBtn = document.getElementById("settingsCancelBtn");
const settingsCloseBtn = document.getElementById("settingsCloseBtn");
const manageUsersSection = document.getElementById("manageUsersSection");
const manageUsersContent = document.getElementById("manageUsersContent");
const toggleManageUsersBtn = document.getElementById("toggleManageUsersBtn");
const refreshUsersBtn = document.getElementById("refreshUsersBtn");
const userAccessSummary = document.getElementById("userAccessSummary");
const userAccessList = document.getElementById("userAccessList");
const addUserForm = document.getElementById("addUserForm");
const newUserName = document.getElementById("newUserName");
const newUserEmail = document.getElementById("newUserEmail");
const newUserPassword = document.getElementById("newUserPassword");
const newUserRole = document.getElementById("newUserRole");
const addUserBtn = document.getElementById("addUserBtn");
const resetPastDataSection = document.getElementById("resetPastDataSection");
const purgeMonth = document.getElementById("purgeMonth");
const purgePassword = document.getElementById("purgePassword");
const purgeDataBtn = document.getElementById("purgeDataBtn");

let pendingStatusAction = null;
let pendingWhatsappAction = null;
let pendingBlockConflictAction = null;
let forgotCooldownTimer = null;
let clinicSettings = null;
let slotPickerDraftSelection = new Set();
let liveBookingChannel = null;
let liveBookingPollTimer = null;
let liveAlertPrimed = false;
const seenLiveAlertAppointmentIds = new Set();
let alertAudioContext = null;
let pendingMfaSetupFactorId = null;
let pendingMfaVerifyFactorId = null;
let selectedLoginRole = "lead_therapist";
let currentAdminProfile = null;
let settingsModalHistoryActive = false;
let pendingTotpResolver = null;
let recoveryModeActive = false;
const FORGOT_COOLDOWN_SECONDS = 90;
const FORGOT_COOLDOWN_KEY = "gaitphysio_forgot_cooldown_until";
const LIVE_ALERT_POLL_MS = 10000;

function setStatus(el, text, type = "") {
  el.className = `status ${type}`;
  el.textContent = text;
}

function updateAuthHeader(title, lead) {
  if (authTitle) {
    authTitle.textContent = title;
  }
  if (authLead) {
    authLead.textContent = lead;
  }
}

function showLoginView() {
  if (loginForm) {
    loginForm.hidden = false;
  }
  if (forgotPasswordBtn) {
    forgotPasswordBtn.hidden = false;
  }
  if (confirmLinkForm) {
    confirmLinkForm.hidden = true;
  }
  if (forgotForm) {
    forgotForm.hidden = true;
  }
  if (forgotSentPanel) {
    forgotSentPanel.hidden = true;
  }
  if (resetForm) {
    resetForm.hidden = true;
  }
  if (mfaSetupPanel) {
    mfaSetupPanel.hidden = true;
  }
  if (mfaVerifyPanel) {
    mfaVerifyPanel.hidden = true;
  }
  recoveryModeActive = false;
  setSelectedLoginRole(selectedLoginRole);
  loginStatus.textContent = "";
}

function showConfirmationLinkView() {
  if (loginForm) {
    loginForm.hidden = true;
  }
  if (forgotPasswordBtn) {
    forgotPasswordBtn.hidden = true;
  }
  if (confirmLinkForm) {
    confirmLinkForm.hidden = false;
  }
  if (forgotForm) {
    forgotForm.hidden = true;
  }
  if (forgotSentPanel) {
    forgotSentPanel.hidden = true;
  }
  if (resetForm) {
    resetForm.hidden = true;
  }
  if (mfaSetupPanel) {
    mfaSetupPanel.hidden = true;
  }
  if (mfaVerifyPanel) {
    mfaVerifyPanel.hidden = true;
  }
  updateAuthHeader(
    "Resend Confirmation Link",
    "Enter the registered email address and we will resend the account confirmation link."
  );
  window.requestAnimationFrame(() => confirmLinkEmail?.focus());
}

function showForgotView() {
  if (loginForm) {
    loginForm.hidden = true;
  }
  if (forgotPasswordBtn) {
    forgotPasswordBtn.hidden = true;
  }
  if (confirmLinkForm) {
    confirmLinkForm.hidden = true;
  }
  if (forgotForm) {
    forgotForm.hidden = false;
  }
  if (forgotSentPanel) {
    forgotSentPanel.hidden = true;
  }
  if (resetForm) {
    resetForm.hidden = true;
  }
  if (mfaSetupPanel) {
    mfaSetupPanel.hidden = true;
  }
  if (mfaVerifyPanel) {
    mfaVerifyPanel.hidden = true;
  }
  updateAuthHeader(
    "Forgot Password",
    "Enter the registered email address for this dashboard account. We'll send a secure reset link."
  );
  window.requestAnimationFrame(() => forgotEmail?.focus());
}

function showForgotSentView(email = "") {
  if (loginForm) {
    loginForm.hidden = true;
  }
  if (forgotPasswordBtn) {
    forgotPasswordBtn.hidden = true;
  }
  if (confirmLinkForm) {
    confirmLinkForm.hidden = true;
  }
  if (forgotForm) {
    forgotForm.hidden = true;
  }
  if (forgotSentPanel) {
    forgotSentPanel.hidden = false;
  }
  if (resetForm) {
    resetForm.hidden = true;
  }
  if (mfaSetupPanel) {
    mfaSetupPanel.hidden = true;
  }
  if (mfaVerifyPanel) {
    mfaVerifyPanel.hidden = true;
  }
  updateAuthHeader(
    "Check Your Email",
    "A reset link has been sent. Open it, then return here to create a new password."
  );
  if (forgotSentMessage) {
    forgotSentMessage.textContent = email
      ? `We sent a password reset link to ${email}.`
      : "We sent a password reset link to your registered email address.";
  }
}

function showResetView() {
  if (loginForm) {
    loginForm.hidden = true;
  }
  if (forgotPasswordBtn) {
    forgotPasswordBtn.hidden = true;
  }
  if (confirmLinkForm) {
    confirmLinkForm.hidden = true;
  }
  if (forgotForm) {
    forgotForm.hidden = true;
  }
  if (forgotSentPanel) {
    forgotSentPanel.hidden = true;
  }
  if (resetForm) {
    resetForm.hidden = false;
  }
  if (mfaSetupPanel) {
    mfaSetupPanel.hidden = true;
  }
  if (mfaVerifyPanel) {
    mfaVerifyPanel.hidden = true;
  }
  updateAuthHeader(
    "Reset Password",
    "Set a new password for your dashboard account. After saving, log in again with your new password and authenticator code."
  );
  window.requestAnimationFrame(() => newPassword?.focus());
}

function showMfaSetupView() {
  if (loginForm) {
    loginForm.hidden = true;
  }
  if (forgotPasswordBtn) {
    forgotPasswordBtn.hidden = true;
  }
if (confirmLinkForm) {
    confirmLinkForm.hidden = true;
  }
  if (forgotForm) {
    forgotForm.hidden = true;
  }
  if (forgotSentPanel) {
    forgotSentPanel.hidden = true;
  }
  if (resetForm) {
    resetForm.hidden = true;
  }
  if (mfaSetupPanel) {
    mfaSetupPanel.hidden = false;
  }
  if (mfaVerifyPanel) {
    mfaVerifyPanel.hidden = true;
  }
}

function showMfaVerifyView() {
  if (loginForm) {
    loginForm.hidden = true;
  }
  if (forgotPasswordBtn) {
    forgotPasswordBtn.hidden = true;
  }
  if (forgotForm) {
    forgotForm.hidden = true;
  }
  if (forgotSentPanel) {
    forgotSentPanel.hidden = true;
  }
  if (resetForm) {
    resetForm.hidden = true;
  }
  if (mfaSetupPanel) {
    mfaSetupPanel.hidden = true;
  }
  if (mfaVerifyPanel) {
    mfaVerifyPanel.hidden = false;
  }
}

function resetMfaState() {
  pendingMfaSetupFactorId = null;
  pendingMfaVerifyFactorId = null;
  if (mfaQrWrap) {
    mfaQrWrap.innerHTML = "";
  }
  if (mfaSecret) {
    mfaSecret.value = "";
  }
  if (mfaEnrollCode) {
    mfaEnrollCode.value = "";
  }
  if (mfaVerifyCode) {
    mfaVerifyCode.value = "";
  }
}

function setSelectedLoginRole(role) {
  selectedLoginRole = role === "staff" ? "staff" : "lead_therapist";
  if (dentistRoleBtn) {
    dentistRoleBtn.classList.toggle("active", selectedLoginRole === "lead_therapist");
    dentistRoleBtn.setAttribute("aria-selected", selectedLoginRole === "lead_therapist" ? "true" : "false");
  }
  if (staffRoleBtn) {
    staffRoleBtn.classList.toggle("active", selectedLoginRole === "staff");
    staffRoleBtn.setAttribute("aria-selected", selectedLoginRole === "staff" ? "true" : "false");
  }
  if (authTitle) {
    updateAuthHeader(
      selectedLoginRole === "staff" ? "Staff Login" : "Lead Therapist Login",
      selectedLoginRole === "staff"
      ? "Staff can access dashboard using email, password, and authenticator code."
      : "Lead therapist can access dashboard using email, password, and authenticator code."
    );
  }
}

function showToast(message, type = "success") {
  if (!toastRoot || !message) {
    return;
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.setAttribute("role", "status");
  toastRoot.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3200);
}

function getActorRoleLabel() {
  return currentAdminProfile?.role === "staff" ? "staff" : "lead therapist";
}

function showLiveAlert(message, type = "success") {
  if (!liveAlertRoot || !message) {
    return;
  }
  const alert = document.createElement("div");
  alert.className = `toast ${type}`;
  alert.textContent = message;
  alert.setAttribute("role", "status");
  liveAlertRoot.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

function ensureAlertAudioContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) {
    return null;
  }
  if (!alertAudioContext) {
    alertAudioContext = new Ctx();
  }
  if (alertAudioContext.state === "suspended") {
    alertAudioContext.resume().catch(() => {});
  }
  return alertAudioContext;
}

function playBookingNotificationTone() {
  const ctx = ensureAlertAudioContext();
  if (!ctx) {
    return;
  }
  const now = ctx.currentTime;
  [0, 0.22].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now + offset);
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.15, now + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.17);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.18);
  });
}

function minutesToLabel(value) {
  const hours24 = Math.floor(value / 60);
  const minutes = value % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function buildSlots(durationMinutes = SLOT_DURATION_MINUTES) {
  const slots = [];
  for (let m = SLOT_START_MINUTES; m < SLOT_END_MINUTES; m += durationMinutes) {
    const end = m + durationMinutes;
    slots.push(`${minutesToLabel(m)} - ${minutesToLabel(end)}`);
  }
  return slots;
}

function todayYmdInKolkata() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata"
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

async function currentUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
}

async function getAdminProfile() {
  const uid = await currentUserId();
  if (!uid) {
    currentAdminProfile = null;
    return null;
  }

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("user_id, role")
    .eq("user_id", uid)
    .maybeSingle();

  if (error || !data) {
    currentAdminProfile = null;
    return null;
  }

  currentAdminProfile = data;
  return data;
}

async function isAdmin() {
  const profile = await getAdminProfile();
  return !!profile;
}

async function getMfaState() {
  const { data: factorData, error: factorError } = await supabase.auth.mfa.listFactors();
  if (factorError) {
    throw new Error(factorError.message);
  }

  const { data: assuranceData, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assuranceError) {
    throw new Error(assuranceError.message);
  }

  return {
    factors: factorData || { all: [], totp: [] },
    assurance: assuranceData || { currentLevel: null, nextLevel: null }
  };
}

function renderMfaQr(qrCode) {
  if (!mfaQrWrap) {
    return;
  }
  mfaQrWrap.innerHTML = "";
  if (!qrCode) {
    return;
  }
  if (qrCode.includes("<svg")) {
    mfaQrWrap.innerHTML = qrCode;
    return;
  }
  const qrImage = document.createElement("img");
  qrImage.src = qrCode.startsWith("data:")
    ? qrCode
    : `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(qrCode)))}`;
  qrImage.alt = "Authenticator setup QR code";
  mfaQrWrap.appendChild(qrImage);
}

async function finishAdminSignIn() {
  ensureAlertAudioContext();
  if (authCard) {
    authCard.hidden = true;
  }
  dashboard.hidden = false;
  showLoginView();
  resetMfaState();
  setStatus(appStatus, "Logged in. Loading appointments...", "ok");
  startLiveBookingNotifications();
  await loadDashboard();
}

async function cancelMfaFlow() {
  await supabase.auth.signOut();
  currentAdminProfile = null;
  if (authCard) {
    authCard.hidden = false;
  }
  dashboard.hidden = true;
  showLoginView();
  resetMfaState();
  passwordInput.value = "";
  setStatus(loginStatus, "Login cancelled. Please sign in again.", "warn");
}

async function startMfaEnrollment(existingFactors = []) {
  const staleTotpFactors = existingFactors.filter(
    (factor) => factor.factor_type === "totp" && factor.status === "unverified"
  );

  for (const factor of staleTotpFactors) {
    await supabase.auth.mfa.unenroll({ factorId: factor.id }).catch(() => {});
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    issuer: CLINIC_NAME,
    friendlyName: "Clinic Admin"
  });

  if (error) {
    throw new Error(error.message);
  }

  pendingMfaSetupFactorId = data.id;
  if (mfaSecret) {
    mfaSecret.value = data.totp.secret || "";
  }
  renderMfaQr(data.totp.qr_code);
  showMfaSetupView();
  setStatus(loginStatus, "Scan the QR code with your authenticator app, then enter the code to finish setup.", "ok");
}

async function promptMfaVerification(factorId) {
  pendingMfaVerifyFactorId = factorId;
  if (mfaVerifyCode) {
    mfaVerifyCode.value = "";
    mfaVerifyCode.focus();
  }
  showMfaVerifyView();
  setStatus(loginStatus, "Enter the current 6-digit code from your authenticator app.", "ok");
}

async function continueAdminAuthFlow(options = {}) {
  const { enforceSelectedRole = true } = options;
  const adminProfile = await getAdminProfile();
  if (!adminProfile) {
    setStatus(loginStatus, "No admin access. Add this user in admin_profiles table.", "error");
    await supabase.auth.signOut();
    showLoginView();
    return;
  }

  if (
    enforceSelectedRole &&
    selectedLoginRole &&
    ((selectedLoginRole === "lead_therapist" && adminProfile.role !== "lead_therapist") ||
      (selectedLoginRole === "staff" && adminProfile.role !== "staff"))
  ) {
    setStatus(
      loginStatus,
      `This account is registered as ${adminProfile.role}. Please use the correct login tab.`,
      "error"
    );
    await supabase.auth.signOut();
    showLoginView();
    currentAdminProfile = null;
    return;
  }

  const { factors, assurance } = await getMfaState();
  const verifiedTotpFactors = Array.isArray(factors?.totp) ? factors.totp : [];

  if (verifiedTotpFactors.length === 0) {
    await startMfaEnrollment(Array.isArray(factors?.all) ? factors.all : []);
    return;
  }

  if (assurance.currentLevel !== "aal2") {
    await promptMfaVerification(verifiedTotpFactors[0].id);
    return;
  }

  await finishAdminSignIn();
}

async function loadClinicSettings() {
  let { data, error } = await supabase
    .from("clinic_settings")
    .select("slot_duration_minutes, effective_from_date, booking_window_days, weekly_off_days")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    const fallback = await supabase
      .from("clinic_settings")
      .select("slot_duration_minutes, effective_from_date")
      .eq("id", 1)
      .maybeSingle();
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    setStatus(appStatus, `Unable to load settings: ${error.message}`, "error");
    clinicSettings = {
      slot_duration_minutes: 30,
      effective_from_date: todayYmdInKolkata(),
      booking_window_days: 10,
      weekly_off_days: []
    };
    return;
  }
  clinicSettings = {
    slot_duration_minutes: data?.slot_duration_minutes || 30,
    effective_from_date: data?.effective_from_date || todayYmdInKolkata(),
    booking_window_days: data?.booking_window_days || 10,
    weekly_off_days: Array.isArray(data?.weekly_off_days) ? data.weekly_off_days : []
  };
}

function getSlotDurationForDate(dateYmd) {
  if (!clinicSettings?.slot_duration_minutes || !clinicSettings?.effective_from_date) {
    return SLOT_DURATION_MINUTES;
  }
  if (dateYmd >= clinicSettings.effective_from_date) {
    return clinicSettings.slot_duration_minutes;
  }
  return SLOT_DURATION_MINUTES;
}

function fillSlotSelect(selectElement, dateYmd) {
  if (!selectElement) {
    return;
  }
  selectElement.innerHTML = "";
  const duration = dateYmd ? getSlotDurationForDate(dateYmd) : SLOT_DURATION_MINUTES;
  buildSlots(duration).forEach((slot) => {
    const option = document.createElement("option");
    option.value = slot;
    option.textContent = slot;
    selectElement.appendChild(option);
  });
  if (selectElement === slotBlockLabel) {
    updateSlotPickerSummary();
  }
}

function getSelectedEmergencySlots() {
  return Array.from(slotBlockLabel.selectedOptions).map((option) => option.value).filter(Boolean);
}

function updateSlotPickerSummary() {
  if (!slotPickerSummary) {
    return;
  }
  const selected = getSelectedEmergencySlots();
  if (selected.length === 0) {
    slotPickerSummary.textContent = "No session selected";
    return;
  }
  if (selected.length <= 2) {
    slotPickerSummary.textContent = selected.join(" | ");
    return;
  }
  slotPickerSummary.textContent = `${selected.length} sessions selected`;
}

function renderSlotPickerDraft() {
  if (!slotPickerList) {
    return;
  }
  slotPickerList.innerHTML = "";
  Array.from(slotBlockLabel.options).forEach((option) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = `slot-pill${slotPickerDraftSelection.has(option.value) ? " active" : ""}`;
    pill.textContent = option.value;
    pill.dataset.slot = option.value;
    pill.setAttribute("aria-pressed", slotPickerDraftSelection.has(option.value) ? "true" : "false");
    pill.addEventListener("click", () => {
      if (slotPickerDraftSelection.has(option.value)) {
        slotPickerDraftSelection.delete(option.value);
      } else {
        slotPickerDraftSelection.add(option.value);
      }
      renderSlotPickerDraft();
    });
    slotPickerList.appendChild(pill);
  });
}

function openSlotPickerModal() {
  if (!slotBlockDate.value) {
    setStatus(appStatus, "Select block date first.", "warn");
    showToast("Select block date first.", "warn");
    return;
  }
  slotPickerDraftSelection = new Set(getSelectedEmergencySlots());
  renderSlotPickerDraft();
  slotPickerModal.hidden = false;
}

function closeSlotPickerModal() {
  slotPickerModal.hidden = true;
}

function applySlotPickerDraft() {
  Array.from(slotBlockLabel.options).forEach((option) => {
    option.selected = slotPickerDraftSelection.has(option.value);
  });
  updateSlotPickerSummary();
  closeSlotPickerModal();
}

async function handleLogin(event) {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  setStatus(loginStatus, "", "");

  await supabase.auth.signOut().catch(() => {});
  currentAdminProfile = null;
  resetMfaState();

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus(loginStatus, error.message, "error");
      passwordInput?.focus();
      return;
    }

    setStatus(loginStatus, "Password verified. Checking authenticator...", "ok");
    await continueAdminAuthFlow({ enforceSelectedRole: true });
  } catch (authError) {
    const message = authError?.message || "Unable to continue login.";
    setStatus(loginStatus, message, "error");
    await supabase.auth.signOut().catch(() => {});
    showLoginView();
    resetMfaState();
    passwordInput?.focus();
  }
}

async function handleMfaSetupVerify() {
  const code = mfaEnrollCode.value.trim();
  if (!pendingMfaSetupFactorId) {
    setStatus(loginStatus, "Authenticator setup expired. Please login again.", "error");
    await cancelMfaFlow();
    return;
  }
  if (!/^\d{6}$/.test(code)) {
    setStatus(loginStatus, "Enter the 6-digit authenticator code.", "error");
    return;
  }

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: pendingMfaSetupFactorId,
    code
  });

  if (error) {
    setStatus(loginStatus, `Authenticator verification failed: ${error.message}`, "error");
    return;
  }

  setStatus(loginStatus, "Authenticator linked successfully. Opening dashboard...", "ok");
  await finishAdminSignIn();
}

async function handleMfaVerify() {
  const code = mfaVerifyCode.value.trim();
  if (!pendingMfaVerifyFactorId) {
    setStatus(loginStatus, "Authenticator check expired. Please login again.", "error");
    await cancelMfaFlow();
    return;
  }
  if (!/^\d{6}$/.test(code)) {
    setStatus(loginStatus, "Enter the 6-digit authenticator code.", "error");
    return;
  }

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId: pendingMfaVerifyFactorId,
    code
  });

  if (error) {
    setStatus(loginStatus, `Authenticator verification failed: ${error.message}`, "error");
    return;
  }

  setStatus(loginStatus, "Authenticator verified. Opening dashboard...", "ok");
  await finishAdminSignIn();
}

async function handleForgotPassword(event) {
  event.preventDefault();
  const now = Date.now();
  const cooldownUntil = Number(localStorage.getItem(FORGOT_COOLDOWN_KEY) || 0);
  if (cooldownUntil > now) {
    const seconds = Math.ceil((cooldownUntil - now) / 1000);
    setStatus(loginStatus, `Please wait ${seconds}s before requesting again.`, "warn");
    startForgotCooldown(cooldownUntil);
    return;
  }

  const email = forgotEmail.value.trim().toLowerCase();
  if (!email) {
    setStatus(loginStatus, "Enter your registered email.", "error");
    return;
  }

  const redirectTo = `${window.location.origin}/doctors-login.html?mode=reset`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) {
    setStatus(loginStatus, error.message, "error");
    return;
  }

  const newCooldownUntil = Date.now() + FORGOT_COOLDOWN_SECONDS * 1000;
  localStorage.setItem(FORGOT_COOLDOWN_KEY, String(newCooldownUntil));
  startForgotCooldown(newCooldownUntil);
  setStatus(loginStatus, "Password reset link sent. Please check your email.", "ok");
  showForgotSentView(email);
}

async function handleResendConfirmation(event) {
  event.preventDefault();
  const email = confirmLinkEmail.value.trim().toLowerCase();
  if (!email) {
    setStatus(loginStatus, "Enter your registered email.", "error");
    return;
  }

  const emailRedirectTo = `${window.location.origin}/doctors-login.html`;
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo }
  });

  if (error) {
    setStatus(loginStatus, error.message, "error");
    return;
  }

  setStatus(loginStatus, "Confirmation link sent. Please check your email.", "ok");
  showLoginView();
}

function startForgotCooldown(cooldownUntil) {
  if (forgotCooldownTimer) {
    clearInterval(forgotCooldownTimer);
  }

  function tick() {
    const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
    if (remaining <= 0) {
      forgotSubmitBtn.disabled = false;
      forgotCooldownText.textContent = "";
      localStorage.removeItem(FORGOT_COOLDOWN_KEY);
      if (forgotCooldownTimer) {
        clearInterval(forgotCooldownTimer);
        forgotCooldownTimer = null;
      }
      return;
    }
    forgotSubmitBtn.disabled = true;
    forgotCooldownText.textContent = `Reset link cooldown: ${remaining}s`;
  }

  tick();
  forgotCooldownTimer = setInterval(tick, 1000);
}

async function handleResetPassword(event) {
  event.preventDefault();
  const password = newPassword.value;
  const confirmPassword = confirmNewPassword.value;
  if (!password || password.length < 6) {
    setStatus(loginStatus, "New password must be at least 6 characters.", "error");
    return;
  }
  if (password !== confirmPassword) {
    setStatus(loginStatus, "Password and confirm password must match.", "error");
    return;
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    setStatus(loginStatus, error.message, "error");
    return;
  }

  await supabase.auth.signOut().catch(() => {});
  const cleanUrl = `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState({}, "", cleanUrl);
  setStatus(loginStatus, "Password updated. Please login with new password.", "ok");
  showLoginView();
  resetForm.reset();
  emailInput?.focus();
}

function isRecoveryLink() {
  const hash = window.location.hash || "";
  const query = window.location.search || "";
  return (
    hash.includes("type=recovery") ||
    hash.includes("access_token=") ||
    hash.includes("refresh_token=") ||
    hash.includes("token_hash=") ||
    query.includes("type=recovery") ||
    query.includes("token_hash=") ||
    isResetModeRequested()
  );
}

function isResetModeRequested() {
  const url = new URL(window.location.href);
  return url.searchParams.get("mode") === "reset";
}

async function handleRecoveryTokenFromUrl() {
  const url = new URL(window.location.href);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  if (type !== "recovery" || !tokenHash) {
    return false;
  }

  const { error } = await supabase.auth.verifyOtp({
    type: "recovery",
    token_hash: tokenHash
  });

  if (error) {
    setStatus(loginStatus, `Recovery link invalid or expired: ${error.message}`, "error");
    return false;
  }

  const cleanUrl = `${url.origin}${url.pathname}?mode=reset`;
  window.history.replaceState({}, "", cleanUrl);
  recoveryModeActive = true;
  showResetView();
  setStatus(loginStatus, "Recovery verified. Set your new password below.", "ok");
  return true;
}

function getFilters() {
  return {
    status: statusFilter.value,
    from: fromDate.value,
    to: toDate.value,
    service: serviceFilter.value
  };
}

function applyStatusClass(status) {
  return status.toLowerCase();
}

async function loadBlockedDates() {
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("id, from_date, to_date, reason")
    .order("from_date", { ascending: true });

  if (error) {
    setStatus(appStatus, `Blocked dates load failed: ${error.message}`, "error");
    return;
  }

  blockedDatesBody.innerHTML = "";
  (data || []).forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.from_date}</td>
      <td>${row.to_date}</td>
      <td>${row.reason || "-"}</td>
      <td><button type="button" class="btn secondary">Unblock</button></td>
    `;
    tr.querySelector("button").addEventListener("click", async () => {
      const { error: delError } = await supabase.from("blocked_dates").delete().eq("id", row.id);
      if (delError) {
        setStatus(appStatus, `Unable to unblock dates: ${delError.message}`, "error");
        showToast("Unable to unblock dates.", "error");
        return;
      }
      setStatus(appStatus, "Blocked dates removed.", "ok");
      showToast("Blocked dates removed.", "success");
      await loadBlockedDates();
    });
    blockedDatesBody.appendChild(tr);
  });
}

async function loadBlockedSlots() {
  const { data, error } = await supabase
    .from("blocked_slots")
    .select("id, block_date, slot_label, reason")
    .order("block_date", { ascending: true })
    .order("slot_label", { ascending: true });

  if (error) {
    setStatus(appStatus, `Blocked sessions load failed: ${error.message}`, "error");
    return;
  }

  blockedSlotsBody.innerHTML = "";
  (data || []).forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.block_date}</td>
      <td>${row.slot_label}</td>
      <td>${row.reason || "-"}</td>
      <td><button type="button" class="btn secondary">Unblock</button></td>
    `;
    tr.querySelector("button").addEventListener("click", async () => {
      const { error: delError } = await supabase.from("blocked_slots").delete().eq("id", row.id);
      if (delError) {
        setStatus(appStatus, `Unable to unblock session: ${delError.message}`, "error");
        showToast("Unable to unblock session.", "error");
        return;
      }
      setStatus(appStatus, "Blocked session removed.", "ok");
      showToast("Blocked session removed.", "success");
      await loadBlockedSlots();
    });
    blockedSlotsBody.appendChild(tr);
  });
}

function openConfirmModal(appointment, status) {
  pendingStatusAction = { appointment, status };
  const isUnblock = status === "Unblock";
  confirmMessage.textContent = isUnblock
    ? `Unblock approved appointment for ${appointment.patient_name}?`
    : `Change appointment for ${appointment.patient_name} to ${status}?`;
  confirmWhatsappWrap.hidden = isUnblock;
  confirmWhatsappNotify.checked = true;
  confirmReasonWrap.hidden = !isUnblock;
  confirmReason.value = "";
  confirmOk.textContent = isUnblock ? "Unblock" : "Confirm";
  confirmModal.hidden = false;
}

function closeConfirmModal() {
  pendingStatusAction = null;
  confirmReason.value = "";
  confirmWhatsappWrap.hidden = false;
  confirmWhatsappNotify.checked = true;
  confirmReasonWrap.hidden = true;
  confirmOk.textContent = "Confirm";
  confirmModal.hidden = true;
}

function openWhatsappConfirmModal(payload) {
  pendingWhatsappAction = payload;
  if (whatsappConfirmMessage) {
    if (payload.type === "block-conflict") {
      const count = payload.conflicts?.length || 0;
      whatsappConfirmMessage.textContent = `Send the WhatsApp message${count === 1 ? "" : "s"} to the affected patient${count === 1 ? "" : "s"}, then click "Message Sent". The session block will be applied only after confirmation.`;
    } else if (payload.type === "manual-booking") {
      whatsappConfirmMessage.textContent = `Open WhatsApp for ${payload.appointment.patient_name}, send the confirmation message, then click "Message Sent". Manual booking will be finalized only after confirmation.`;
    } else if (payload.status === "Rejected" && payload.reason === "customer requested cancellation") {
      whatsappConfirmMessage.textContent = `Open WhatsApp for ${payload.appointment.patient_name}, send the cancellation message, then click "Message Sent". The appointment will be unblocked only after confirmation.`;
    } else {
      whatsappConfirmMessage.textContent = `Send the WhatsApp message for ${payload.appointment.patient_name}, then click "Message Sent". Status will update only after confirmation.`;
    }
  }
  whatsappConfirmModal.hidden = false;
}

function closeWhatsappConfirmModal() {
  pendingWhatsappAction = null;
  whatsappConfirmModal.hidden = true;
}

function openPendingWhatsappAction(action) {
  if (!action) {
    return;
  }
  if (action.type === "block-conflict") {
    action.conflicts.forEach((appointment) => {
      openWhatsappForClinicBlock(appointment, action.reason);
    });
    return;
  }
  openWhatsappForStatus(action.appointment, action.status, action.reason || "");
}

function openBlockConflictModal(action) {
  pendingBlockConflictAction = action;
  const count = action.conflicts.length;
  if (blockConflictMessage) {
    blockConflictMessage.textContent = `There ${count === 1 ? "is" : "are"} ${count} approved appointment${count === 1 ? "" : "s"} in the selected blocked session${count === 1 ? "" : "s"}. Proceeding will cancel ${count === 1 ? "that appointment" : "those appointments"} and notify patients on WhatsApp with the doctor's reason.`;
  }
  if (blockConflictList) {
    blockConflictList.innerHTML = "";
    action.conflicts.forEach((appointment) => {
      const item = document.createElement("div");
      item.className = "conflict-item";
      item.innerHTML = `<strong>${appointment.patient_name}</strong><small>${appointment.preferred_date} � ${appointment.preferred_slot} � ${appointment.service}</small>`;
      blockConflictList.appendChild(item);
    });
  }
  blockConflictModal.hidden = false;
}

function closeBlockConflictModal() {
  pendingBlockConflictAction = null;
  if (blockConflictList) {
    blockConflictList.innerHTML = "";
  }
  blockConflictModal.hidden = true;
}

function openNoticeModal(message) {
  if (noticeMessage) {
    noticeMessage.textContent = message;
  }
  noticeModal.hidden = false;
  noticeOk?.focus();
}

function closeNoticeModal() {
  noticeModal.hidden = true;
}

function openTotpConfirmModal(message) {
  if (totpConfirmMessage) {
    totpConfirmMessage.textContent = message || "Enter your current 6-digit authenticator code to continue.";
  }
  if (totpConfirmCode) {
    totpConfirmCode.value = "";
  }
  totpConfirmModal.hidden = false;
  totpConfirmCode?.focus();
}

function closeTotpConfirmModal() {
  if (totpConfirmCode) {
    totpConfirmCode.value = "";
  }
  totpConfirmModal.hidden = true;
}

async function verifySensitiveActionTotp(message) {
  const { factors } = await getMfaState();
  const verifiedTotpFactors = Array.isArray(factors?.totp) ? factors.totp : [];
  if (!verifiedTotpFactors.length) {
    throw new Error("No authenticator is linked to this account.");
  }

  return new Promise((resolve) => {
    pendingTotpResolver = async (confirmed) => {
      if (!confirmed) {
        resolve(false);
        return;
      }

      const code = String(totpConfirmCode?.value || "").trim();
      if (!/^\d{6}$/.test(code)) {
        setStatus(appStatus, "Enter the 6-digit authenticator code.", "error");
        return;
      }

      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: verifiedTotpFactors[0].id,
        code
      });

      if (error) {
        setStatus(appStatus, `Authenticator verification failed: ${error.message}`, "error");
        return;
      }

      closeTotpConfirmModal();
      pendingTotpResolver = null;
      resolve(true);
    };

    openTotpConfirmModal(message);
  });
}

function openSettingsModal() {
  if (!clinicSettings) {
    slotDurationSelect.value = "30";
    slotEffectiveDate.value = todayYmdInKolkata();
    bookingWindowDays.value = "10";
    weeklyOffCheckboxes.forEach((box) => {
      box.checked = false;
    });
  } else {
    slotDurationSelect.value = String(clinicSettings.slot_duration_minutes);
    slotEffectiveDate.value = clinicSettings.effective_from_date;
    bookingWindowDays.value = String(clinicSettings.booking_window_days || 10);
    const weeklyOff = Array.isArray(clinicSettings.weekly_off_days) ? clinicSettings.weekly_off_days : [];
    weeklyOffCheckboxes.forEach((box) => {
      box.checked = weeklyOff.includes(box.value);
    });
  }
  if (manageUsersSection) {
    manageUsersSection.hidden = currentAdminProfile?.role !== "lead_therapist";
  }
  if (resetPastDataSection) {
    resetPastDataSection.hidden = currentAdminProfile?.role !== "lead_therapist";
  }
  setManageUsersCollapsed(false);
  if (currentAdminProfile?.role === "lead_therapist") {
    loadAccessUsers();
  }
  if (addUserForm) {
    addUserForm.reset();
    if (newUserRole) {
      newUserRole.value = "staff";
    }
  }
  purgeMonth.value = "";
  purgePassword.value = "";
  if (!settingsModalHistoryActive) {
    window.history.pushState({ ...(window.history.state || {}), controlPanelOpen: true }, "", window.location.href);
    settingsModalHistoryActive = true;
  }
  settingsModal.hidden = false;
}

function closeSettingsModal(fromHistory = false) {
  if (!fromHistory && settingsModalHistoryActive) {
    settingsModalHistoryActive = false;
    window.history.back();
    return;
  }
  settingsModal.hidden = true;
  settingsModalHistoryActive = false;
}

function setCollapseToggleState(button, collapsed, label) {
  if (!button) {
    return;
  }
  button.textContent = collapsed ? "?" : "?";
  const action = collapsed ? "Expand" : "Collapse";
  button.setAttribute("aria-label", `${action} ${label}`);
  button.setAttribute("title", `${action} ${label}`);
}

function setManageUsersCollapsed(collapsed) {
  if (!manageUsersContent || !toggleManageUsersBtn) {
    return;
  }
  manageUsersContent.hidden = collapsed;
  setCollapseToggleState(toggleManageUsersBtn, collapsed, "manage users");
}

async function hasActiveAppointments(dateYmd) {
  const { data, error } = await supabase
    .from("appointments")
    .select("id", { count: "exact" })
    .eq("preferred_date", dateYmd)
    .in("status", ["Pending", "Approved"])
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }
  return (data || []).length > 0;
}

function weekdayNameFromYmd(dateYmd) {
  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const date = new Date(`${dateYmd}T00:00:00+05:30`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return weekdayNames[date.getDay()] || "";
}

function isWeeklyOffDate(dateYmd) {
  const weeklyOffDays = Array.isArray(clinicSettings?.weekly_off_days) ? clinicSettings.weekly_off_days : [];
  if (!weeklyOffDays.length) {
    return false;
  }
  return weeklyOffDays.includes(weekdayNameFromYmd(dateYmd));
}

async function findWeeklyOffConflicts(weeklyOffDays, fromDateYmd) {
  if (!Array.isArray(weeklyOffDays) || weeklyOffDays.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("id, patient_name, preferred_date, preferred_slot, status")
    .gte("preferred_date", fromDateYmd)
    .in("status", ["Pending", "Approved"])
    .order("preferred_date", { ascending: true })
    .limit(500);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).filter((item) => weeklyOffDays.includes(weekdayNameFromYmd(item.preferred_date)));
}

function startLiveBookingNotifications() {
  if (liveBookingChannel || liveBookingPollTimer) {
    return;
  }

  primeLiveAlertState().catch(() => {});
  liveBookingChannel = supabase
    .channel("live-booking-alerts")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "appointments" }, async (payload) => {
      await handleLiveBookingCandidate(payload?.new || {});
    })
    .subscribe();

  liveBookingPollTimer = window.setInterval(() => {
    pollLiveBookingNotifications().catch(() => {});
  }, LIVE_ALERT_POLL_MS);
}

async function fetchRecentLiveAlertCandidates() {
  const { data, error } = await supabase
    .from("appointments")
    .select("id, patient_name, preferred_date, preferred_slot, status, created_at")
    .order("created_at", { ascending: false })
    .limit(25);
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}

async function primeLiveAlertState() {
  const rows = await fetchRecentLiveAlertCandidates();
  rows.forEach((row) => {
    if (row?.id) {
      seenLiveAlertAppointmentIds.add(row.id);
    }
  });
  liveAlertPrimed = true;
}

async function handleLiveBookingCandidate(row) {
  if (!row?.id) {
    return;
  }
  if (seenLiveAlertAppointmentIds.has(row.id)) {
    return;
  }
  seenLiveAlertAppointmentIds.add(row.id);
  if (!liveAlertPrimed) {
    return;
  }
  if ((row.status || "Pending") !== "Pending") {
    return;
  }
  const label = `${row.patient_name || "New patient"} requested ${row.preferred_date || ""} ${row.preferred_slot || ""}`.trim();
  showLiveAlert(`New booking request: ${label}`, "success");
  playBookingNotificationTone();
  await loadDashboard();
}

async function pollLiveBookingNotifications() {
  const rows = await fetchRecentLiveAlertCandidates();
  if (!liveAlertPrimed) {
    rows.forEach((row) => {
      if (row?.id) {
        seenLiveAlertAppointmentIds.add(row.id);
      }
    });
    liveAlertPrimed = true;
    return;
  }
  const orderedRows = [...rows].reverse();
  for (const row of orderedRows) {
    await handleLiveBookingCandidate(row);
  }
}

async function saveClinicSettings(event) {
  event.preventDefault();
  const uid = await currentUserId();
  if (!uid) {
    setStatus(appStatus, "Session expired. Please login again.", "error");
    return;
  }

  const slotDuration = Number(slotDurationSelect.value);
  const effectiveDate = slotEffectiveDate.value;
  const visibilityDays = Number(bookingWindowDays.value);
  const weeklyOffDays = Array.from(weeklyOffCheckboxes)
    .filter((box) => box.checked)
    .map((box) => box.value);
  if (!effectiveDate || ![30, 60].includes(slotDuration) || !Number.isInteger(visibilityDays) || visibilityDays < 1 || visibilityDays > 90) {
    setStatus(appStatus, "Select valid slot duration, visibility days (1-90), and effective date.", "error");
    return;
  }

  try {
    const hasActive = await hasActiveAppointments(effectiveDate);
    if (hasActive) {
      setStatus(appStatus, "Change blocked: active appointments exist on selected date. Choose another date to avoid clashes.", "warn");
      return;
    }

    const weeklyOffConflicts = await findWeeklyOffConflicts(weeklyOffDays, todayYmdInKolkata());
    if (weeklyOffConflicts.length > 0) {
      const sample = weeklyOffConflicts[0];
      setStatus(
        appStatus,
        `Weekly off change blocked: appointments exist on holiday day(s). Example: ${sample.preferred_date} ${sample.preferred_slot} (${sample.patient_name}).`,
        "warn"
      );
      showToast("Cannot save weekly off. Active appointments exist on selected holiday days.", "warn");
      return;
    }
  } catch (checkError) {
    setStatus(appStatus, `Unable to validate appointments: ${checkError.message}`, "error");
    return;
  }

  const { error } = await supabase
    .from("clinic_settings")
    .upsert({
      id: 1,
      slot_duration_minutes: slotDuration,
      booking_window_days: visibilityDays,
      weekly_off_days: weeklyOffDays,
      effective_from_date: effectiveDate,
      updated_by: uid,
      updated_at: new Date().toISOString()
    });

  if (error) {
    setStatus(appStatus, `Unable to save settings: ${error.message}`, "error");
    showToast("Unable to save settings.", "error");
    return;
  }

  await loadClinicSettings();
  fillSlotSelect(slotBlockLabel, slotBlockDate.value || todayYmdInKolkata());
  fillSlotSelect(manualSlot, manualDate.value || todayYmdInKolkata());
  setStatus(appStatus, `Settings saved: ${slotDuration} min slots, ${visibilityDays} day visibility.`, "ok");
  showToast("Settings saved successfully.", "success");
  closeSettingsModal();
}

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }
  const token = data?.session?.access_token;
  if (!token) {
    throw new Error("Session expired. Please login again.");
  }
  return token;
}

async function handleAddUser(event) {
  event.preventDefault();

  if (currentAdminProfile?.role !== "lead_therapist") {
    setStatus(appStatus, "Only lead therapist can add new users.", "error");
    showToast("Only lead therapist can add new users.", "error");
    return;
  }

  const fullName = String(newUserName?.value || "").trim();
  const email = String(newUserEmail?.value || "").trim().toLowerCase();
  const password = String(newUserPassword?.value || "");
  const role = String(newUserRole?.value || "staff").trim().toLowerCase();

  if (!email || !password || !["staff", "lead_therapist"].includes(role)) {
    setStatus(appStatus, "Enter email, temporary password, and a valid role.", "error");
    showToast("Fill all required user details.", "warn");
    return;
  }

  if (password.length < 6) {
    setStatus(appStatus, "Temporary password must be at least 6 characters.", "error");
    showToast("Temporary password must be at least 6 characters.", "warn");
    return;
  }

  addUserBtn.disabled = true;

  try {
    const totpVerified = await verifySensitiveActionTotp("Enter your current authenticator code to add this dashboard user.");
    if (!totpVerified) {
      setStatus(appStatus, "User creation cancelled.", "warn");
      showToast("User creation cancelled.", "warn");
      return;
    }

    const token = await getAccessToken();
    const response = await fetch("/api/admin-create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        role
      })
    });
    const rawText = await response.text();
    let payload = {};
    try {
      payload = rawText ? JSON.parse(rawText) : {};
    } catch {
      payload = { error: rawText || "" };
    }
    if (!response.ok) {
      setStatus(appStatus, payload.error || "Unable to add user.", "error");
      showToast(payload.error || "Unable to add user.", "error");
      return;
    }

    addUserForm.reset();
    if (newUserRole) {
      newUserRole.value = "staff";
    }
    setStatus(appStatus, payload.message || "New user created successfully.", "ok");
    showToast(payload.message || "New user created successfully.", "success");
    await loadAccessUsers();
  } catch (error) {
    setStatus(appStatus, error.message || "Unable to add user.", "error");
    showToast(error.message || "Unable to add user.", "error");
  } finally {
    addUserBtn.disabled = false;
  }
}

function renderAccessUsers(users) {
  if (!userAccessList || !userAccessSummary) {
    return;
  }

  const safeUsers = Array.isArray(users) ? users : [];
  userAccessSummary.textContent = `${safeUsers.length} user${safeUsers.length === 1 ? "" : "s"} currently have dashboard access.`;
  userAccessList.innerHTML = "";

  if (!safeUsers.length) {
    const empty = document.createElement("div");
    empty.className = "user-access-card";
    empty.textContent = "No dashboard users found.";
    userAccessList.appendChild(empty);
    return;
  }

  safeUsers.forEach((user) => {
    const card = document.createElement("div");
    card.className = "user-access-card";

    const name = document.createElement("strong");
    name.textContent = user.fullName || "Unnamed user";

    const meta = document.createElement("div");
    meta.className = "user-access-meta";

    const email = document.createElement("span");
    email.textContent = user.email || "No email";

    const role = document.createElement("span");
    role.className = "user-role-pill";
    role.textContent = user.role || "staff";

    meta.appendChild(email);
    meta.appendChild(role);
    card.appendChild(name);
    card.appendChild(meta);
    userAccessList.appendChild(card);
  });
}

async function loadAccessUsers() {
  if (currentAdminProfile?.role !== "lead_therapist") {
    return;
  }
  if (userAccessSummary) {
    userAccessSummary.textContent = "Loading users...";
  }
  if (userAccessList) {
    userAccessList.innerHTML = "";
  }

  try {
    const token = await getAccessToken();
    const response = await fetch("/api/admin-list-users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const rawText = await response.text();
    let payload = {};
    try {
      payload = rawText ? JSON.parse(rawText) : {};
    } catch {
      payload = { error: rawText || "" };
    }
    if (!response.ok) {
      throw new Error(payload.error || "Unable to load users.");
    }
    renderAccessUsers(payload.users || []);
  } catch (error) {
    if (userAccessSummary) {
      userAccessSummary.textContent = error.message || "Unable to load users.";
    }
    if (userAccessList) {
      userAccessList.innerHTML = "";
    }
  }
}

async function resetPastData() {
  const monthValue = purgeMonth.value;
  const passwordValue = purgePassword.value;

  if (!monthValue) {
    setStatus(appStatus, "Select cutoff month before reset.", "error");
    return;
  }
  if (!passwordValue) {
    setStatus(appStatus, "Enter admin password to confirm reset.", "error");
    return;
  }

  const really = window.confirm(`This will permanently delete old data before ${monthValue}. Continue?`);
  if (!really) {
    return;
  }

  try {
    const token = await getAccessToken();
    const response = await fetch("/.netlify/functions/reset-past-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        cutoffMonth: monthValue,
        password: passwordValue
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(appStatus, payload.error || "Unable to reset past data.", "error");
      showToast(payload.error || "Unable to reset past data.", "error");
      return;
    }
    purgePassword.value = "";
    setStatus(appStatus, payload.message || "Past data reset completed.", "ok");
    showToast(payload.message || "Past data reset completed.", "success");
    await loadDashboard();
  } catch (error) {
    setStatus(appStatus, error.message || "Unable to reset past data.", "error");
    showToast(error.message || "Unable to reset past data.", "error");
  }
}

function normalizeWhatsappPhone(rawPhone) {
  const digits = String(rawPhone || "").replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.startsWith("0") && digits.length > 10) {
    return digits.slice(1);
  }
  return digits;
}

function openWhatsappForStatus(appointment, status, reasonOverride = "") {
  const phone = normalizeWhatsappPhone(appointment.patient_phone);
  if (!phone) {
    setStatus(appStatus, "Status updated, but patient phone is invalid for WhatsApp.", "warn");
    return;
  }

  const isApproved = status === "Approved";
  const isCancellation = status === "Rejected" && reasonOverride === "customer requested cancellation";
  const message = isApproved
    ? [
      `Hi ${appointment.patient_name},`,
      "Your appointment is confirmed.",
      `Date: ${appointment.preferred_date}`,
      `Slot: ${appointment.preferred_slot}`,
      `Service: ${appointment.service}`,
      "Please arrive 10 minutes early.",
      CLINIC_NAME
    ].join("\n")
    : isCancellation
      ? [
        `Hi ${appointment.patient_name},`,
        "Your appointment has been cancelled as requested.",
        `Date: ${appointment.preferred_date}`,
        `Slot: ${appointment.preferred_slot}`,
        `Service: ${appointment.service}`,
        `Please contact ${CLINIC_NAME} if you would like to reschedule.`,
        CLINIC_NAME
      ].join("\n")
    : [
      `Hi ${appointment.patient_name},`,
      "Your appointment request could not be confirmed for the selected slot.",
      `Date Requested: ${appointment.preferred_date}`,
      `Slot Requested: ${appointment.preferred_slot}`,
      `Please reply on WhatsApp or call ${CLINIC_PHONE.replace("+91", "")} to book another slot.`,
      CLINIC_NAME
    ].join("\n");

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener");
}

function openWhatsappForClinicBlock(appointment, reason) {
  const phone = normalizeWhatsappPhone(appointment.patient_phone);
  if (!phone) {
    setStatus(appStatus, "Appointment cancelled, but patient phone is invalid for WhatsApp.", "warn");
    return;
  }

  const message = [
    `Hi ${appointment.patient_name},`,
    "Your confirmed appointment needs to be cancelled by the clinic.",
    `Date: ${appointment.preferred_date}`,
    `Slot: ${appointment.preferred_slot}`,
    `Service: ${appointment.service}`,
    `Reason: ${reason}`,
    `Please contact ${CLINIC_NAME} to reschedule.`,
    CLINIC_NAME
  ].join("\n");

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener");
}

async function updateStatus(appointment, status, reasonOverride = "", notifyWhatsapp = true) {
  const uid = await currentUserId();
  const isUnblock = status === "Unblock";
  const finalStatus = isUnblock ? "Rejected" : status;
  const unblockReason = isUnblock ? reasonOverride : "";
  const actorRole = getActorRoleLabel();
  const shouldNotifyWhatsapp = !isUnblock && notifyWhatsapp && (finalStatus === "Approved" || finalStatus === "Rejected");
  const whatsappSentAt = shouldNotifyWhatsapp ? new Date().toISOString() : null;
  let statusNote = appointment.status_note;
  if (isUnblock) {
    statusNote = `Unblocked by ${actorRole}: ${unblockReason}`;
  } else if (finalStatus === "Approved") {
    statusNote = `Approved by ${actorRole}`;
  } else if (finalStatus === "Rejected") {
    statusNote = `Rejected by ${actorRole}`;
  }

  const patch = {
    status: finalStatus,
    status_note: statusNote,
    approved_at: finalStatus === "Approved" ? new Date().toISOString() : null,
    approved_by: finalStatus === "Approved" ? uid : null,
    whatsapp_sent_at: whatsappSentAt
  };

  const { error } = await supabase.from("appointments").update(patch).eq("id", appointment.id);
  if (error) {
    setStatus(appStatus, `Status update failed: ${error.message}`, "error");
    showToast("Status update failed.", "error");
    return;
  }

  setStatus(appStatus, isUnblock ? "Appointment unblocked with reason." : `Appointment marked as ${finalStatus}.`, "ok");
  showToast(isUnblock ? "Appointment unblocked." : `Appointment ${finalStatus.toLowerCase()}.`, "success");
  await loadDashboard();
}

async function getDateBlockedInfo(dateYmd) {
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("id, reason")
    .lte("from_date", dateYmd)
    .gte("to_date", dateYmd)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data || null;
}

async function getSlotBlockedInfo(dateYmd, slotLabel) {
  const { data, error } = await supabase
    .from("blocked_slots")
    .select("id, reason")
    .eq("block_date", dateYmd)
    .eq("slot_label", slotLabel)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data || null;
}

async function isSlotAlreadyApproved(dateYmd, slotLabel) {
  const { data, error } = await supabase
    .from("appointments")
    .select("id")
    .eq("preferred_date", dateYmd)
    .eq("preferred_slot", slotLabel)
    .eq("status", "Approved")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return !!data;
}

async function getApprovedAppointmentsForSlots(dateYmd, slotLabels) {
  if (!dateYmd || !Array.isArray(slotLabels) || slotLabels.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from("appointments")
    .select("id, patient_name, patient_phone, preferred_date, preferred_slot, service, status, notes, status_note")
    .eq("preferred_date", dateYmd)
    .eq("status", "Approved")
    .in("preferred_slot", slotLabels)
    .order("preferred_slot", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}

async function applySessionBlocks(blockDate, selectedSlots, reason, uid) {
  const rows = selectedSlots.map((slot) => ({
    block_date: blockDate,
    slot_label: slot,
    reason: reason || null,
    created_by: uid
  }));

  const { error } = await supabase
    .from("blocked_slots")
    .upsert(rows, { onConflict: "block_date,slot_label", ignoreDuplicates: true });

  if (error) {
    throw new Error(error.message);
  }
}

async function cancelAppointmentsForBlockedSessions(conflicts, reason, uid) {
  for (const appointment of conflicts) {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "Rejected",
          status_note: `Cancelled by ${getActorRoleLabel()} during session block: ${reason}`,
          approved_at: null,
          approved_by: null,
          whatsapp_sent_at: new Date().toISOString()
      })
      .eq("id", appointment.id);

    if (error) {
      throw new Error(error.message);
    }
  }
}

function makeCell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

function buildRow(appointment) {
  const tr = document.createElement("tr");

  const patient = document.createElement("td");
  const patientName = document.createElement("div");
  patientName.textContent = appointment.patient_name;
  const patientPhone = document.createElement("small");
  patientPhone.textContent = appointment.patient_phone;
  patient.append(patientName, patientPhone);

  const slot = document.createElement("td");
  const date = document.createElement("div");
  date.textContent = appointment.preferred_date;
  const time = document.createElement("small");
  time.textContent = appointment.preferred_slot;
  slot.append(date, time);

  const service = makeCell(appointment.service);

  const status = document.createElement("td");
  const statusBadge = document.createElement("span");
  statusBadge.className = `badge ${applyStatusClass(appointment.status)}`;
  statusBadge.textContent = appointment.status;
  status.appendChild(statusBadge);

  const noteText = appointment.status_note
    ? `${appointment.notes || "-"} | ${appointment.status_note}`
    : (appointment.notes || "-");
  const notes = makeCell(noteText);

  const actions = document.createElement("td");
  const actionWrap = document.createElement("div");
  actionWrap.className = "actions";

  if (appointment.status === "Pending") {
    const approveButton = document.createElement("button");
    approveButton.type = "button";
    approveButton.className = "btn";
    approveButton.textContent = "Approve";
    approveButton.addEventListener("click", () => openConfirmModal(appointment, "Approved"));

    const rejectButton = document.createElement("button");
    rejectButton.type = "button";
    rejectButton.className = "btn secondary";
    rejectButton.textContent = "Reject";
    rejectButton.addEventListener("click", () => openConfirmModal(appointment, "Rejected"));

    actionWrap.append(approveButton, rejectButton);
  } else if (appointment.status === "Approved" && appointment.preferred_date >= todayYmdInKolkata()) {
    const unblockButton = document.createElement("button");
    unblockButton.type = "button";
    unblockButton.className = "btn secondary";
    unblockButton.textContent = "Unblock";
    unblockButton.addEventListener("click", () => openConfirmModal(appointment, "Unblock"));
    actionWrap.appendChild(unblockButton);
  } else {
    const done = document.createElement("span");
    done.textContent = "-";
    actionWrap.appendChild(done);
  }

  actions.appendChild(actionWrap);

  tr.append(patient, slot, service, status, notes, actions);
  return tr;
}

function computeKpi(appointments, visits) {
  const total = appointments.length;
  const pending = appointments.filter((x) => x.status === "Pending").length;
  const approved = appointments.filter((x) => x.status === "Approved").length;
  const approvalRate = total ? `${Math.round((approved / total) * 100)}%` : "0%";

  kpiVisits.textContent = String(visits);
  kpiBookings.textContent = String(total);
  kpiPending.textContent = String(pending);
  kpiApproval.textContent = approvalRate;
}

function slotStartMinutes(slotLabel) {
  const match = String(slotLabel || "").match(/^(\d{1,2}):(\d{2})\s(AM|PM)/);
  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }
  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  if (match[3] === "PM") {
    hours += 12;
  }
  return hours * 60 + minutes;
}

function actionButton(label, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tiny-btn";
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

function setTimelineCollapsed(collapsed) {
  if (!timelineContent || !toggleTimelineBtn) {
    return;
  }
  timelineContent.hidden = collapsed;
  setCollapseToggleState(toggleTimelineBtn, collapsed, "day snapshot");
}

function setAppointmentsCollapsed(collapsed) {
  if (!appointmentsContent || !toggleAppointmentsBtn) {
    return;
  }
  appointmentsContent.hidden = collapsed;
  setCollapseToggleState(toggleAppointmentsBtn, collapsed, "appointments");
}

function setEmergencyBlockCollapsed(collapsed) {
  if (!emergencyBlockContent || !toggleEmergencyBlockBtn) {
    return;
  }
  emergencyBlockContent.hidden = collapsed;
  setCollapseToggleState(toggleEmergencyBlockBtn, collapsed, "emergency session blocking");
}

function setLeaveBlockCollapsed(collapsed) {
  if (!leaveBlockContent || !toggleLeaveBlockBtn) {
    return;
  }
  leaveBlockContent.hidden = collapsed;
  setCollapseToggleState(toggleLeaveBlockBtn, collapsed, "holiday and leave blocking");
}

async function loadTimeline() {
  if (!timelineDate || !timelineBody || !timelineSummary) {
    return;
  }

  const selectedDate = timelineDate.value || todayYmdInKolkata();
  const duration = getSlotDurationForDate(selectedDate);
  const daySlots = buildSlots(duration);
  timelineBody.innerHTML = "";
  timelineBody.classList.remove("overlay-active");
  timelineSummary.textContent = "Loading timeline...";

  const [appointmentsResult, blockedDateResult, blockedSlotsResult] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, patient_name, patient_phone, preferred_date, preferred_slot, service, status, notes, status_note")
      .eq("preferred_date", selectedDate)
      .order("preferred_slot", { ascending: true }),
    supabase
      .from("blocked_dates")
      .select("id, reason")
      .lte("from_date", selectedDate)
      .gte("to_date", selectedDate)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("blocked_slots")
      .select("slot_label, reason")
      .eq("block_date", selectedDate)
  ]);

  if (appointmentsResult.error) {
    timelineSummary.textContent = `Unable to load timeline: ${appointmentsResult.error.message}`;
    return;
  }
  if (blockedDateResult.error) {
    timelineSummary.textContent = `Unable to load blocked date: ${blockedDateResult.error.message}`;
    return;
  }
  if (blockedSlotsResult.error) {
    timelineSummary.textContent = `Unable to load blocked sessions: ${blockedSlotsResult.error.message}`;
    return;
  }

  const appointments = appointmentsResult.data || [];
  const blockedDate = blockedDateResult.data || null;
  const weeklyOff = isWeeklyOffDate(selectedDate);
  const blockedSlots = blockedSlotsResult.data || [];
  const bySlot = new Map();
  appointments.forEach((item) => {
    if (!bySlot.has(item.preferred_slot)) {
      bySlot.set(item.preferred_slot, []);
    }
    bySlot.get(item.preferred_slot).push(item);
  });
  bySlot.forEach((list) => list.sort((a, b) => slotStartMinutes(a.preferred_slot) - slotStartMinutes(b.preferred_slot)));
  const blockedSlotMap = new Map(blockedSlots.map((x) => [x.slot_label, x.reason || "Blocked by clinic"]));

  const pendingCount = appointments.filter((x) => x.status === "Pending").length;
  const approvedCount = appointments.filter((x) => x.status === "Approved").length;
  const blockedCount = blockedSlots.length;
  if (blockedDate) {
    const reason = blockedDate.reason ? ` Reason: ${blockedDate.reason}` : "";
    timelineSummary.textContent = `${selectedDate} is blocked for bookings.${reason}`;
  } else if (weeklyOff) {
    timelineSummary.textContent = `${selectedDate} is a weekly off day.`;
  } else {
    timelineSummary.textContent = `${selectedDate}: ${appointments.length} booking(s), ${pendingCount} pending, ${approvedCount} approved, ${blockedCount} blocked session(s).`;
  }

  daySlots.forEach((slotLabel) => {
    const row = document.createElement("div");
    row.className = "timeline-row";

    const time = document.createElement("div");
    time.className = "timeline-time";
    time.textContent = slotLabel;

    const slot = document.createElement("div");
    slot.className = "timeline-slot";

    if (blockedDate || weeklyOff) {
      const blocked = document.createElement("div");
      blocked.className = "timeline-item rejected";
      const blockedLabel = blockedDate ? "Day blocked" : "Weekly off";
      const blockedReason = blockedDate?.reason || (weeklyOff ? "Clinic is closed for this day." : "Clinic holiday / leave");
      blocked.innerHTML = `<div class="timeline-title">${blockedLabel}</div><div class="timeline-sub">${blockedReason}</div>`;
      slot.appendChild(blocked);
    } else if (blockedSlotMap.has(slotLabel)) {
      const blocked = document.createElement("div");
      blocked.className = "timeline-item rejected";
      blocked.innerHTML = `<div class="timeline-title">Session blocked</div><div class="timeline-sub">${blockedSlotMap.get(slotLabel)}</div>`;
      slot.appendChild(blocked);
    } else {
      const items = bySlot.get(slotLabel) || [];
      if (items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "timeline-empty";
        empty.textContent = "Available";
        slot.appendChild(empty);
      } else {
        items.forEach((appointment) => {
          const item = document.createElement("div");
          item.className = `timeline-item ${applyStatusClass(appointment.status)}`;
          const title = document.createElement("div");
          title.className = "timeline-title";
          title.textContent = `${appointment.patient_name} � ${appointment.service}`;
          const sub = document.createElement("div");
          sub.className = "timeline-sub";
          sub.textContent = `${appointment.patient_phone} � ${appointment.status}`;
          item.append(title, sub);

          if (appointment.notes || appointment.status_note) {
            const note = document.createElement("div");
            note.className = "timeline-sub";
            note.textContent = appointment.status_note ? `${appointment.notes || "-"} | ${appointment.status_note}` : (appointment.notes || "-");
            item.appendChild(note);
          }

          if (appointment.status === "Pending") {
            const actions = document.createElement("div");
            actions.className = "timeline-actions";
            actions.append(
              actionButton("Approve", () => openConfirmModal(appointment, "Approved")),
              actionButton("Reject", () => openConfirmModal(appointment, "Rejected"))
            );
            item.appendChild(actions);
          } else if (appointment.status === "Approved") {
            const actions = document.createElement("div");
            actions.className = "timeline-actions";
            actions.append(actionButton("Unblock", () => openConfirmModal(appointment, "Unblock")));
            item.appendChild(actions);
          }

          slot.appendChild(item);
        });
      }
    }

    row.append(time, slot);
    timelineBody.appendChild(row);
  });

  if (blockedDate || weeklyOff) {
    timelineBody.classList.add("overlay-active");
    const notice = document.createElement("div");
    notice.className = "timeline-day-notice";
    const reason = blockedDate?.reason ? ` Reason: ${blockedDate.reason}` : "";
    notice.textContent = blockedDate
      ? `Clinic is unavailable for this day.${reason}`
      : "Clinic is closed on this day (weekly off).";
    timelineBody.appendChild(notice);
  }
}

async function loadDashboard() {
  await loadClinicSettings();
  const filter = getFilters();

  let query = supabase
    .from("appointments")
    .select("id, patient_name, patient_phone, preferred_date, preferred_slot, service, status, notes, status_note, approved_at, approved_by, created_at")
    .order("preferred_date", { ascending: true })
    .order("preferred_slot", { ascending: true });

  if (filter.status) {
    query = query.eq("status", filter.status);
  }
  if (filter.service) {
    query = query.eq("service", filter.service);
  }
  if (filter.from) {
    query = query.gte("preferred_date", filter.from);
  }
  if (filter.to) {
    query = query.lte("preferred_date", filter.to);
  }

  const [{ data: appointments, error }, { count: visitCount }] = await Promise.all([
    query,
    supabase.from("visitor_events").select("id", { count: "exact", head: true }).eq("event_name", "page_visit")
  ]);

  if (error) {
    setStatus(appStatus, error.message, "error");
    return;
  }

  tableBody.innerHTML = "";
  (appointments || []).forEach((item) => tableBody.appendChild(buildRow(item)));
  computeKpi(appointments || [], visitCount || 0);
  await loadBlockedDates();
  await loadBlockedSlots();
  await loadTimeline();
  setStatus(appStatus, "Dashboard up to date.", "ok");
}

function setDefaultDateRange() {
  const start = todayYmdInKolkata();
  const windowDays = Number(clinicSettings?.booking_window_days || 10);
  const endDate = new Date(`${start}T00:00:00+05:30`);
  endDate.setDate(endDate.getDate() + Math.max(1, Math.min(90, windowDays)));
  const end = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
  fromDate.value = start;
  toDate.value = end;
}

async function init() {
  await loadClinicSettings();
  if (timelineDate) {
    timelineDate.value = todayYmdInKolkata();
  }
  fillSlotSelect(slotBlockLabel, todayYmdInKolkata());
  fillSlotSelect(manualSlot, todayYmdInKolkata());
  SERVICES.forEach((service) => {
    const option = document.createElement("option");
    option.value = service;
    option.textContent = service;
    manualService.appendChild(option);
  });

  setDefaultDateRange();
  showLoginView();
  setSelectedLoginRole("lead_therapist");

  loginForm.addEventListener("submit", handleLogin);
  dentistRoleBtn?.addEventListener("click", () => setSelectedLoginRole("lead_therapist"));
  staffRoleBtn?.addEventListener("click", () => setSelectedLoginRole("staff"));
  if (mfaSetupVerifyBtn) {
    mfaSetupVerifyBtn.addEventListener("click", handleMfaSetupVerify);
  }
  if (mfaVerifyBtn) {
    mfaVerifyBtn.addEventListener("click", handleMfaVerify);
  }
  if (mfaSetupCancelBtn) {
    mfaSetupCancelBtn.addEventListener("click", cancelMfaFlow);
  }
  if (mfaVerifyCancelBtn) {
    mfaVerifyCancelBtn.addEventListener("click", cancelMfaFlow);
  }
  if (mfaEnrollCode) {
    mfaEnrollCode.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleMfaSetupVerify();
      }
    });
  }
  if (mfaVerifyCode) {
    mfaVerifyCode.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleMfaVerify();
      }
    });
  }
  openSettingsBtn.addEventListener("click", openSettingsModal);
  settingsCancelBtn.addEventListener("click", closeSettingsModal);
  settingsCloseBtn?.addEventListener("click", closeSettingsModal);
  settingsForm.addEventListener("submit", saveClinicSettings);
  addUserForm?.addEventListener("submit", handleAddUser);
  refreshUsersBtn?.addEventListener("click", loadAccessUsers);
  toggleManageUsersBtn?.addEventListener("click", () => {
    const collapsed = !manageUsersContent || manageUsersContent.hidden;
    setManageUsersCollapsed(!collapsed);
  });
  settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      closeSettingsModal();
    }
  });
  window.addEventListener("popstate", () => {
    if (!settingsModal.hidden) {
      closeSettingsModal(true);
    }
  });
  if (timelineDate) {
    timelineDate.addEventListener("change", loadTimeline);
  }
  if (refreshTimelineBtn) {
    refreshTimelineBtn.addEventListener("click", loadTimeline);
  }
  if (toggleTimelineBtn) {
    toggleTimelineBtn.addEventListener("click", () => {
      const currentlyCollapsed = !timelineContent || timelineContent.hidden;
      setTimelineCollapsed(!currentlyCollapsed);
    });
  }
  const mobileAdminQuery = window.matchMedia("(max-width: 620px)");
  setTimelineCollapsed(false);
  if (toggleAppointmentsBtn) {
    toggleAppointmentsBtn.addEventListener("click", () => {
      const currentlyCollapsed = !appointmentsContent || appointmentsContent.hidden;
      setAppointmentsCollapsed(!currentlyCollapsed);
    });
  }
  setAppointmentsCollapsed(mobileAdminQuery.matches);
  if (toggleEmergencyBlockBtn) {
    toggleEmergencyBlockBtn.addEventListener("click", () => {
      const currentlyCollapsed = !emergencyBlockContent || emergencyBlockContent.hidden;
      setEmergencyBlockCollapsed(!currentlyCollapsed);
    });
  }
  setEmergencyBlockCollapsed(mobileAdminQuery.matches);
  if (toggleLeaveBlockBtn) {
    toggleLeaveBlockBtn.addEventListener("click", () => {
      const currentlyCollapsed = !leaveBlockContent || leaveBlockContent.hidden;
      setLeaveBlockCollapsed(!currentlyCollapsed);
    });
  }
  setLeaveBlockCollapsed(mobileAdminQuery.matches);

  slotBlockDate.addEventListener("change", () => {
    fillSlotSelect(slotBlockLabel, slotBlockDate.value || todayYmdInKolkata());
    slotPickerDraftSelection = new Set();
    updateSlotPickerSummary();
  });
  manualDate.addEventListener("change", () => {
    fillSlotSelect(manualSlot, manualDate.value || todayYmdInKolkata());
  });

  forgotPasswordBtn.addEventListener("click", showForgotView);
  confirmLinkBackBtn?.addEventListener("click", showLoginView);
  confirmLinkForm?.addEventListener("submit", handleResendConfirmation);
  forgotBackBtn?.addEventListener("click", showLoginView);
  forgotSentBackBtn?.addEventListener("click", showLoginView);
  forgotTryAgainBtn?.addEventListener("click", showForgotView);
  forgotSentResendConfirmBtn?.addEventListener("click", showConfirmationLinkView);
  forgotForm.addEventListener("submit", handleForgotPassword);
  const savedCooldown = Number(localStorage.getItem(FORGOT_COOLDOWN_KEY) || 0);
  if (savedCooldown > Date.now()) {
    startForgotCooldown(savedCooldown);
  }
  resetForm.addEventListener("submit", handleResetPassword);
  resetBackBtn?.addEventListener("click", showLoginView);
  supabase.auth.onAuthStateChange((eventName) => {
    if (eventName === "PASSWORD_RECOVERY" || (eventName === "SIGNED_IN" && (recoveryModeActive || isResetModeRequested()))) {
      recoveryModeActive = true;
      showResetView();
      setStatus(loginStatus, "Recovery verified. Set your new password below.", "ok");
    }
  });
  const handledTokenRecovery = await handleRecoveryTokenFromUrl();
  if (handledTokenRecovery || isResetModeRequested() || isRecoveryLink()) {
    recoveryModeActive = true;
    showResetView();
    setStatus(loginStatus, "Set your new password below.", "ok");
  } else if (!isRecoveryLink() && !isResetModeRequested()) {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      try {
        await continueAdminAuthFlow({ enforceSelectedRole: false });
      } catch (sessionError) {
        setStatus(loginStatus, sessionError.message || "Unable to restore admin session.", "error");
        await supabase.auth.signOut().catch(() => {});
        showLoginView();
        resetMfaState();
      }
    }
  }
  quickTabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      const status = tab.dataset.status || "";
      statusFilter.value = status;
      quickTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      await loadDashboard();
    });
  });

  confirmCancel.addEventListener("click", closeConfirmModal);
  confirmOk.addEventListener("click", async () => {
    if (!pendingStatusAction) {
      closeConfirmModal();
      return;
    }
    const { appointment, status } = pendingStatusAction;
    const unblockReason = confirmReason.value;
    const notifyWhatsapp = Boolean(confirmWhatsappNotify?.checked);
    if (status === "Unblock" && !unblockReason) {
      setStatus(appStatus, "Please select reason before unblocking.", "warn");
      return;
    }
    closeConfirmModal();
    if (status === "Unblock" && unblockReason === "customer requested cancellation") {
      openWhatsappConfirmModal({
        type: "status",
        appointment,
        status: "Rejected",
        reason: unblockReason
      });
      return;
    }
    if (status !== "Unblock" && notifyWhatsapp) {
      openWhatsappConfirmModal({ type: "status", appointment, status });
      return;
    }
    await updateStatus(appointment, status, unblockReason, notifyWhatsapp);
  });

  confirmModal.addEventListener("click", (event) => {
    if (event.target === confirmModal) {
      closeConfirmModal();
    }
  });

  whatsappConfirmCancel?.addEventListener("click", () => {
    closeWhatsappConfirmModal();
    setStatus(appStatus, "Status not changed. WhatsApp confirmation was cancelled.", "warn");
    showToast("Status not changed. WhatsApp confirmation cancelled.", "warn");
  });

  whatsappConfirmOpen?.addEventListener("click", () => {
    if (!pendingWhatsappAction) {
      return;
    }
    openPendingWhatsappAction(pendingWhatsappAction);
  });

  whatsappConfirmSent?.addEventListener("click", async () => {
    if (!pendingWhatsappAction) {
      closeWhatsappConfirmModal();
      return;
    }
    const action = pendingWhatsappAction;
    closeWhatsappConfirmModal();
    if (action.type === "block-conflict") {
      try {
        await cancelAppointmentsForBlockedSessions(action.conflicts, action.reason, action.uid);
        await applySessionBlocks(action.blockDate, action.selectedSlots, action.reason, action.uid);
        slotBlockForm.reset();
        fillSlotSelect(slotBlockLabel, action.blockDate || todayYmdInKolkata());
        slotPickerDraftSelection = new Set();
        updateSlotPickerSummary();
        setStatus(appStatus, `${action.selectedSlots.length} session(s) blocked and affected patients marked cancelled.`, "ok");
        showToast("Session blocked and affected patients updated.", "success");
        await loadBlockedSlots();
        await loadDashboard();
      } catch (error) {
        setStatus(appStatus, `Unable to complete conflict block: ${error.message}`, "error");
        showToast("Unable to complete conflict block.", "error");
      }
      return;
    }
    if (action.type === "manual-booking") {
      try {
        const { error } = await supabase
          .from("appointments")
          .update({ whatsapp_sent_at: new Date().toISOString() })
          .eq("id", action.appointment.id);
        if (error) {
          throw new Error(error.message);
        }
        setStatus(appStatus, "Manual booking created and WhatsApp confirmed.", "ok");
        showToast("Manual booking finalized.", "success");
        await loadDashboard();
      } catch (error) {
        setStatus(appStatus, `Unable to finalize manual booking: ${error.message}`, "error");
        showToast("Unable to finalize manual booking.", "error");
      }
      return;
    }
    await updateStatus(action.appointment, action.status, "", true);
  });

  whatsappConfirmModal?.addEventListener("click", (event) => {
    if (event.target === whatsappConfirmModal) {
      closeWhatsappConfirmModal();
    }
  });

  blockConflictCancel?.addEventListener("click", () => {
    closeBlockConflictModal();
    setStatus(appStatus, "Session block cancelled.", "warn");
  });

  blockConflictProceed?.addEventListener("click", async () => {
    if (!pendingBlockConflictAction) {
      closeBlockConflictModal();
      return;
    }
    const action = pendingBlockConflictAction;
    closeBlockConflictModal();
    openWhatsappConfirmModal({ type: "block-conflict", ...action });
  });

  blockConflictModal?.addEventListener("click", (event) => {
    if (event.target === blockConflictModal) {
      closeBlockConflictModal();
    }
  });

  noticeOk?.addEventListener("click", closeNoticeModal);
  noticeModal?.addEventListener("click", (event) => {
    if (event.target === noticeModal) {
      closeNoticeModal();
    }
  });
  totpConfirmCancel?.addEventListener("click", () => {
    closeTotpConfirmModal();
    if (pendingTotpResolver) {
      const resolver = pendingTotpResolver;
      pendingTotpResolver = null;
      resolver(false);
    }
  });
  totpConfirmOk?.addEventListener("click", async () => {
    if (!pendingTotpResolver) {
      closeTotpConfirmModal();
      return;
    }
    const resolver = pendingTotpResolver;
    await resolver(true);
  });
  totpConfirmCode?.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!pendingTotpResolver) {
        closeTotpConfirmModal();
        return;
      }
      const resolver = pendingTotpResolver;
      await resolver(true);
    }
  });
  totpConfirmModal?.addEventListener("click", (event) => {
    if (event.target === totpConfirmModal && pendingTotpResolver) {
      const resolver = pendingTotpResolver;
      pendingTotpResolver = null;
      closeTotpConfirmModal();
      resolver(false);
    }
  });

  document.getElementById("applyFilters").addEventListener("click", loadDashboard);
  document.getElementById("resetFilters").addEventListener("click", () => {
    statusFilter.value = "";
    serviceFilter.value = "";
    setDefaultDateRange();
    loadDashboard();
  });
  if (refreshDashboardBtn) {
    refreshDashboardBtn.addEventListener("click", async () => {
      setStatus(appStatus, "Refreshing data...", "ok");
      await loadDashboard();
    });
  }
  if (purgeDataBtn) {
    purgeDataBtn.addEventListener("click", resetPastData);
  }

  if (slotPickerOpenBtn) {
    slotPickerOpenBtn.addEventListener("click", openSlotPickerModal);
  }
  if (slotPickerCancelBtn) {
    slotPickerCancelBtn.addEventListener("click", closeSlotPickerModal);
  }
  if (slotPickerApplyBtn) {
    slotPickerApplyBtn.addEventListener("click", applySlotPickerDraft);
  }
  if (slotPickerModal) {
    slotPickerModal.addEventListener("click", (event) => {
      if (event.target === slotPickerModal) {
        closeSlotPickerModal();
      }
    });
  }

  document.getElementById("logout").addEventListener("click", async () => {
    await supabase.auth.signOut();
    currentAdminProfile = null;
    window.location.reload();
  });

  blockForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const uid = await currentUserId();
    if (!uid) {
      setStatus(appStatus, "Session expired. Please login again.", "error");
      return;
    }

    if (!blockFromDate.value || !blockToDate.value) {
      setStatus(appStatus, "Select both from and to dates.", "error");
      return;
    }

    if (blockFromDate.value > blockToDate.value) {
      setStatus(appStatus, "From date cannot be after To date.", "error");
      return;
    }

    const payload = {
      from_date: blockFromDate.value,
      to_date: blockToDate.value,
      reason: blockReason.value.trim() || null,
      created_by: uid
    };

    const { error } = await supabase.from("blocked_dates").insert(payload);
    if (error) {
      setStatus(appStatus, `Unable to block dates: ${error.message}`, "error");
      showToast("Unable to block dates.", "error");
      return;
    }

    blockForm.reset();
    setStatus(appStatus, "Dates blocked successfully.", "ok");
    showToast("Dates blocked successfully.", "success");
    await loadBlockedDates();
  });

  slotBlockForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const uid = await currentUserId();
    if (!uid) {
      setStatus(appStatus, "Session expired. Please login again.", "error");
      return;
    }

    if (!slotBlockDate.value) {
      setStatus(appStatus, "Select block date.", "error");
      showToast("Select block date first.", "warn");
      return;
    }

    const selectedSlots = getSelectedEmergencySlots();
    if (selectedSlots.length === 0) {
      setStatus(appStatus, "Select at least one session slot.", "error");
      showToast("Select at least one session slot.", "warn");
      return;
    }
    const reason = slotBlockReason.value.trim();

    try {
      const conflicts = await getApprovedAppointmentsForSlots(slotBlockDate.value, selectedSlots);
      if (conflicts.length > 0) {
        if (!reason) {
          setStatus(appStatus, "Enter doctor reason before blocking a session with approved appointments.", "warn");
          showToast("Enter reason before proceeding. It will be sent to affected patients.", "warn");
          return;
        }
        openBlockConflictModal({
          uid,
          blockDate: slotBlockDate.value,
          selectedSlots,
          reason,
          conflicts
        });
        return;
      }

      await applySessionBlocks(slotBlockDate.value, selectedSlots, reason, uid);
      slotBlockForm.reset();
      fillSlotSelect(slotBlockLabel, slotBlockDate.value || todayYmdInKolkata());
      slotPickerDraftSelection = new Set();
      updateSlotPickerSummary();
      setStatus(appStatus, `${selectedSlots.length} session(s) blocked successfully.`, "ok");
      showToast(`${selectedSlots.length} session(s) blocked successfully.`, "success");
      await loadBlockedSlots();
      await loadDashboard();
    } catch (error) {
      setStatus(appStatus, `Unable to block session: ${error.message}`, "error");
      showToast("Unable to block session.", "error");
    }
  });

  if (slotSelectAllBtn) {
    slotSelectAllBtn.addEventListener("click", () => {
      slotPickerDraftSelection = new Set(Array.from(slotBlockLabel.options).map((option) => option.value));
      renderSlotPickerDraft();
    });
  }
  if (slotClearBtn) {
    slotClearBtn.addEventListener("click", () => {
      slotPickerDraftSelection = new Set();
      renderSlotPickerDraft();
    });
  }

  manualBookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const uid = await currentUserId();
    if (!uid) {
      setStatus(appStatus, "Session expired. Please login again.", "error");
      return;
    }

    const payload = {
      patient_name: manualName.value.trim(),
      patient_phone: manualPhone.value.trim(),
      preferred_date: manualDate.value,
      preferred_slot: manualSlot.value,
      service: manualService.value,
      notes: manualNotes.value.trim() || null
    };

    if (!payload.patient_name || !payload.patient_phone || !payload.preferred_date || !payload.preferred_slot || !payload.service) {
      setStatus(appStatus, "Fill all required manual booking fields.", "error");
      return;
    }

    try {
      const blockedDate = await getDateBlockedInfo(payload.preferred_date);
      if (blockedDate) {
        setStatus(appStatus, "Cannot book: selected date is blocked.", "warn");
        const reasonText = blockedDate.reason ? ` Reason: ${blockedDate.reason}` : "";
        openNoticeModal(`This date is unavailable.${reasonText}`);
        return;
      }
      const blockedSlot = await getSlotBlockedInfo(payload.preferred_date, payload.preferred_slot);
      if (blockedSlot) {
        setStatus(appStatus, "Cannot book: selected session is blocked.", "warn");
        const reasonText = blockedSlot.reason ? ` Reason: ${blockedSlot.reason}` : "";
        openNoticeModal(`This session is blocked for that slot.${reasonText}`);
        return;
      }
      const slotTaken = await isSlotAlreadyApproved(payload.preferred_date, payload.preferred_slot);
      if (slotTaken) {
        setStatus(appStatus, "Cannot book: selected slot is already approved.", "warn");
        openNoticeModal("This session is booked for that slot.");
        return;
      }
    } catch (checkError) {
      setStatus(appStatus, `Unable to validate slot: ${checkError.message}`, "error");
      return;
    }

    const insertPayload = {
      ...payload,
      status: "Approved",
      status_note: `Booked by ${getActorRoleLabel()}`,
      approved_at: new Date().toISOString(),
      approved_by: uid,
      whatsapp_sent_at: null
    };

    const { data: createdAppointment, error } = await supabase
      .from("appointments")
      .insert(insertPayload)
      .select("id, patient_name, patient_phone, preferred_date, preferred_slot, service, status, notes, status_note, approved_at, approved_by, whatsapp_sent_at")
      .single();
    if (error || !createdAppointment) {
      setStatus(appStatus, `Unable to create booking: ${error?.message || "Insert failed."}`, "error");
      return;
    }

    openWhatsappConfirmModal({ type: "manual-booking", appointment: createdAppointment, status: "Approved" });
    manualBookingForm.reset();
  });
}

init();




