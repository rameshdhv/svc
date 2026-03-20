# Sarvam Dental Clinic - Project Handoff

## Project Identity
- Public website plus private dentist/staff admin dashboard.
- Clinic name: Sarvam Dental Clinic.
- Timezone: Asia/Kolkata.
- Working hours: 10:30 AM to 6:30 PM.
- Booking slot durations supported: 30 minutes and 60 minutes.
- Current services: Teeth Cleaning, Root Canal, Braces.
- Production site: https://sarvamdentalclinic.netlify.app/
- Repository: https://github.com/rameshdhv/svc

## Stack
- Frontend: static HTML, CSS, vanilla JavaScript.
- Backend platform: Supabase.
- Hosting: Netlify.
- Secure server-side actions: Netlify Functions.
- Auth: Supabase email/password plus TOTP MFA.
- WhatsApp: redirect-based drafts for now, no direct API required.

## Main Routes
- `index.html` - public landing page, booking UI, About, Locate Us.
- `gallery.html` - before/after gallery.
- `doctors-login.html` - dentist/staff login, password recovery, MFA, dashboard.
- `analytics.html` - admin-only analytics insights page.
- `admin.html` - redirect helper to doctors-login route.

## Core Frontend Logic
- `assets/js/main.js`
  - booking form and slot rendering
  - clinic settings loading
  - weekly off / blocked date / blocked slot handling
  - same-day expired slot hiding
  - booking window enforcement
  - customer booking success modal
  - mobile section navigation
  - recovery redirect from public pages to admin reset flow
  - staff/dentist-only `Back to Dashboard` public-page shortcut when an admin session exists
- `assets/js/admin.js`
  - dentist/staff role-switch login UI
  - email + password + TOTP flow
  - TOTP enrollment and verification
  - forgot-password, resend confirmation, reset-password states
  - dashboard refresh, control panel, logout
  - analytics cards and dashboard data loads
  - Day Snapshot view and appointment actions
  - holiday and emergency blocking workflows
  - Book for Patient workflow
  - Manage Users and Current Access Users
  - role-aware status notes
  - LiveDeskAlert realtime/polling booking alert
- `assets/js/analytics.js`
  - admin-only insights page
  - operational charts and infographic summaries using current Supabase data

## Database / Supabase
Primary schema file:
- `supabase/schema.sql`

Main tables currently used:
- `appointments`
- `appointment_status_history`
- `admin_profiles`
- `visitor_events`
- `blocked_dates`
- `blocked_slots`
- `clinic_settings`

Current important user-linked columns:
- `admin_profiles.user_id`
- `appointments.approved_by`
- `appointments.status_note`
- `appointment_status_history.changed_by`
- `blocked_dates.created_by`
- `blocked_slots.created_by`
- `clinic_settings.updated_by`

## Auth Model
- Dentist and staff sign in with Supabase Auth.
- Standard admin login flow is email + password + TOTP.
- Supabase TOTP is a second factor, not a password replacement.
- Forgot-password is email-link based.
- Recovery links must route to `doctors-login.html` reset flow.
- `admin_profiles` decides who can use the dashboard and whether the role is `dentist` or `staff`.
- Sensitive admin-only server actions use backend key through Netlify Functions.

## Public-Site Rules
- Customers can request bookings only for the configured next N days.
- Past slots for today are hidden.
- Approved or blocked sessions are unavailable.
- Weekly off and full-day blocks use centered yellow overlay with blurred disabled slots.
- After booking request success, customer stays on the selected date and sees a centered confirmation modal.
- Public pages now show `Back to Dashboard` only for authenticated dentist/staff sessions. Customers never see it.

## Dashboard Rules
- Lifecycle: Pending, Approved, Rejected, Completed, No-show.
- Actor role is written into notes for admin actions, for example:
  - `Booked by staff`
  - `Approved by dentist`
  - `Rejected by staff`
  - `Unblocked by dentist: customer requested cancellation`
- Day Snapshot is the visual day grid for appointments and blocked sessions.
- Appointments, Day Snapshot, Emergency Session Blocking, Holiday / Leave Blocking, and Manage Users use chevron collapse toggles.
- On mobile, Day Snapshot opens by default while the other collapsible dashboard sections start collapsed.
- Control Panel is internally scrollable and now has a visible top-right close button.
- Mobile/browser Back now closes Control Panel first instead of leaving the dashboard page.

## Blocking and Conflict Behavior
- Weekly holidays cannot be saved if they conflict with future Pending/Approved appointments.
- Emergency session blocking supports multi-select through a modal slot picker.
- If approved appointments already exist in a slot being blocked, the system warns first.
- Proceed-anyway path uses WhatsApp guarded confirmation before finalizing cancellation + block.
- Unblock uses fixed reasons:
  - customer didnt showup
  - customer requested cancellation
