# Sarvam Dental Clinic - Project Handoff

## Project Snapshot
- Project type: public dental booking site + private admin dashboard.
- Clinic: Sarvam Dental Clinic.
- Timezone: Asia/Kolkata.
- Working hours: 10:30 AM to 6:30 PM.
- Slot duration: configurable (30 min or 60 min) from admin settings.
- Status lifecycle: Pending, Approved, Rejected, Completed, No-show.
- Deployment: Netlify.
- Backend/Auth/DB: Supabase.

Production:
- https://sarvamdentalclinic.netlify.app/

Repository:
- https://github.com/rameshdhv/svc

## Tech Stack
- Static frontend: HTML/CSS/Vanilla JS.
- Supabase: Postgres + Auth + RLS + Realtime.
- Netlify Functions: secure maintenance actions (reset past data).
- Optional integration path: Twilio WhatsApp API (currently disabled; using WhatsApp redirect links).

## Pages
- `index.html`: landing page, services, booking form, about/locate sections.
- `gallery.html`: before/after treatment gallery.
- `doctors-login.html`: dentist/staff login + dashboard.
- `admin.html`: redirect helper to doctors login route.

## Core Frontend Logic
- `assets/js/main.js`
  - booking form + slot selection.
  - hides expired same-day slots.
  - limits booking window by configurable next N days.
  - reads weekly-off and block rules from settings/tables.
  - mobile section switching and mobile booking tab behavior.
- `assets/js/admin.js`
  - login/reset password flow.
  - dashboard analytics + timeline + filters.
  - appointment status actions.
  - date and session blocking controls.
  - emergency bulk session picker (modal with multi-select chips).
  - settings save logic (duration, visibility, weekly off).
  - weekly-off conflict protection against active appointments.
  - realtime booking notification (bottom-left + sound) when dashboard open.
  - secure reset past data via Netlify function.

## Database (Supabase)
Primary schema file:
- `supabase/schema.sql`

Main tables:
- `appointments`
- `appointment_status_history`
- `admin_profiles`
- `visitor_events`
- `blocked_dates`
- `blocked_slots`
- `clinic_settings`

Auth model:
- Dentist/staff sign in via Supabase email+password.
- Access gate uses `admin_profiles` + RLS.

## Functional Rules Implemented
- Customer slot colors:
  - available: green
  - unavailable/consumed: grey
- Approved slots become unavailable.
- Past slots for today are hidden on customer side.
- Customer sees slots for next N days (configurable in settings).
- Weekly off days close booking.
- Weekly off save is blocked if conflicting Pending/Approved appointments exist.
- Holiday range blocking and emergency session blocking supported.
- Approved future appointments can be Unblocked with mandatory reason.
- Staff can book for patient from admin.
- Manual booking, approve/reject, and conflict-driven cancellation can use guarded WhatsApp confirmation before finalizing state changes.

## Dashboard UX Notes
- Top controls: Refresh, Settings, Logout.
- Day Snapshot is compact and collapsible.
- Appointments section is also collapsible and default-open.
- Emergency session blocking uses a dedicated picker modal for reliable desktop/tablet/mobile behavior.
- Toast feedback for major actions.
- Live booking alerts appear at bottom-left with notification tone.
- Admin conflict/warning flows use centered in-app modals where implemented.

## Mobile-Specific Decisions
- Mobile has section-based navigation behavior for Home/Services/Book.
- Services shown as list in mobile section view.
- Booking slots on mobile use compact grid.
- Footer About/Locate navigation fixed for mobile flow.
- Desktop/tablet layouts intentionally preserved unless explicitly requested.

## Environment Variables
Required for runtime:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Required for Netlify function (server-side only):
- `SUPABASE_SERVICE_ROLE_KEY` (or Supabase Secret key equivalent)

Optional (if Twilio API enabled later):
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`

## Local Development
```bash
npm install
npx netlify dev --port 8888 --staticServerPort 4001
```

Local URLs:
- `http://localhost:8888/index.html`
- `http://localhost:8888/gallery.html`
- `http://localhost:8888/doctors-login.html`

## Deployment
- Netlify connected to GitHub `main`.
- Publish directory: repository root (`.`).
- `netlify.toml` is configured.

## Today's Improvements
- Customer booking success now preserves the selected date after submission.
- Customer booking success uses a centered modal with `OK` instead of inline success text.
- Customer weekly off / blocked day state uses centered yellow overlay over blurred disabled slots.
- Admin `Day Timeline View` was renamed to `Day Snapshot`.
- Admin Day Snapshot now shows yellow overlay state for weekly off / blocked day.
- Admin default appointment filter range is now `today -> today + booking visibility days`.
- Approve/Reject modal includes compact `Notify via WhatsApp` checkbox enabled by default.
- `WASafeConfirm` flow added so WhatsApp-related actions finalize only after `Message Sent`.
- Manual booking now also uses `WASafeConfirm`.
- Session blocking with approved appointment conflict now warns first and supports proceed-anyway path with patient notification.
- Unblock now uses fixed reason options instead of free text.
- `Customer requested cancellation` unblock path requires WhatsApp confirmation before finalizing.
- Manual booking conflict warnings use centered popup modal instead of browser alerts.
- Manual booking conflict text now reflects the actual cause and shows block reason where available.

## Shared Vocabulary
- `WASafeConfirm`
  - guarded WhatsApp workflow where the system changes state only after user confirms `Message Sent`
- `SlotGuard`
  - slot conflict protection before booking or slot-changing actions
- `BlockConflict`
  - emergency block conflict flow for already approved appointments
- `DayOverlay`
  - centered yellow overlay over blurred slot/snapshot grids for full-day unavailable state
- `UnblockReasonFlow`
  - fixed unblock-reason flow with conditional WhatsApp handling
- `LiveDeskAlert`
  - realtime dashboard alert with sound for new bookings
- `BookingWindowControl`
  - booking visibility + weekly off + slot duration settings logic

## Continuity / Recovery
If moving to new IDE or after context loss:
1. Clone repo.
2. Re-add Netlify/Supabase env vars.
3. Run local with `netlify dev`.
4. Verify booking + admin flows.
5. Use `DENTIST_APP_REBUILD_BLUEPRINT.txt` as complete build spec.
