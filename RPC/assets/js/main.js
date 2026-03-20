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
const slotStateWrap = document.getElementById("slotStateWrap");
const adminReturnLink = document.getElementById("adminReturnLink");
const statusEl = document.getElementById("status");
const yearEl = document.getElementById("year");
const showMapBtn = document.getElementById("showMapBtn");
const mapWrap = document.getElementById("mapWrap");
const locateLink = document.getElementById("locateLink");
const aboutLink = document.getElementById("aboutLink");
const toastRoot = document.getElementById("toastRoot");
const bookingSuccessModal = document.getElementById("bookingSuccessModal");
const bookingSuccessOk = document.getElementById("bookingSuccessOk");
const bookSection = document.getElementById("book");
const mobileBookSwitchBtns = document.querySelectorAll("[data-mobile-book-view]");
const mobileSectionLinks = document.querySelectorAll("[data-mobile-section]");
const homeSection = document.getElementById("home");
const servicesSection = document.getElementById("services");

const sessionId = crypto.randomUUID();
let clinicSettings = null;

function redirectRecoveryToAdmin() {
  const url = new URL(window.location.href);
  const hash = window.location.hash || "";
  const search = window.location.search || "";
  const hasRecovery =
    hash.includes("type=recovery") ||
    hash.includes("access_token=") ||
    hash.includes("refresh_token=") ||
    hash.includes("token_hash=") ||
    search.includes("type=recovery") ||
    search.includes("token_hash=") ||
    url.searchParams.get("mode") === "reset";

  if (!hasRecovery) {
    return;
  }

  const target = new URL("./doctors-login.html", window.location.href);
  if (search) {
    target.search = search.startsWith("?") ? search : `?${search}`;
  }
  if (hash) {
    target.hash = hash;
  }
  if (!target.searchParams.get("mode")) {
    target.searchParams.set("mode", "reset");
  }
  window.location.replace(target.toString());
}

redirectRecoveryToAdmin();

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

function openBookingSuccessModal() {
  if (!bookingSuccessModal) {
    return;
  }
  bookingSuccessModal.hidden = false;
  bookingSuccessOk?.focus();
}

function closeBookingSuccessModal() {
  if (!bookingSuccessModal) {
    return;
  }
  bookingSuccessModal.hidden = true;
}

function setBlockedNotice(message = "", options = {}) {
  const { overlay = false } = options;
  blockedNotice.textContent = message;
  blockedNotice.style.display = message ? "block" : "none";
  slotStateWrap?.classList.toggle("overlay-active", overlay && Boolean(message));
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

function todayYmdInKolkata() {
  return normalizeDateToYMD(new Date());
}

function nowMinutesInKolkata() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata"
  }).formatToParts(new Date());
  const hh = Number(parts.find((x) => x.type === "hour")?.value || "0");
  const mm = Number(parts.find((x) => x.type === "minute")?.value || "0");
  return hh * 60 + mm;
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

function weekdayNameFromYmd(dateYmd) {
  const date = new Date(`${dateYmd}T00:00:00+05:30`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Asia/Kolkata"
  }).format(date);
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
    console.error(error);
    clinicSettings = {
      slot_duration_minutes: SLOT_DURATION_MINUTES,
      effective_from_date: todayYmdInKolkata(),
      booking_window_days: 10,
      weekly_off_days: []
    };
    return;
  }
  clinicSettings = {
    slot_duration_minutes: data?.slot_duration_minutes || SLOT_DURATION_MINUTES,
    effective_from_date: data?.effective_from_date || todayYmdInKolkata(),
    booking_window_days: data?.booking_window_days || 10,
    weekly_off_days: Array.isArray(data?.weekly_off_days) ? data.weekly_off_days : []
  };
  if (!data) {
    clinicSettings = {
      slot_duration_minutes: SLOT_DURATION_MINUTES,
      effective_from_date: todayYmdInKolkata(),
      booking_window_days: 10,
      weekly_off_days: []
    };
  }
}

