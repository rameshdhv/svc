import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  SERVICES,
  SLOT_DURATION_MINUTES,
  SLOT_END_MINUTES,
  SLOT_START_MINUTES,
  SUPABASE_ANON_KEY,
  SUPABASE_URL
} from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const forgotForm = document.getElementById("forgotForm");
const forgotEmail = document.getElementById("forgotEmail");
const forgotSubmitBtn = document.getElementById("forgotSubmitBtn");
const forgotCooldownText = document.getElementById("forgotCooldownText");
const resetForm = document.getElementById("resetForm");
const newPassword = document.getElementById("newPassword");
const confirmNewPassword = document.getElementById("confirmNewPassword");
const loginStatus = document.getElementById("loginStatus");
const appStatus = document.getElementById("appStatus");
const dashboard = document.getElementById("dashboard");
const refreshDashboardBtn = document.getElementById("refreshDashboardBtn");
const tableBody = document.getElementById("appointmentsBody");
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
const blockedSlotsBody = document.getElementById("blockedSlotsBody");
const manualBookingForm = document.getElementById("manualBookingForm");
const manualName = document.getElementById("manualName");
const manualPhone = document.getElementById("manualPhone");
const manualDate = document.getElementById("manualDate");
const manualSlot = document.getElementById("manualSlot");
const manualService = document.getElementById("manualService");
const manualNotes = document.getElementById("manualNotes");

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
const confirmReasonWrap = document.getElementById("confirmReasonWrap");
const confirmReason = document.getElementById("confirmReason");
const confirmCancel = document.getElementById("confirmCancel");
const confirmOk = document.getElementById("confirmOk");
const openSettingsBtn = document.getElementById("openSettingsBtn");
const settingsModal = document.getElementById("settingsModal");
const settingsForm = document.getElementById("settingsForm");
const slotDurationSelect = document.getElementById("slotDurationSelect");
const slotEffectiveDate = document.getElementById("slotEffectiveDate");
const settingsCancelBtn = document.getElementById("settingsCancelBtn");

let pendingStatusAction = null;
let forgotCooldownTimer = null;
let clinicSettings = null;
const FORGOT_COOLDOWN_SECONDS = 90;
const FORGOT_COOLDOWN_KEY = "sarvam_forgot_cooldown_until";

function setStatus(el, text, type = "") {
  el.className = `status ${type}`;
  el.textContent = text;
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

async function isAdmin() {
  const uid = await currentUserId();
  if (!uid) {
    return false;
  }

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("user_id, role")
    .eq("user_id", uid)
    .maybeSingle();

  return !error && !!data;
}

async function loadClinicSettings() {
  const { data, error } = await supabase
    .from("clinic_settings")
    .select("slot_duration_minutes, effective_from_date")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    setStatus(appStatus, `Unable to load settings: ${error.message}`, "error");
    clinicSettings = null;
    return;
  }
  clinicSettings = data || { slot_duration_minutes: 30, effective_from_date: todayYmdInKolkata() };
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
  const firstOption = selectElement.querySelector("option[value='']");
  selectElement.innerHTML = "";
  if (firstOption) {
    selectElement.appendChild(firstOption);
  } else {
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Select session slot";
    selectElement.appendChild(empty);
  }
  const duration = dateYmd ? getSlotDurationForDate(dateYmd) : SLOT_DURATION_MINUTES;
  buildSlots(duration).forEach((slot) => {
    const option = document.createElement("option");
    option.value = slot;
    option.textContent = slot;
    selectElement.appendChild(option);
  });
}

async function handleLogin(event) {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    setStatus(loginStatus, error.message, "error");
    return;
  }

  setStatus(loginStatus, "Login successful.", "ok");

  const admin = await isAdmin();
  if (!admin) {
    setStatus(loginStatus, "No admin access. Add this user in admin_profiles table.", "error");
    await supabase.auth.signOut();
    return;
  }

  document.getElementById("authCard").hidden = true;
  dashboard.hidden = false;
  setStatus(appStatus, "Logged in. Loading appointments...", "ok");
  await loadDashboard();
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

  const redirectTo = `${window.location.origin}/doctors-login.html`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) {
    setStatus(loginStatus, error.message, "error");
    return;
  }

  const newCooldownUntil = Date.now() + FORGOT_COOLDOWN_SECONDS * 1000;
  localStorage.setItem(FORGOT_COOLDOWN_KEY, String(newCooldownUntil));
  startForgotCooldown(newCooldownUntil);
  setStatus(loginStatus, "Password reset link sent to your email.", "ok");
  forgotForm.hidden = true;
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

  setStatus(loginStatus, "Password updated. Please login with new password.", "ok");
  resetForm.hidden = true;
}

