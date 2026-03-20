import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SERVICES, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const analyticsAuthCard = document.getElementById("analyticsAuthCard");
const analyticsAuthStatus = document.getElementById("analyticsAuthStatus");
const analyticsApp = document.getElementById("analyticsApp");
const analyticsStatus = document.getElementById("analyticsStatus");
const analyticsRange = document.getElementById("analyticsRange");
const analyticsRefreshBtn = document.getElementById("analyticsRefreshBtn");
const analyticsOverview = document.getElementById("analyticsOverview");
const bookingsTrendLead = document.getElementById("bookingsTrendLead");
const bookingsTrendChart = document.getElementById("bookingsTrendChart");
const approvalFunnel = document.getElementById("approvalFunnel");
const serviceMix = document.getElementById("serviceMix");
const peakSlots = document.getElementById("peakSlots");
const weekdayDemand = document.getElementById("weekdayDemand");
const visitsVsBookings = document.getElementById("visitsVsBookings");
const blockedCapacity = document.getElementById("blockedCapacity");
const insightNotes = document.getElementById("insightNotes");

const STATUS_ORDER = ["Pending", "Approved", "Rejected", "Completed", "No-show"];
const STATUS_COLORS = {
  Pending: "#f59e0b",
  Approved: "#10b981",
  Rejected: "#ef4444",
  Completed: "#3b82f6",
  "No-show": "#8b5cf6"
};
const SERVICE_ORDER = SERVICES.slice();
const WEEKDAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function setStatus(target, text, type = "") {
  if (!target) {
    return;
  }
  target.className = `status ${type}`;
  target.textContent = text;
}

function todayYmdInKolkata() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata"
  }).format(new Date());
}

function shiftDays(dateYmd, offset) {
  const date = new Date(`${dateYmd}T00:00:00+05:30`);
  date.setUTCDate(date.getUTCDate() + offset);
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata"
  }).format(date);
}

function formatWeekday(dateYmd) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Asia/Kolkata"
  }).format(new Date(`${dateYmd}T00:00:00+05:30`));
}

function getRangeWindow(days) {
  const end = todayYmdInKolkata();
  const start = shiftDays(end, -Number(days) + 1);
  return { start, end };
}

function buildDateSequence(start, end) {
  const values = [];
  let cursor = start;
  while (cursor <= end) {
    values.push(cursor);
    cursor = shiftDays(cursor, 1);
  }
  return values;
}

async function currentUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
}

async function getAdminProfile() {
  const uid = await currentUserId();
  if (!uid) {
    return null;
  }
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("user_id, role")
    .eq("user_id", uid)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data;
}

function renderOverview(cards) {
  analyticsOverview.innerHTML = "";
  cards.forEach((card) => {
    const item = document.createElement("article");
    item.className = "analytics-stat-card";
    item.innerHTML = `
      <span class="analytics-stat-label">${card.label}</span>
      <strong class="analytics-stat-value">${card.value}</strong>
      <p class="analytics-stat-sub">${card.sub}</p>
    `;
    analyticsOverview.appendChild(item);
  });
}