async function updateAdminReturnLink() {
  if (!adminReturnLink) {
    return;
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }

    const userId = data?.session?.user?.id;
    if (!userId) {
      adminReturnLink.hidden = true;
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError || !profile?.role) {
      adminReturnLink.hidden = true;
      return;
    }

    adminReturnLink.hidden = false;
    adminReturnLink.textContent = "Back to Dashboard";
  } catch (error) {
    console.error("Unable to verify dashboard access:", error);
    adminReturnLink.hidden = true;
  }
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

function getBookingWindowDays() {
  const value = Number(clinicSettings?.booking_window_days || 10);
  if (!Number.isFinite(value)) {
    return 10;
  }
  return Math.min(90, Math.max(1, value));
}

function getWeeklyOffDays() {
  const values = clinicSettings?.weekly_off_days;
  return Array.isArray(values) ? values : [];
}

function isWeeklyOffDate(dateYmd) {
  const weeklyOffDays = getWeeklyOffDays();
  if (!weeklyOffDays.length) {
    return false;
  }
  const weekday = weekdayNameFromYmd(dateYmd);
  return weeklyOffDays.includes(weekday);
}

async function renderSlots() {
  const selectedDate = dateInput.value;
  const slotDuration = selectedDate ? getSlotDurationForDate(selectedDate) : SLOT_DURATION_MINUTES;
  const allSlots = buildSlots(slotDuration);
  slotsEl.innerHTML = "";
  selectedSlotInput.value = "";
  selectedSlotText.textContent = "No slot selected";
  setBlockedNotice("");

  if (!selectedDate) {
    return;
  }

  if (isWeeklyOffDate(selectedDate)) {
    allSlots.forEach((slot) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "slot approved";
      button.textContent = slot;
      button.disabled = true;
      slotsEl.appendChild(button);
    });
    setBlockedNotice("Clinic is closed on this day (weekly off).", { overlay: true });
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
    setBlockedNotice(`Clinic is unavailable on this date.${reason}`, { overlay: true });
    return;
  }

  const approved = await getApprovedSlots(selectedDate);
  const blockedSlots = await getBlockedSlots(selectedDate);

  const isToday = selectedDate === todayYmdInKolkata();
  const nowMinutes = nowMinutesInKolkata();
  let hiddenExpiredCount = 0;

  allSlots.forEach((slot) => {
    if (isToday && slotStartMinutes(slot) <= nowMinutes) {
      hiddenExpiredCount += 1;
      return;
    }
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
    setBlockedNotice("Some sessions are blocked by clinic for this date.");
  } else if (slotsEl.children.length === 0) {
    setBlockedNotice("No more slots available for today.");
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
      showToast("Selected date/session is blocked by clinic.", "warn");
      await renderSlots();
      return;
    }
    setStatus("error", "Unable to submit request right now. Please call clinic.");
    showToast("Unable to submit right now. Please call clinic.", "error");
    return;
  }

  await trackEvent("appointment_submitted", payload.service);
  setStatus("", "");
  openBookingSuccessModal();
  const submittedDate = payload.preferred_date;
  form.reset();
  dateInput.value = submittedDate;
  await renderSlots();
}

function initDate() {
  const today = normalizeDateToYMD(new Date());
  dateInput.min = today;
  dateInput.value = today;
}

function applyBookingWindow() {
  if (!dateInput) {
    return;
  }
  const today = todayYmdInKolkata();
  const windowDays = getBookingWindowDays();
  const maxDateObj = new Date(`${today}T00:00:00+05:30`);
  maxDateObj.setDate(maxDateObj.getDate() + windowDays);
  const max = normalizeDateToYMD(maxDateObj);
  dateInput.min = today;
  dateInput.max = max;
  if (!dateInput.value || dateInput.value < today || dateInput.value > max) {
    dateInput.value = today;
  }
}

function setupMobileBookSwitcher() {
  if (!bookSection || mobileBookSwitchBtns.length === 0) {
    return;
  }

  function setView(view) {
    bookSection.dataset.mobileBookView = view;
    mobileBookSwitchBtns.forEach((btn) => {
      const isActive = btn.dataset.mobileBookView === view;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  mobileBookSwitchBtns.forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.mobileBookView || "form"));
  });

  setView("form");
}

