# Sarvam Dental Clinic - Project Handoff

## 1. Project Summary
- Public website with online appointment requests.
- Admin dashboard for dentist/staff to manage appointments.
- Supabase backend for auth, data, and policies.
- Netlify hosting and optional serverless function integration.
- Mobile-specific UX improvements layered without breaking desktop/tablet.

Production URL:
- https://sarvamdentalclinic.netlify.app/

Repository:
- https://github.com/rameshdhv/svc

## 2. Tech Stack
- Frontend: static HTML/CSS/JS (no framework)
- Backend: Supabase (Postgres + Auth + RLS + RPC)
- Hosting: Netlify
- Optional messaging: Twilio WhatsApp (currently disabled by user)

## 3. Key Pages
- `index.html` - public landing + services + booking form
- `gallery.html` - treatment gallery
- `doctors-login.html` - admin/staff login + dashboard
- `admin.html` - redirect helper to doctors login

## 4. Important JS Files
- `assets/js/main.js`
  - public booking flow
  - slot rendering + blocked date/session checks
  - mobile section switching (Home/Services/Book)
  - mobile booking view switch (Appointment Form / Clinic Info)
  - footer about/locate mobile routing behavior
- `assets/js/admin.js`
  - auth and password reset
  - dashboard load and filtering
  - appointment status transitions (approve/reject/unblock etc.)
  - timeline rendering and actions
  - blocking/unblocking dates and sessions
  - clinic settings (slot duration + effective date)
  - manual booking

## 5. Database / Supabase
Primary schema file:
- `supabase/schema.sql`

Core tables in use:
- `appointments`
- `appointment_status_history`
- `admin_profiles`
- `visitor_events`
- `blocked_dates`
- `blocked_slots`
- `clinic_settings`

Auth model:
- Admin/staff login via Supabase Auth email/password
- Access control through `admin_profiles` + RLS policies

## 6. Appointment Workflow
1. Customer requests slot -> `Pending`
2. Staff/Dentist in dashboard:
   - `Approved` (slot effectively consumed)
   - `Rejected`
   - `Completed`
   - `No-show`
3. Approved future entries support `Unblock` with mandatory reason.
4. Blocking controls:
   - Holiday/date range blocking
   - Emergency session slot blocking

## 7. Mobile UX Decisions Implemented
- Mobile-only section mode:
  - Nav `Home/Services/Book` acts like content switcher
  - Only one section shown at a time on phones
- Services on mobile are list-based (no auto-swiping)
- Slot buttons in booking form: 3-column mobile grid
- Footer links `About Us` and `Locate Us` route correctly on mobile
- Mobile timeline in admin made more compact
- Caret/cursor blinking reduced on non-input elements

Desktop/tablet layouts intentionally preserved.

## 8. Environment Variables (Netlify)
Used/expected:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (or Supabase Secret Key equivalent for server-side)

Optional (if Twilio re-enabled):
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`

## 9. Local Development
From project root:
```bash
npm install
npx netlify dev --port 8888 --staticServerPort 4001
```

Pages:
- `http://localhost:8888/index.html`
- `http://localhost:8888/gallery.html`
- `http://localhost:8888/doctors-login.html`

## 10. Deployment
- Netlify deploys from GitHub repo.
- No build step required; publish directory is root (`.`).
- `netlify.toml` already configured.

## 11. Current Known Notes
- Twilio currently disabled by user; site uses WhatsApp redirect flow from browser in admin actions.
- Admin portal is not linked openly from public nav; accessed directly by URL:
  - `/doctors-login.html`

## 12. Backup and Continuity
Keep these safe:
- GitHub repo
- Supabase credentials and project details
- Netlify site settings/env vars
- this `HANDSOFF.md`
- `MAINTENANCE_BACKUP_GUIDE.txt`

If project moves to another IDE/system:
1. Clone repo
2. Re-add env vars
3. Run local Netlify dev
4. Verify booking + admin flows

