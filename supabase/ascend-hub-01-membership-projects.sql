-- Ascend Hub: moderated membership and worldwide project directory.
-- Apply in Supabase SQL Editor after reviewing existing live schema.
-- Do NOT expose the service-role key in browser code.

create table if not exists public.ascend_hub_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);

create table if not exists public.ascend_hub_members (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (char_length(display_name) between 2 and 100),
 organization text not null default '',
 country text not null default '',
 city text not null default '',
 discipline text not null default '',
 bio text not null default '',
 website text not null default '',
 status text not null default 'pending' check(status in ('pending','approved','declined')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint hub_member_bio_length check (char_length(bio) <= 1500),
 constraint hub_member_website_length check (char_length(website) <= 300)
);

create table if not exists public.ascend_hub_projects (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(char_length(title) between 5 and 150),
 description text not null check(char_length(description) between 30 and 3000),
 discipline text not null default '',
 country text not null default '',
 city text not null default '',
 latitude double precision check(latitude between -90 and 90),
 longitude double precision check(longitude between -180 and 180),
 website text not null default '',
 looking_for text not null default '',
 status text not null default 'pending' check(status in ('pending','approved','declined')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint hub_project_website_length check(char_length(website) <= 300)
);
create index if not exists ascend_hub_projects_status_idx on public.ascend_hub_projects(status,created_at desc);
create index if not exists ascend_hub_projects_owner_idx on public.ascend_hub_projects(owner_id);

-- Security-definer membership checks avoid recursive RLS lookups.
create or replace function public.is_ascend_hub_admin()
returns boolean language sql stable security definer
set search_path = '' as $$
 select exists(select 1 from public.ascend_hub_admins where user_id = (select auth.uid()));
$$;
create or replace function public.is_ascend_hub_approved()
returns boolean language sql stable security definer
set search_path = '' as $$
 select exists(select 1 from public.ascend_hub_members
               where user_id = (select auth.uid()) and status = 'approved');
$$;
revoke all on function public.is_ascend_hub_admin() from public;
revoke all on function public.is_ascend_hub_approved() from public;
grant execute on function public.is_ascend_hub_admin() to anon,authenticated; -- anonymous callers return false
grant execute on function public.is_ascend_hub_approved() to authenticated;

alter table public.ascend_hub_admins enable row level security;
alter table public.ascend_hub_members enable row level security;
alter table public.ascend_hub_projects enable row level security;

-- Admin list is never client writable.
drop policy if exists "Hub admins can read admin membership" on public.ascend_hub_admins;
create policy "Hub admins can read admin membership" on public.ascend_hub_admins
 for select to authenticated using (public.is_ascend_hub_admin());

drop policy if exists "Hub members read approved directory or own application" on public.ascend_hub_members;
create policy "Hub members read approved directory or own application" on public.ascend_hub_members
 for select to authenticated
 using (user_id = (select auth.uid()) or public.is_ascend_hub_admin()
        or (status='approved' and public.is_ascend_hub_approved()));

drop policy if exists "Hub applicants submit own membership" on public.ascend_hub_members;
create policy "Hub applicants submit own membership" on public.ascend_hub_members
 for insert to authenticated
 with check (user_id=(select auth.uid()) and status='pending');

-- Ordinary members cannot UPDATE or DELETE applications. Admins decide.
drop policy if exists "Hub admins review members" on public.ascend_hub_members;
create policy "Hub admins review members" on public.ascend_hub_members
 for update to authenticated
 using (public.is_ascend_hub_admin())
 with check (public.is_ascend_hub_admin());

drop policy if exists "Hub members read approved projects or own submissions" on public.ascend_hub_projects;
create policy "Hub members read approved projects or own submissions" on public.ascend_hub_projects
 for select to authenticated
 using (owner_id=(select auth.uid()) or public.is_ascend_hub_admin()
        or (status='approved' and public.is_ascend_hub_approved()));

drop policy if exists "Approved Hub members submit projects" on public.ascend_hub_projects;
create policy "Approved Hub members submit projects" on public.ascend_hub_projects
 for insert to authenticated
 with check (owner_id=(select auth.uid()) and status='pending'
             and public.is_ascend_hub_approved());

drop policy if exists "Hub admins moderate projects" on public.ascend_hub_projects;
create policy "Hub admins moderate projects" on public.ascend_hub_projects
 for update to authenticated
 using (public.is_ascend_hub_admin())
 with check (public.is_ascend_hub_admin());

-- Supabase SQL editor only: seed the first administrator deliberately.
-- insert into public.ascend_hub_admins(user_id)
-- values ('REPLACE_WITH_VERIFIED_AUTH_USER_UUID');
--
-- Review applications (SQL Editor administrator privileges):
-- select user_id,display_name,status,created_at from public.ascend_hub_members order by created_at desc;
-- update public.ascend_hub_members set status='approved',updated_at=now()
-- where user_id='REPLACE_WITH_APPLICANT_UUID';
-- update public.ascend_hub_projects set status='approved',updated_at=now()
-- where id='REPLACE_WITH_PROJECT_UUID';