function setupMobileSectionNav() {
  if (!homeSection || !servicesSection || !bookSection || mobileSectionLinks.length === 0) {
    return;
  }
  const mobileQuery = window.matchMedia("(max-width: 620px)");
  const sections = {
    home: homeSection,
    services: servicesSection,
    book: bookSection
  };

  function setActiveNav(target) {
    mobileSectionLinks.forEach((link) => {
      if (link.classList.contains("nav-link")) {
        const active = link.dataset.mobileSection === target;
        link.classList.toggle("active", active);
        link.setAttribute("aria-current", active ? "page" : "false");
      }
    });
  }

  function getTargetFromHash() {
    const hash = window.location.hash.replace("#", "");
    return sections[hash] ? hash : "";
  }

  function showSection(target, options = {}) {
    const { updateHash = false } = options;
    Object.entries(sections).forEach(([key, section]) => {
      section.hidden = mobileQuery.matches ? key !== target : false;
    });
    setActiveNav(target);
    if (mobileQuery.matches && updateHash) {
      window.history.replaceState({}, "", `#${target}`);
    }
    if (mobileQuery.matches) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  mobileSectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!mobileQuery.matches) {
        return;
      }
      const target = link.dataset.mobileSection;
      if (!target || !sections[target]) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      showSection(target, { updateHash: true });
    });
  });

  mobileQuery.addEventListener("change", () => {
    if (!mobileQuery.matches) {
      Object.values(sections).forEach((section) => {
        section.hidden = false;
      });
      return;
    }
    showSection(getTargetFromHash() || "home");
  });

  window.addEventListener("hashchange", () => {
    if (!mobileQuery.matches) {
      return;
    }
    showSection(getTargetFromHash() || "home");
  });

  if (mobileQuery.matches) {
    showSection(getTargetFromHash() || "home");
  }
}

async function wire() {
  await updateAdminReturnLink();
  supabase.auth.onAuthStateChange(() => {
    updateAdminReturnLink();
  });
  loadServices();
  initDate();
  await loadClinicSettings();
  applyBookingWindow();
  await renderSlots();
  trackEvent("page_visit", "home");

  dateInput.addEventListener("change", renderSlots);
  form.addEventListener("submit", handleSubmit);
  bookingSuccessOk?.addEventListener("click", closeBookingSuccessModal);
  bookingSuccessModal?.addEventListener("click", (event) => {
    if (event.target === bookingSuccessModal) {
      closeBookingSuccessModal();
    }
  });

  const clinicNameNode = document.getElementById("clinicName");
  const clinicPhoneNode = document.getElementById("clinicPhone");
  if (clinicNameNode) {
    clinicNameNode.textContent = CLINIC_NAME;
  }
  if (clinicPhoneNode) {
    clinicPhoneNode.textContent = CLINIC_PHONE.replace("+91", "");
  }
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
    locateLink.addEventListener("click", (event) => {
      const mobileQuery = window.matchMedia("(max-width: 620px)");
      if (mobileQuery.matches) {
        event.preventDefault();
        bookSection.dataset.mobileBookView = "info";
        mobileBookSwitchBtns.forEach((btn) => {
          const isActive = btn.dataset.mobileBookView === "info";
          btn.classList.toggle("active", isActive);
        });
        mobileSectionLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.mobileSection === "book");
        });
        if (bookSection.hidden) {
          homeSection.hidden = true;
          servicesSection.hidden = true;
          bookSection.hidden = false;
        }
      }
      mapWrap.removeAttribute("hidden");
      showMapBtn.textContent = "Hide Map";
      document.getElementById("locate-us")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (aboutLink) {
    aboutLink.addEventListener("click", (event) => {
      const mobileQuery = window.matchMedia("(max-width: 620px)");
      if (!mobileQuery.matches) {
        return;
      }
      event.preventDefault();
      bookSection.dataset.mobileBookView = "info";
      mobileBookSwitchBtns.forEach((btn) => {
        const isActive = btn.dataset.mobileBookView === "info";
        btn.classList.toggle("active", isActive);
      });
      mobileSectionLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.mobileSection === "book");
      });
      if (bookSection.hidden) {
        homeSection.hidden = true;
        servicesSection.hidden = true;
        bookSection.hidden = false;
      }
      document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  setupMobileBookSwitcher();
  setupMobileSectionNav();
}

wire();
