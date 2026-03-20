# Sarvam Dental Clinic

Production: https://sarvamdentalclinic.netlify.app/
Repository: https://github.com/rameshdhv/svc

## What this project is
Sarvam Dental Clinic is a static public website plus a private Supabase-backed admin dashboard for dentist and staff operations.

## Public experience
- landing page with clinic branding
- services section
- before/after gallery
- online appointment request form
- slot colors and availability logic
- About Us and Locate Us sections
- Google Maps link support

## Admin experience
- dentist/staff login
- Supabase email + password + TOTP
- forgot password and reset-password flow
- appointment approvals and rejections
- Day Snapshot
- holiday and session blocking
- Book for Patient
- Control Panel
- Manage Users
- analytics page with infographic-style insights

## Main routes
- `/index.html`
- `/gallery.html`
- `/doctors-login.html`
- `/analytics.html`

## Stack
- HTML / CSS / vanilla JS
- Supabase Auth + Postgres + RLS
- Netlify hosting
- Netlify Functions for secure admin-only actions

## Current secure backend endpoints
- `/api/admin-create-user`
- `/api/admin-list-users`
- `/api/reset-past-data`

## Required environment variables
Frontend/runtime:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Server-side:
- `SUPABASE_SERVER_KEY` preferred
- `SUPABASE_SERVICE_ROLE_KEY` legacy fallback

## Local development
Preferred:
```bash
npm install
npx netlify dev --port 8889 --staticServerPort 4002
```

Alternative if ports are free:
```bash
npx netlify dev --port 8888 --staticServerPort 4001
```

Then open:
- `http://localhost:8889/index.html`
- `http://localhost:8889/doctors-login.html`
- `http://localhost:8889/analytics.html`

## Supabase setup reminders
- run `supabase/schema.sql`
- enable email provider
- enable TOTP MFA
- configure Auth URL Configuration correctly for production and local redirect URLs
- ensure dentist/staff users exist in `public.admin_profiles`

## Key project docs
- `HANDSOFF.md`
- `DENTIST_APP_REBUILD_BLUEPRINT.txt`
- `SUPABASE_MIGRATION_GUIDE.txt`
- `HOSTING_DEPLOYMENT_GUIDE.txt`
- `MAINTENANCE_BACKUP_GUIDE.txt`
- `FEATURE_CODENAMES.txt`

## Notes
- admin convenience links do not replace auth
- public `Back to Dashboard` is visible only to logged-in dentist/staff sessions
- Supabase TOTP is used as second factor, not password replacement