- Customer-requested cancellation uses WhatsApp guarded confirmation.

## WhatsApp Guarded Flow
- Current project uses browser redirect to WhatsApp drafts, not Twilio API.
- Important state-changing actions use guarded confirmation so the DB is only updated after user confirms `Message Sent`.
- This applies to approve, reject, Book for Patient notify flow, and conflict-driven cancellations.

## Analytics
Dashboard summary cards:
- page visits
- bookings
- pending
- approval rate

Dedicated page:
- `analytics.html`
- linked from dashboard through `View Insights ?`

Current infographic/insight blocks:
- Bookings Trend
- Approval Funnel
- Service Mix
- Peak Time Slots
- Weekday Demand
- Visits vs Bookings
- Blocked Capacity
- Insight Notes

## Control Panel
Current Control Panel areas:
- slot duration
- effective date for duration change
- next N booking days
- permanent weekly off
- Manage Users
- Current Access Users list
- Reset Past Data (dentist only)

Role rules:
- dentist sees all control-panel sections
- staff does not see Reset Past Data

## Manage Users
- Created from Control Panel, not from Supabase dashboard.
- Uses secure backend route and backend key only.
- New user creation requires fresh TOTP confirmation from the dentist.
- Current Access Users shows:
  - total count
  - full name
  - email
  - role

## Netlify Functions
Current secure server routes:
- `/api/admin-create-user`
- `/api/admin-list-users`
- `/api/reset-past-data`

Server env key logic:
- preferred: `SUPABASE_SERVER_KEY`
- legacy fallback: `SUPABASE_SERVICE_ROLE_KEY`

## Realtime and Alerts
- LiveDeskAlert tries Supabase realtime first.
- If realtime is unavailable, polling fallback runs.
- New bookings can show a bottom-left alert and play a short sound while dashboard is open.

## Environment Variables
Frontend/runtime:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Server-side:
- `SUPABASE_SERVER_KEY` preferred
- `SUPABASE_SERVICE_ROLE_KEY` legacy fallback

Optional future WhatsApp API env vars if Twilio is re-enabled:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`

## Local Development
Preferred local command:
```bash
npm install
npx netlify dev --port 8889 --staticServerPort 4002
```

Older alternate local command still works if ports are free:
```bash
npx netlify dev --port 8888 --staticServerPort 4001
```

Typical local URLs:
- `http://localhost:8889/index.html`
- `http://localhost:8889/gallery.html`
- `http://localhost:8889/doctors-login.html`
- `http://localhost:8889/analytics.html`

## Deployment
- Netlify auto-deploys from GitHub `main`.
- Publish directory is repository root.
- `netlify.toml` is already configured.
- After changing Netlify env vars, trigger a fresh deploy.

## Current Security Position
- Public convenience links do not bypass auth.
- `Back to Dashboard` only appears when current session belongs to an `admin_profiles` user.
- Direct admin URL access still requires valid login and role.
- Backend-only actions are protected by server-side key and role checks.

## Shared Vocabulary
- `WASafeConfirm`
  - guarded WhatsApp workflow where data changes only after `Message Sent`
- `SlotGuard`
  - slot conflict prevention before booking or slot-changing actions
- `BlockConflict`
  - emergency blocking conflict flow against approved appointments
- `DayOverlay`
  - yellow centered full-day unavailable overlay
- `UnblockReasonFlow`
  - fixed unblock reasons with conditional behavior
- `LiveDeskAlert`
  - realtime/polling admin booking alert
- `BookingWindowControl`
  - clinic settings logic for booking visibility and slot duration
- `AdminReturnLink`
  - public-page `Back to Dashboard` button shown only to active dentist/staff sessions
- `ControlPanelHistoryGuard`
  - history-state pattern that closes Control Panel on browser/mobile Back before leaving dashboard

## Important Operational Notes
- Supabase password-reset links depend on correct `Site URL` and `Redirect URLs` in Auth URL Configuration.
- Recovery links should include or resolve to `doctors-login.html` with reset mode.
- Old auth users may fail deletion in Supabase even after app references are moved; banning old user is operationally acceptable if deletion remains blocked.
- TOTP-only login without password is not currently recommended and is not the normal Supabase MFA flow.

## Continuity
If context is lost or work moves to another IDE:
1. Read this file.
2. Read `DENTIST_APP_REBUILD_BLUEPRINT.txt`.
3. Read `SUPABASE_MIGRATION_GUIDE.txt` and `HOSTING_DEPLOYMENT_GUIDE.txt` if deploy/migration work is involved.
4. Start local with Netlify dev.
5. Verify booking, login, Control Panel, and analytics before making changes.