function isRecoveryLink() {
  const hash = window.location.hash || "";
  const query = window.location.search || "";
  return hash.includes("type=recovery") || query.includes("type=recovery");
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

  const cleanUrl = `${url.origin}${url.pathname}`;
  window.history.replaceState({}, "", cleanUrl);
  resetForm.hidden = false;
  forgotForm.hidden = true;
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
        return;
      }
      setStatus(appStatus, "Blocked dates removed.", "ok");
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
        return;
      }
      setStatus(appStatus, "Blocked session removed.", "ok");
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
  confirmReasonWrap.hidden = !isUnblock;
  confirmReason.value = "";
  confirmOk.textContent = isUnblock ? "Unblock" : "Confirm";
  confirmModal.hidden = false;
}

function closeConfirmModal() {
  pendingStatusAction = null;
  confirmReason.value = "";
  confirmReasonWrap.hidden = true;
  confirmOk.textContent = "Confirm";
  confirmModal.hidden = true;
}

function openSettingsModal() {
  if (!clinicSettings) {
    slotDurationSelect.value = "30";
    slotEffectiveDate.value = todayYmdInKolkata();
  } else {
    slotDurationSelect.value = String(clinicSettings.slot_duration_minutes);
    slotEffectiveDate.value = clinicSettings.effective_from_date;
  }
  settingsModal.hidden = false;
}

