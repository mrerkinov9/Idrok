create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Idrok foydalanuvchisi',
  email text not null default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  impulse integer not null default 50 check (impulse >= 0),
  lifetime_impulse integer not null default 50 check (lifetime_impulse >= 0),
  score integer not null default 0 check (score >= 0),
  completed jsonb not null default '[]'::jsonb,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  garden jsonb,
  physics7_state jsonb,
  physics8_state jsonb,
  physics_state jsonb,
  physics10_state jsonb,
  physics11_state jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (name, email, impulse, lifetime_impulse, score, completed, theme, garden, physics7_state, physics8_state, physics_state, physics10_state, physics11_state, updated_at) on public.profiles to authenticated;
revoke all on public.profiles from anon;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1), 'Idrok foydalanuvchisi'),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

insert into public.profiles (id, name, email)
select
  id,
  coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name', split_part(email, '@', 1), 'Idrok foydalanuvchisi'),
  coalesce(email, '')
from auth.users
on conflict (id) do nothing;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace view public.leaderboard as
select
  id,
  name,
  impulse,
  lifetime_impulse,
  coalesce((garden ->> 'gardenPoints')::numeric, 0) as garden_points,
  coalesce((garden ->> 'beautyScore')::numeric, 0) as beauty_score,
  coalesce((garden ->> 'focusMinutes')::numeric, 0) as focus_minutes,
  lifetime_impulse
    + coalesce((garden ->> 'beautyScore')::numeric, 0)
    + coalesce((garden ->> 'focusMinutes')::numeric, 0) * 2 as overall
from public.profiles
where role = 'student';

grant select on public.leaderboard to anon, authenticated;
