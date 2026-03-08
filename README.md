# Sarvam Dental Clinic - Supabase + Netlify Setup

## What is implemented
- Public booking site with real slots (10:30 AM to 6:30 PM, 30 min slots)
- Slot color rules:
  - Available: green
  - Approved: grey
- Appointment lifecycle:
  - Pending, Approved, Rejected, Completed, No-show
- Admin dashboard with Email + Password login (Supabase Auth)
- Dentist/staff approval/rejection from dashboard
- WhatsApp message on approval via Twilio (serverless function)
- Basic analytics cards (visits, bookings, pending, approval rate)
- Quick status tabs + approve/reject confirmation modal
- WhatsApp redirect message on approve/reject with `whatsapp_sent_at` timestamp tracking
- Holiday blocking with date-range controls in admin dashboard
- Emergency session blocking with unblock controls
- Manual booking by staff with instant WhatsApp confirmation draft
- Self-serve forgot password flow for doctor/staff login
- Booking window control (next N days) from admin settings
- Permanent weekly-off rules (for example Sunday off) from admin settings
- Auto-hide expired same-day slots for customers
- Admin-only secure past-data reset by month with password confirmation

## 1) Run SQL in Supabase
- Open Supabase SQL editor and run:
- `supabase/schema.sql`
- If schema was already applied earlier, run this too:
```sql
alter table public.appointments
add column if not exists whatsapp_sent_at timestamptz;
```
```sql
create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  from_date date not null,
  to_date date not null,
  reason text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  constraint blocked_dates_valid_range check (to_date >= from_date)
);

create table if not exists public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  block_date date not null,
  slot_label text not null,
  reason text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  unique (block_date, slot_label)
);
```

## 2) Enable Email Provider in Supabase
- Supabase Dashboard -> Authentication -> Providers -> Email
- Enable Email provider (default)
- Disable Phone provider if not needed
- Create dentist/staff users with email and password:
  - Authentication -> Users -> Add user
- Configure reset redirect URL:
  - Authentication -> URL Configuration -> Additional Redirect URLs
  - Add: `http://localhost:8888/doctors-login.html`

## 3) Add admin users
- First login once with email+password from `doctors-login.html`
- Get user id from `auth.users` (email identity)
- Insert role:

```sql
insert into public.admin_profiles(user_id, role)
values ('<auth_user_uuid>', 'dentist');
```

Use `staff` for staff users.

## 4) Configure Netlify env vars
Set these in Netlify Site Settings -> Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `SUPABASE_ANON_KEY` (also required by reset-past-data function for password verification)

For Twilio sandbox, `TWILIO_WHATSAPP_FROM` is usually `whatsapp:+14155238886`.
For production, use your approved WhatsApp sender.

## 5) Deploy
- Push project to GitHub
- Connect repo in Netlify
- Build command: none
- Publish directory: `.`
- Functions directory: `netlify/functions` (already configured in `netlify.toml`)

Netlify and Supabase work together well:
- Frontend pages are hosted on Netlify
- Supabase handles database, auth, and realtime APIs
- Netlify Functions can call Supabase server-side using service role key

## 6) Local testing
```bash
npm install
npm run dev
```
Open:
- `http://localhost:8888/index.html`
- `http://localhost:8888/doctors-login.html`

If port 8888 is already busy, run:
```bash
npx netlify dev --port 8899 --staticServerPort 4001
```

## Important security notes
- Do not hardcode Twilio Auth Token or Supabase service role key in frontend.
- Rotate exposed credentials before production, especially:
  - Twilio Auth Token
  - Supabase anon key (best practice after sharing)