function closeSettingsModal() {
  settingsModal.hidden = true;
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

async function saveClinicSettings(event) {
  event.preventDefault();
  const uid = await currentUserId();
  if (!uid) {
    setStatus(appStatus, "Session expired. Please login again.", "error");
    return;
  }

  const slotDuration = Number(slotDurationSelect.value);
  const effectiveDate = slotEffectiveDate.value;
  if (!effectiveDate || ![30, 60].includes(slotDuration)) {
    setStatus(appStatus, "Select valid slot duration and effective date.", "error");
    return;
  }

  try {
    const hasActive = await hasActiveAppointments(effectiveDate);
    if (hasActive) {
      setStatus(appStatus, "Change blocked: active appointments exist on selected date. Choose another date to avoid clashes.", "warn");
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
      effective_from_date: effectiveDate,
      updated_by: uid,
      updated_at: new Date().toISOString()
    });

  if (error) {
    setStatus(appStatus, `Unable to save settings: ${error.message}`, "error");
    return;
  }

  await loadClinicSettings();
  fillSlotSelect(slotBlockLabel, slotBlockDate.value || todayYmdInKolkata());
  fillSlotSelect(manualSlot, manualDate.value || todayYmdInKolkata());
  setStatus(appStatus, `Slot duration updated to ${slotDuration} minutes from ${effectiveDate}.`, "ok");
  closeSettingsModal();
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

function openWhatsappForStatus(appointment, status) {
  const phone = normalizeWhatsappPhone(appointment.patient_phone);
  if (!phone) {
    setStatus(appStatus, "Status updated, but patient phone is invalid for WhatsApp.", "warn");
    return;
  }

  const isApproved = status === "Approved";
  const message = isApproved
    ? [
      `Hi ${appointment.patient_name},`,
      "Your appointment is confirmed.",
      `Date: ${appointment.preferred_date}`,
      `Slot: ${appointment.preferred_slot}`,
      `Service: ${appointment.service}`,
      "Please arrive 10 minutes early.",
      "Sarvam Dental Clinic"
    ].join("\n")
    : [
      `Hi ${appointment.patient_name},`,
      "Your appointment request could not be confirmed for the selected slot.",
      `Date Requested: ${appointment.preferred_date}`,
      `Slot Requested: ${appointment.preferred_slot}`,
      "Please reply on WhatsApp or call 8328010083 to book another slot.",
      "Sarvam Dental Clinic"
    ].join("\n");

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener");
}

async function updateStatus(appointment, status, reasonOverride = "") {
  const uid = await currentUserId();
  const isUnblock = status === "Unblock";
  const finalStatus = isUnblock ? "Rejected" : status;
  const unblockReason = isUnblock ? reasonOverride : "";
  const shouldNotifyWhatsapp = !isUnblock && (finalStatus === "Approved" || finalStatus === "Rejected");
  const whatsappSentAt = shouldNotifyWhatsapp ? new Date().toISOString() : null;

  const patch = {
    status: finalStatus,
    status_note: isUnblock ? `Unblocked by staff: ${unblockReason}` : appointment.status_note,
    approved_at: finalStatus === "Approved" ? new Date().toISOString() : null,
    approved_by: finalStatus === "Approved" ? uid : null,
    whatsapp_sent_at: whatsappSentAt
  };

  const { error } = await supabase.from("appointments").update(patch).eq("id", appointment.id);
  if (error) {
    setStatus(appStatus, `Status update failed: ${error.message}`, "error");
    return;
  }

  if (shouldNotifyWhatsapp && !isUnblock) {
    openWhatsappForStatus(appointment, finalStatus);
  }

  setStatus(appStatus, isUnblock ? "Appointment unblocked with reason." : `Appointment marked as ${finalStatus}.`, "ok");
  await loadDashboard();
}

async function isDateBlocked(dateYmd) {
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("id")
    .lte("from_date", dateYmd)
    .gte("to_date", dateYmd)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return !!data;
}

async function isSlotBlocked(dateYmd, slotLabel) {
  const { data, error } = await supabase
    .from("blocked_slots")
    .select("id")
    .eq("block_date", dateYmd)
    .eq("slot_label", slotLabel)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return !!data;
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
    ? `${appointment.notes || "-"} | Admin: ${appointment.status_note}`
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
  toggleTimelineBtn.textContent = collapsed ? "Expand" : "Collapse";
}

async function loadTimeline() {
  if (!timelineDate || !timelineBody || !timelineSummary) {
    return;
  }

  const selectedDate = timelineDate.value || todayYmdInKolkata();
  const duration = getSlotDurationForDate(selectedDate);
  const daySlots = buildSlots(duration);
  timelineBody.innerHTML = "";
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

    if (blockedDate) {
      const blocked = document.createElement("div");
      blocked.className = "timeline-item rejected";
      blocked.innerHTML = `<div class="timeline-title">Day blocked</div><div class="timeline-sub">${blockedDate.reason || "Clinic holiday / leave"}</div>`;
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
          title.textContent = `${appointment.patient_name} • ${appointment.service}`;
          const sub = document.createElement("div");
          sub.className = "timeline-sub";
          sub.textContent = `${appointment.patient_phone} • ${appointment.status}`;
          item.append(title, sub);

          if (appointment.notes || appointment.status_note) {
            const note = document.createElement("div");
            note.className = "timeline-sub";
            note.textContent = appointment.status_note ? `${appointment.notes || "-"} | Admin: ${appointment.status_note}` : (appointment.notes || "-");
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
  const now = new Date();
  const end = now.toISOString().slice(0, 10);
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - 30);
  const start = startDate.toISOString().slice(0, 10);
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

  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session) {
    const admin = await isAdmin();
    if (admin) {
      document.getElementById("authCard").hidden = true;
      dashboard.hidden = false;
      await loadDashboard();
    }
  }

  loginForm.addEventListener("submit", handleLogin);
  openSettingsBtn.addEventListener("click", openSettingsModal);
  settingsCancelBtn.addEventListener("click", closeSettingsModal);
  settingsForm.addEventListener("submit", saveClinicSettings);
  settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      closeSettingsModal();
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
  setTimelineCollapsed(false);

  slotBlockDate.addEventListener("change", () => {
    fillSlotSelect(slotBlockLabel, slotBlockDate.value || todayYmdInKolkata());
  });
  manualDate.addEventListener("change", () => {
    fillSlotSelect(manualSlot, manualDate.value || todayYmdInKolkata());
  });

  forgotPasswordBtn.addEventListener("click", () => {
    forgotForm.hidden = !forgotForm.hidden;
    resetForm.hidden = true;
  });
  forgotForm.addEventListener("submit", handleForgotPassword);
  const savedCooldown = Number(localStorage.getItem(FORGOT_COOLDOWN_KEY) || 0);
  if (savedCooldown > Date.now()) {
    startForgotCooldown(savedCooldown);
  }
  resetForm.addEventListener("submit", handleResetPassword);
  supabase.auth.onAuthStateChange((eventName) => {
    if (eventName === "PASSWORD_RECOVERY") {
      resetForm.hidden = false;
      forgotForm.hidden = true;
      setStatus(loginStatus, "Recovery verified. Set your new password below.", "ok");
    }
  });
  const handledTokenRecovery = await handleRecoveryTokenFromUrl();
  if (!handledTokenRecovery && isRecoveryLink()) {
    resetForm.hidden = false;
    forgotForm.hidden = true;
    setStatus(loginStatus, "Set your new password below.", "ok");
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
    const unblockReason = confirmReason.value.trim();
    if (status === "Unblock" && !unblockReason) {
      setStatus(appStatus, "Please enter reason before unblocking.", "warn");
      return;
    }
    closeConfirmModal();
    await updateStatus(appointment, status, unblockReason);
  });

  confirmModal.addEventListener("click", (event) => {
    if (event.target === confirmModal) {
      closeConfirmModal();
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
      setStatus(appStatus, "Refreshing data from Supabase...", "ok");
      await loadDashboard();
    });
  }

  document.getElementById("logout").addEventListener("click", async () => {
    await supabase.auth.signOut();
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
      return;
    }

    blockForm.reset();
    setStatus(appStatus, "Dates blocked successfully.", "ok");
    await loadBlockedDates();
  });

  slotBlockForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const uid = await currentUserId();
    if (!uid) {
      setStatus(appStatus, "Session expired. Please login again.", "error");
      return;
    }

    if (!slotBlockDate.value || !slotBlockLabel.value) {
      setStatus(appStatus, "Select block date and session slot.", "error");
      return;
    }

    const payload = {
      block_date: slotBlockDate.value,
      slot_label: slotBlockLabel.value,
      reason: slotBlockReason.value.trim() || null,
      created_by: uid
    };

    const { error } = await supabase.from("blocked_slots").insert(payload);
    if (error) {
      if (error.message.includes("duplicate key value")) {
        setStatus(appStatus, "Session already blocked for selected date.", "warn");
        return;
      }
      setStatus(appStatus, `Unable to block session: ${error.message}`, "error");
      return;
    }

    slotBlockForm.reset();
    setStatus(appStatus, "Session blocked successfully.", "ok");
    await loadBlockedSlots();
  });

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
      const blockedDate = await isDateBlocked(payload.preferred_date);
      if (blockedDate) {
        setStatus(appStatus, "Cannot book: selected date is blocked.", "warn");
        return;
      }
      const blockedSlot = await isSlotBlocked(payload.preferred_date, payload.preferred_slot);
      if (blockedSlot) {
        setStatus(appStatus, "Cannot book: selected session is blocked.", "warn");
        return;
      }
      const slotTaken = await isSlotAlreadyApproved(payload.preferred_date, payload.preferred_slot);
      if (slotTaken) {
        setStatus(appStatus, "Cannot book: selected slot is already approved.", "warn");
        return;
      }
    } catch (checkError) {
      setStatus(appStatus, `Unable to validate slot: ${checkError.message}`, "error");
      return;
    }

    const insertPayload = {
      ...payload,
      status: "Approved",
      approved_at: new Date().toISOString(),
      approved_by: uid,
      whatsapp_sent_at: new Date().toISOString()
    };

    const { error } = await supabase.from("appointments").insert(insertPayload);
    if (error) {
      setStatus(appStatus, `Unable to create booking: ${error.message}`, "error");
      return;
    }

    setStatus(appStatus, "Manual booking created and approved.", "ok");
    openWhatsappForStatus(insertPayload, "Approved");
    manualBookingForm.reset();
    await loadDashboard();
  });
}

init();
