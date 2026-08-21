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
  leaderboard_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists leaderboard_opt_in boolean not null default false;

update public.profiles
set name = coalesce(nullif(left(regexp_replace(trim(name), '[<>]', '', 'g'), 80), ''), 'Idrok foydalanuvchisi')
where name <> coalesce(nullif(left(regexp_replace(trim(name), '[<>]', '', 'g'), 80), ''), 'Idrok foydalanuvchisi');

alter table public.profiles drop constraint if exists profiles_name_length;
alter table public.profiles add constraint profiles_name_length
check (char_length(trim(name)) between 1 and 80);

alter table public.profiles drop constraint if exists profiles_completed_array;
update public.profiles
set completed = '[]'::jsonb
where jsonb_typeof(completed) <> 'array';
update public.profiles
set completed = (
  select coalesce(jsonb_agg(item.value order by item.ordinality), '[]'::jsonb)
  from jsonb_array_elements(public.profiles.completed) with ordinality as item(value, ordinality)
  where item.ordinality <= 500
)
where jsonb_array_length(completed) > 500;
alter table public.profiles add constraint profiles_completed_array
check (jsonb_typeof(completed) = 'array' and jsonb_array_length(completed) <= 500);

alter table public.profiles drop constraint if exists profiles_garden_size;
alter table public.profiles add constraint profiles_garden_size
check (garden is null or pg_column_size(garden) <= 1048576) not valid;

alter table public.profiles enable row level security;

revoke all on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (name, email, impulse, score, completed, theme, garden, physics7_state, physics8_state, physics_state, physics10_state, physics11_state, leaderboard_opt_in, updated_at) on public.profiles to authenticated;
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

create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if auth.uid() is not null and auth.uid() = old.id then
    new.id := old.id;
    new.role := old.role;
    new.email := old.email;
    new.name := coalesce(nullif(left(regexp_replace(trim(new.name), '[<>]', '', 'g'), 80), ''), 'Idrok foydalanuvchisi');
    new.score := greatest(old.score, least(new.score, old.score + 100));
    new.lifetime_impulse := greatest(old.lifetime_impulse, old.impulse)
      + greatest(0, new.impulse - old.impulse);
    new.updated_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_update_trigger on public.profiles;
create trigger guard_profile_update_trigger
before update on public.profiles
for each row execute procedure public.guard_profile_update();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(nullif(left(regexp_replace(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))), '[<>]', '', 'g'), 80), ''), 'Idrok foydalanuvchisi'),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

insert into public.profiles (id, name, email)
select
  id,
  coalesce(nullif(left(regexp_replace(trim(coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name', split_part(email, '@', 1))), '[<>]', '', 'g'), 80), ''), 'Idrok foydalanuvchisi'),
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
where role = 'student' and leaderboard_opt_in = true;

revoke all on public.leaderboard from anon;
grant select on public.leaderboard to authenticated;
