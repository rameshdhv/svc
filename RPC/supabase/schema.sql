create extension if not exists "pgcrypto";

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('lead_therapist', 'staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  patient_phone text not null,
  preferred_date date not null,
  preferred_slot text not null,
  service text not null check (service in ('General', 'Musculoskeletal Physiotherapy', 'Sports Physiotherapy', 'Neurological Physiotherapy', 'Geriatric Physiotherapy', 'Paediatric Physiotherapy', 'Women''s Health Physiotherapy', 'Vestibular Rehabilitation', 'Post-Operative Rehabilitation', 'Pain Management Physiotherapy')),
  notes text,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected', 'Completed', 'No-show')),
  status_note text,
  approved_at timestamptz,
  approved_by uuid references auth.users (id),
  whatsapp_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointments
add column if not exists whatsapp_sent_at timestamptz;

create table if not exists public.appointment_status_history (
  id bigserial primary key,
  appointment_id uuid not null references public.appointments (id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid references auth.users (id),
  changed_at timestamptz not null default now()
);

create table if not exists public.visitor_events (
  id bigserial primary key,
  event_name text not null,
  event_value text,
  session_id text,
  page_path text,
  created_at timestamptz not null default now()
);

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

create table if not exists public.clinic_settings (
  id int primary key default 1,
  slot_duration_minutes int not null default 30 check (slot_duration_minutes in (30, 60)),
  booking_window_days int not null default 10 check (booking_window_days between 1 and 90),
  weekly_off_days text[] not null default '{}',
  effective_from_date date not null default current_date,
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now(),
  constraint single_settings_row check (id = 1)
);

alter table public.clinic_settings
add column if not exists booking_window_days int not null default 10;

alter table public.clinic_settings
add column if not exists weekly_off_days text[] not null default '{}';

alter table public.clinic_settings
drop constraint if exists clinic_settings_booking_window_days_check;

alter table public.clinic_settings
add constraint clinic_settings_booking_window_days_check check (booking_window_days between 1 and 90);

insert into public.clinic_settings (id, slot_duration_minutes, booking_window_days, weekly_off_days, effective_from_date)
values (1, 30, 10, '{}', current_date)
on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_appointments_updated_at on public.appointments;
create trigger trg_appointments_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();

create or replace function public.log_appointment_status_change()
returns trigger
language plpgsql
as $$
begin
  if new.status is distinct from old.status then
    insert into public.appointment_status_history (appointment_id, old_status, new_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists trg_appointments_status_history on public.appointments;
create trigger trg_appointments_status_history
after update on public.appointments
for each row
execute function public.log_appointment_status_change();

create or replace view public.slot_occupancy as
select preferred_date, preferred_slot, status
from public.appointments
where status = 'Approved';

create or replace function public.get_approved_slots(p_date date)
returns table(preferred_slot text)
language sql
security definer
set search_path = public
as $$
  select a.preferred_slot
  from public.appointments a
  where a.preferred_date = p_date
    and a.status = 'Approved';
$$;

alter table public.admin_profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_status_history enable row level security;
alter table public.visitor_events enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.clinic_settings enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
  );
$$;

-- Public can create appointment requests only in Pending status.
drop policy if exists "public_insert_pending_appointments" on public.appointments;
create policy "public_insert_pending_appointments"
on public.appointments
for insert
to anon, authenticated
with check (
  status = 'Pending'
  and not exists (
    select 1
    from public.blocked_dates bd
    where preferred_date between bd.from_date and bd.to_date
  )
  and not exists (
    select 1
    from public.blocked_slots bs
    where bs.block_date = preferred_date
      and bs.slot_label = preferred_slot
  )
);

drop policy if exists "admin_insert_appointments" on public.appointments;
create policy "admin_insert_appointments"
on public.appointments
for insert
to authenticated
with check (public.is_admin_user());

-- Admin users can view and update appointments.
drop policy if exists "admin_select_appointments" on public.appointments;
create policy "admin_select_appointments"
on public.appointments
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "admin_update_appointments" on public.appointments;
create policy "admin_update_appointments"
on public.appointments
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

-- Admin users can read status history.
drop policy if exists "admin_select_status_history" on public.appointment_status_history;
create policy "admin_select_status_history"
on public.appointment_status_history
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "admin_insert_status_history" on public.appointment_status_history;
create policy "admin_insert_status_history"
on public.appointment_status_history
for insert
to authenticated
with check (public.is_admin_user());

-- Public insert for basic analytics; admin can read.
drop policy if exists "public_insert_visitor_events" on public.visitor_events;
create policy "public_insert_visitor_events"
on public.visitor_events
for insert
to anon, authenticated
with check (true);

drop policy if exists "admin_select_visitor_events" on public.visitor_events;
create policy "admin_select_visitor_events"
on public.visitor_events
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "public_select_blocked_dates" on public.blocked_dates;
create policy "public_select_blocked_dates"
on public.blocked_dates
for select
to anon, authenticated
using (true);

drop policy if exists "admin_insert_blocked_dates" on public.blocked_dates;
create policy "admin_insert_blocked_dates"
on public.blocked_dates
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "admin_delete_blocked_dates" on public.blocked_dates;
create policy "admin_delete_blocked_dates"
on public.blocked_dates
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "public_select_blocked_slots" on public.blocked_slots;
create policy "public_select_blocked_slots"
on public.blocked_slots
for select
to anon, authenticated
using (true);

drop policy if exists "admin_insert_blocked_slots" on public.blocked_slots;
create policy "admin_insert_blocked_slots"
on public.blocked_slots
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "admin_delete_blocked_slots" on public.blocked_slots;
create policy "admin_delete_blocked_slots"
on public.blocked_slots
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "public_select_clinic_settings" on public.clinic_settings;
create policy "public_select_clinic_settings"
on public.clinic_settings
for select
to anon, authenticated
using (true);

drop policy if exists "admin_update_clinic_settings" on public.clinic_settings;
create policy "admin_update_clinic_settings"
on public.clinic_settings
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "admin_insert_clinic_settings" on public.clinic_settings;
create policy "admin_insert_clinic_settings"
on public.clinic_settings
for insert
to authenticated
with check (public.is_admin_user());

-- Allow authenticated user to check own profile.
drop policy if exists "self_select_profile" on public.admin_profiles;
create policy "self_select_profile"
on public.admin_profiles
for select
to authenticated
using (auth.uid() = user_id);

-- Grant occupancy view and function access.
grant select on public.slot_occupancy to anon, authenticated;
grant execute on function public.get_approved_slots(date) to anon, authenticated;

-- Example: after first OTP login, map user to staff/dentist manually.
-- insert into public.admin_profiles(user_id, role) values ('<auth_user_uuid>', 'lead_therapist');