function renderLineChart(svg, values) {
  if (!svg) {
    return;
  }
  const width = 720;
  const height = 280;
  const padX = 28;
  const padY = 24;
  const chartWidth = width - padX * 2;
  const chartHeight = height - padY * 2;
  const maxValue = Math.max(...values.map((point) => point.value), 1);
  const points = values.map((point, index) => {
    const x = padX + (chartWidth * index) / Math.max(values.length - 1, 1);
    const y = height - padY - (point.value / maxValue) * chartHeight;
    return { ...point, x, y };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaLine = [`${padX},${height - padY}`, ...points.map((point) => `${point.x},${point.y}`), `${padX + chartWidth},${height - padY}`].join(" ");

  svg.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="#f8fcfa"></rect>
    <g stroke="#d8e8df" stroke-width="1">
      ${Array.from({ length: 4 }).map((_, index) => {
        const y = padY + (chartHeight * index) / 3;
        return `<line x1="${padX}" y1="${y}" x2="${padX + chartWidth}" y2="${y}" />`;
      }).join("")}
    </g>
    <polygon points="${areaLine}" fill="rgba(15, 143, 104, 0.12)"></polygon>
    <polyline points="${polyline}" fill="none" stroke="var(--brand)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
    ${points.map((point) => `
      <g>
        <circle cx="${point.x}" cy="${point.y}" r="5" fill="var(--brand)"></circle>
        <text x="${point.x}" y="${height - 6}" text-anchor="middle" font-size="11" fill="#486257">${point.label}</text>
      </g>
    `).join("")}
  `;
}

function renderBars(container, rows, options = {}) {
  if (!container) {
    return;
  }
  const maxValue = Math.max(...rows.map((row) => row.value), 1);
  container.innerHTML = "";
  rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = "analytics-bar-item";
    const percent = Math.round((row.value / maxValue) * 100);
    item.innerHTML = `
      <div class="analytics-bar-head">
        <strong>${row.label}</strong>
        <span>${row.value}${options.suffix || ""}</span>
      </div>
      <div class="analytics-bar-track">
        <div class="analytics-bar-fill" style="width:${percent}%; background:${row.color || "#0f8f68"};"></div>
      </div>
      ${row.sub ? `<small>${row.sub}</small>` : ""}
    `;
    container.appendChild(item);
  });
}

function renderFunnel(container, counts) {
  if (!container) {
    return;
  }
  const total = STATUS_ORDER.reduce((sum, status) => sum + (counts[status] || 0), 0) || 1;
  container.innerHTML = "";
  STATUS_ORDER.forEach((status) => {
    const value = counts[status] || 0;
    const percent = Math.round((value / total) * 100);
    const item = document.createElement("div");
    item.className = "funnel-item";
    item.innerHTML = `
      <div class="funnel-head">
        <strong>${status}</strong>
        <span>${value}</span>
      </div>
      <div class="funnel-track">
        <div class="funnel-fill" style="width:${percent}%; background:${STATUS_COLORS[status] || "#0f8f68"};"></div>
      </div>
      <small>${percent}% of tracked appointments</small>
    `;
    container.appendChild(item);
  });
}

function renderComparison(container, rows) {
  if (!container) {
    return;
  }
  const maxValue = Math.max(...rows.flatMap((row) => [row.visits, row.bookings]), 1);
  container.innerHTML = "";
  rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = "comparison-card";
    const visitsPercent = Math.max(8, Math.round((row.visits / maxValue) * 100));
    const bookingsPercent = Math.max(8, Math.round((row.bookings / maxValue) * 100));
    item.innerHTML = `
      <strong>${row.label}</strong>
      <div class="comparison-bars">
        <div>
          <span>Visits</span>
          <div class="comparison-track"><div class="comparison-fill comparison-fill--visits" style="width:${visitsPercent}%"></div></div>
          <small>${row.visits}</small>
        </div>
        <div>
          <span>Bookings</span>
          <div class="comparison-track"><div class="comparison-fill comparison-fill--bookings" style="width:${bookingsPercent}%"></div></div>
          <small>${row.bookings}</small>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

function renderBlockedCapacity(container, stats) {
  if (!container) {
    return;
  }
  container.innerHTML = `
    <div class="analytics-mini-stat">
      <span>Blocked Day Ranges</span>
      <strong>${stats.blockedDateRanges}</strong>
      <small>${stats.blockedTotalDays} total blocked day(s)</small>
    </div>
    <div class="analytics-mini-stat">
      <span>Blocked Sessions</span>
      <strong>${stats.blockedSessions}</strong>
      <small>${stats.uniqueBlockedDates} date(s) affected</small>
    </div>
    <div class="analytics-mini-stat">
      <span>Capacity Impact</span>
      <strong>${stats.capacityImpactLabel}</strong>
      <small>Relative to normal slot inventory</small>
    </div>
  `;
}

function renderInsightNotes(container, notes) {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  notes.forEach((note) => {
    const item = document.createElement("article");
    item.className = "insight-note";
    item.innerHTML = `<strong>${note.title}</strong><p>${note.body}</p>`;
    container.appendChild(item);
  });
}

function groupByDate(appointments, dates) {
  const counts = new Map(dates.map((date) => [date, 0]));
  appointments.forEach((appointment) => {
    if (counts.has(appointment.preferred_date)) {
      counts.set(appointment.preferred_date, counts.get(appointment.preferred_date) + 1);
    }
  });
  return dates.map((date, index, array) => ({
    label: array.length > 60 ? date.slice(5) : date.slice(5),
    fullDate: date,
    value: counts.get(date) || 0
  }));
}

function buildWeeklyComparison(visits, appointments, start, end) {
  const buckets = [];
  let cursor = start;
  while (cursor <= end) {
    const bucketStart = cursor;
    const bucketEnd = shiftDays(cursor, 6);
    const label = `${bucketStart.slice(5)}-${bucketEnd.slice(5)}`;
    buckets.push({ start: bucketStart, end: bucketEnd, label, visits: 0, bookings: 0 });
    cursor = shiftDays(cursor, 7);
  }

  visits.forEach((visit) => {
    const created = visit.created_at?.slice(0, 10);
    const bucket = buckets.find((item) => created >= item.start && created <= item.end);
    if (bucket) {
      bucket.visits += 1;
    }
  });

  appointments.forEach((appointment) => {
    const bucket = buckets.find((item) => appointment.preferred_date >= item.start && appointment.preferred_date <= item.end);
    if (bucket) {
      bucket.bookings += 1;
    }
  });

  return buckets.slice(-6);
}

async function loadAnalytics() {
  const days = Number(analyticsRange?.value || 30);
  const { start, end } = getRangeWindow(days);
  setStatus(analyticsStatus, "Refreshing analytics...", "ok");

  const [appointmentsResult, visitsResult, blockedDatesResult, blockedSlotsResult] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, patient_name, preferred_date, preferred_slot, service, status, created_at")
      .gte("preferred_date", start)
      .lte("preferred_date", end)
      .order("preferred_date", { ascending: true }),
    supabase
      .from("visitor_events")
      .select("id, created_at, event_name")
      .eq("event_name", "page_visit")
      .gte("created_at", `${start}T00:00:00+05:30`)
      .lte("created_at", `${end}T23:59:59+05:30`)
      .order("created_at", { ascending: true }),
    supabase
      .from("blocked_dates")
      .select("id, from_date, to_date, reason")
      .lte("from_date", end)
      .gte("to_date", start),
    supabase
      .from("blocked_slots")
      .select("id, block_date, slot_label, reason")
      .gte("block_date", start)
      .lte("block_date", end)
  ]);

  if (appointmentsResult.error) {
    setStatus(analyticsStatus, appointmentsResult.error.message, "error");
    return;
  }
  if (visitsResult.error) {
    setStatus(analyticsStatus, visitsResult.error.message, "error");
    return;
  }
  if (blockedDatesResult.error) {
    setStatus(analyticsStatus, blockedDatesResult.error.message, "error");
    return;
  }
  if (blockedSlotsResult.error) {
    setStatus(analyticsStatus, blockedSlotsResult.error.message, "error");
    return;
  }

  const appointments = appointmentsResult.data || [];
  const visits = visitsResult.data || [];
  const blockedDates = blockedDatesResult.data || [];
  const blockedSlots = blockedSlotsResult.data || [];

  const statusCounts = Object.fromEntries(STATUS_ORDER.map((status) => [status, 0]));
  appointments.forEach((appointment) => {
    statusCounts[appointment.status] = (statusCounts[appointment.status] || 0) + 1;
  });

  const totalBookings = appointments.length;
  const approvedCount = statusCounts.Approved || 0;
  const rejectedCount = statusCounts.Rejected || 0;
  const noShowCount = statusCounts["No-show"] || 0;
  const approvalRate = totalBookings ? Math.round((approvedCount / totalBookings) * 100) : 0;
  const rejectionRate = totalBookings ? Math.round((rejectedCount / totalBookings) * 100) : 0;
  const conversionRate = visits.length ? Math.round((totalBookings / visits.length) * 100) : 0;

  const dates = buildDateSequence(start, end);
  const trendRows = groupByDate(appointments, dates).map((row, index, array) => ({
    ...row,
    label: array.length > 45 && index % 7 !== 0 ? "" : row.fullDate.slice(5)
  }));

  const serviceCounts = Object.fromEntries(SERVICE_ORDER.map((service) => [service, 0]));
  appointments.forEach((appointment) => {
    if (serviceCounts[appointment.service] !== undefined) {
      serviceCounts[appointment.service] += 1;
    }
  });

  const slotCounts = new Map();
  appointments.forEach((appointment) => {
    slotCounts.set(appointment.preferred_slot, (slotCounts.get(appointment.preferred_slot) || 0) + 1);
  });

  const weekdayCounts = Object.fromEntries(WEEKDAY_ORDER.map((day) => [day, 0]));
  appointments.forEach((appointment) => {
    const day = formatWeekday(appointment.preferred_date);
    weekdayCounts[day] = (weekdayCounts[day] || 0) + 1;
  });

  const blockedTotalDays = blockedDates.reduce((sum, row) => {
    const from = row.from_date < start ? start : row.from_date;
    const to = row.to_date > end ? end : row.to_date;
    const startDate = new Date(`${from}T00:00:00+05:30`);
    const endDate = new Date(`${to}T00:00:00+05:30`);
    const diff = Math.round((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
    return sum + Math.max(diff, 0);
  }, 0);
  const totalSlotsAvailable = dates.length * 16;
  const capacityLoss = blockedSlots.length + blockedTotalDays * 16;
  const capacityImpact = totalSlotsAvailable ? Math.round((capacityLoss / totalSlotsAvailable) * 100) : 0;

  renderOverview([
    { label: "Booking Requests", value: String(totalBookings), sub: `${days}-day operational demand window` },
    { label: "Approval Rate", value: `${approvalRate}%`, sub: `${approvedCount} approved, ${rejectionRate}% rejected` },
    { label: "Visits vs Bookings", value: `${conversionRate}%`, sub: `${visits.length} visits tracked in same period` },
    { label: "No-show Signal", value: String(noShowCount), sub: "Follow-up focus for clinic staff" }
  ]);

  bookingsTrendLead.textContent = `${days}-day booking request pattern by appointment date.`;
  renderLineChart(bookingsTrendChart, trendRows);
  renderFunnel(approvalFunnel, statusCounts);
  renderBars(serviceMix, SERVICE_ORDER.map((service) => ({
    label: service,
    value: serviceCounts[service],
    sub: totalBookings ? `${Math.round((serviceCounts[service] / totalBookings) * 100)}% of requests` : "0% of requests"
  })));
  renderBars(peakSlots, Array.from(slotCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value, sub: `${value} request(s)` })));
  renderBars(weekdayDemand, WEEKDAY_ORDER.map((day) => ({
    label: day,
    value: weekdayCounts[day],
    sub: weekdayCounts[day] ? `${weekdayCounts[day]} scheduled request(s)` : "No demand in selected window"
  })));
  renderComparison(visitsVsBookings, buildWeeklyComparison(visits, appointments, start, end));
  renderBlockedCapacity(blockedCapacity, {
    blockedDateRanges: blockedDates.length,
    blockedTotalDays,
    blockedSessions: blockedSlots.length,
    uniqueBlockedDates: new Set(blockedSlots.map((slot) => slot.block_date)).size,
    capacityImpactLabel: `${capacityImpact}%`
  });

  const bestService = SERVICE_ORDER.sort((a, b) => serviceCounts[b] - serviceCounts[a])[0];
  const bestSlot = Array.from(slotCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  const bestWeekday = WEEKDAY_ORDER.sort((a, b) => weekdayCounts[b] - weekdayCounts[a])[0];

  renderInsightNotes(insightNotes, [
    {
      title: "Demand Pattern",
      body: totalBookings
        ? `${bestService} is currently the highest-requested service. This is a useful signal for staffing and material readiness.`
        : "No booking demand captured in the selected period yet."
    },
    {
      title: "Peak Chair Time",
      body: bestSlot
        ? `${bestSlot[0]} is the busiest session block right now. Consider protecting this time window from avoidable leave blocks.`
        : "Peak-slot analysis will appear once bookings accumulate."
    },
    {
      title: "Weekday Load",
      body: weekdayCounts[bestWeekday]
        ? `${bestWeekday} has the strongest booking demand in this period. This helps with weekly staffing and leave planning.`
        : "Weekday demand needs more booking history to become meaningful."
    },
    {
      title: "Conversion Signal",
      body: visits.length
        ? `${conversionRate}% of tracked visits turned into bookings in this window. Compare this trend over time rather than using one period in isolation.`
        : "Visitor tracking is light in this period, so conversion insight is limited."
    }
  ]);

  setStatus(analyticsStatus, "Analytics updated.", "ok");
}

async function init() {
  const profile = await getAdminProfile();
  if (!profile) {
    setStatus(analyticsAuthStatus, "Please login from the admin portal to view analytics.", "warn");
    analyticsAuthCard.hidden = false;
    analyticsApp.hidden = true;
    return;
  }

  analyticsAuthCard.hidden = true;
  analyticsApp.hidden = false;
  analyticsRange.value = "30";
  analyticsRefreshBtn?.addEventListener("click", loadAnalytics);
  analyticsRange?.addEventListener("change", loadAnalytics);
  await loadAnalytics();
}

init();

