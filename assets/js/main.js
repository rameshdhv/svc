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

const form = document.getElementById("appointmentForm");
const dateInput = document.getElementById("date");
const serviceSelect = document.getElementById("service");
const slotsEl = document.getElementById("slots");
const selectedSlotInput = document.getElementById("selectedSlot");
const selectedSlotText = document.getElementById("selectedSlotText");
const blockedNotice = document.getElementById("blockedNotice");
const statusEl = document.getElementById("status");
const yearEl = document.getElementById("year");
const showMapBtn = document.getElementById("showMapBtn");
const mapWrap = document.getElementById("mapWrap");
const locateLink = document.getElementById("locateLink");

const sessionId = crypto.randomUUID();
let clinicSettings = null;

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
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

function setStatus(type, message) {
  statusEl.className = `status ${type}`;
  statusEl.textContent = message;
}

function normalizeDateToYMD(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata"
  }).formatToParts(date);
  const y = parts.find((x) => x.type === "year")?.value;
  const m = parts.find((x) => x.type === "month")?.value;
  const d = parts.find((x) => x.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

async function trackEvent(name, value) {
  await supabase.from("visitor_events").insert({
    event_name: name,
    event_value: value,
    session_id: sessionId,
    page_path: window.location.pathname
  });
}

async function getApprovedSlots(dateYmd) {
  const { data, error } = await supabase.rpc("get_approved_slots", { p_date: dateYmd });
  if (error) {
    console.error(error);
    return new Set();
  }
  return new Set((data || []).map((row) => row.preferred_slot));
}

async function getBlockedDateInfo(dateYmd) {
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("id, reason")
    .lte("from_date", dateYmd)
    .gte("to_date", dateYmd)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }
  return data || null;
}

async function getBlockedSlots(dateYmd) {
  const { data, error } = await supabase
    .from("blocked_slots")
    .select("slot_label")
    .eq("block_date", dateYmd);

  if (error) {
    console.error(error);
    return new Set();
  }
  return new Set((data || []).map((row) => row.slot_label));
}

async function loadClinicSettings() {
  const { data, error } = await supabase
    .from("clinic_settings")
    .select("slot_duration_minutes, effective_from_date")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error(error);
    clinicSettings = null;
    return;
  }
  clinicSettings = data || null;
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

async function renderSlots() {
  const selectedDate = dateInput.value;
  const slotDuration = selectedDate ? getSlotDurationForDate(selectedDate) : SLOT_DURATION_MINUTES;
  const allSlots = buildSlots(slotDuration);
  slotsEl.innerHTML = "";
  selectedSlotInput.value = "";
  selectedSlotText.textContent = "No slot selected";
  blockedNotice.style.display = "none";
  blockedNotice.textContent = "";

  if (!selectedDate) {
    return;
  }

  const blockedInfo = await getBlockedDateInfo(selectedDate);
  if (blockedInfo) {
    allSlots.forEach((slot) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "slot approved";
      button.textContent = slot;
      button.disabled = true;
      slotsEl.appendChild(button);
    });
    const reason = blockedInfo.reason ? ` Reason: ${blockedInfo.reason}` : "";
    blockedNotice.textContent = `Clinic is unavailable on this date.${reason}`;
    blockedNotice.style.display = "block";
    return;
  }

  const approved = await getApprovedSlots(selectedDate);
  const blockedSlots = await getBlockedSlots(selectedDate);

  allSlots.forEach((slot) => {
    const isApproved = approved.has(slot) || blockedSlots.has(slot);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `slot ${isApproved ? "approved" : "available"}`;
    button.textContent = slot;
    button.disabled = isApproved;

    if (!isApproved) {
      button.addEventListener("click", () => {
        slotsEl.querySelectorAll(".slot").forEach((s) => s.classList.remove("selected"));
        button.classList.add("selected");
        selectedSlotInput.value = slot;
        selectedSlotText.textContent = `Selected: ${slot}`;
      });
    }

    slotsEl.appendChild(button);
  });

  if (blockedSlots.size > 0) {
    blockedNotice.textContent = "Some sessions are blocked by clinic for this date.";
    blockedNotice.style.display = "block";
  }
}

function loadServices() {
  SERVICES.forEach((service) => {
    const option = document.createElement("option");
    option.value = service;
    option.textContent = service;
    serviceSelect.appendChild(option);
  });
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    setStatus("error", "Please fill all required fields.");
    return;
  }

  if (!selectedSlotInput.value) {
    setStatus("warn", "Select an available slot before submitting.");
    return;
  }

  const data = new FormData(form);

  const payload = {
    patient_name: data.get("name")?.toString().trim(),
    patient_phone: data.get("phone")?.toString().trim(),
    preferred_date: data.get("date")?.toString(),
    preferred_slot: data.get("selectedSlot")?.toString(),
    service: data.get("service")?.toString(),
    notes: data.get("notes")?.toString().trim() || null,
    status: "Pending"
  };

  const { error } = await supabase.from("appointments").insert(payload);
  if (error) {
    console.error(error);
    if (error.message.includes("row-level-security") || error.message.includes("blocked_dates") || error.message.includes("blocked_slots")) {
      setStatus("warn", "Selected date/session is blocked by clinic. Please choose another slot.");
      await renderSlots();
      return;
    }
    setStatus("error", "Unable to submit request right now. Please call clinic.");
    return;
  }

  await trackEvent("appointment_submitted", payload.service);
  setStatus("ok", "Appointment request submitted. Clinic will review and confirm on WhatsApp.");
  form.reset();
  dateInput.value = normalizeDateToYMD(new Date());
  await renderSlots();
}

function initDate() {
  const today = normalizeDateToYMD(new Date());
  dateInput.min = today;
  dateInput.value = today;
}

async function wire() {
  loadServices();
  initDate();
  await loadClinicSettings();
  await renderSlots();
  trackEvent("page_visit", "home");

  dateInput.addEventListener("change", renderSlots);
  form.addEventListener("submit", handleSubmit);

  document.getElementById("clinicName").textContent = CLINIC_NAME;
  document.getElementById("clinicPhone").textContent = CLINIC_PHONE.replace("+91", "");
  document.querySelectorAll(".dial").forEach((a) => {
    a.href = `tel:${CLINIC_PHONE}`;
  });

  if (showMapBtn && mapWrap) {
    showMapBtn.addEventListener("click", () => {
      const hidden = mapWrap.hasAttribute("hidden");
      if (hidden) {
        mapWrap.removeAttribute("hidden");
        showMapBtn.textContent = "Hide Map";
      } else {
        mapWrap.setAttribute("hidden", "");
        showMapBtn.textContent = "Show Map";
      }
    });
  }

  if (locateLink && mapWrap && showMapBtn) {
    locateLink.addEventListener("click", () => {
      mapWrap.removeAttribute("hidden");
      showMapBtn.textContent = "Hide Map";
    });
  }
}

wire();
