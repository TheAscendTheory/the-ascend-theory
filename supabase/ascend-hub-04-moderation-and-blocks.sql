-- Ascend Hub moderation: reports, blocking and member safety.
-- Deploy after ascend-hub-01-membership-projects.sql.
create table if not exists public.ascend_hub_reports (
 id uuid primary key default gen_random_uuid(),
 reporter_id uuid not null references auth.users(id) on delete cascade,
 target_type text not null check(target_type in ('member','project')),
 target_user_id uuid references auth.users(id) on delete cascade,
 target_project_id uuid references public.ascend_hub_projects(id) on delete cascade,
 reason text not null check(char_length(reason) between 10 and 1500),
 status text not null default 'pending' check(status in ('pending','reviewed','resolved')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint ascend_hub_reports_target check(
 (target_type='member' and target_user_id is not null and target_project_id is null)
 or (target_type='project' and target_project_id is not null and target_user_id is null))
);
create table if not exists public.ascend_hub_blocks (
 blocker_id uuid not null references auth.users(id) on delete cascade,
 blocked_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(blocker_id,blocked_id),
 constraint hub_not_self_block check(blocker_id<>blocked_id)
);
create index if not exists ascend_hub_reports_status on public.ascend_hub_reports(status,created_at desc);
alter table public.ascend_hub_reports enable row level security;
alter table public.ascend_hub_blocks enable row level security;

drop policy if exists "Hub reports submit own" on public.ascend_hub_reports;
create policy "Hub reports submit own" on public.ascend_hub_reports for insert
 to authenticated with check(reporter_id=(select auth.uid()) and public.is_ascend_hub_approved());
drop policy if exists "Hub reports read own or admin" on public.ascend_hub_reports;
create policy "Hub reports read own or admin" on public.ascend_hub_reports for select
 to authenticated using(reporter_id=(select auth.uid()) or public.is_ascend_hub_admin());
drop policy if exists "Hub reports admin review" on public.ascend_hub_reports;
create policy "Hub reports admin review" on public.ascend_hub_reports for update
 to authenticated using(public.is_ascend_hub_admin()) with check(public.is_ascend_hub_admin());

drop policy if exists "Hub blocks manage own read" on public.ascend_hub_blocks;
create policy "Hub blocks manage own read" on public.ascend_hub_blocks for select
 to authenticated using(blocker_id=(select auth.uid()));
drop policy if exists "Hub blocks own insert" on public.ascend_hub_blocks;
create policy "Hub blocks own insert" on public.ascend_hub_blocks for insert
 to authenticated with check(blocker_id=(select auth.uid()) and public.is_ascend_hub_approved());
drop policy if exists "Hub blocks own delete" on public.ascend_hub_blocks;
create policy "Hub blocks own delete" on public.ascend_hub_blocks for delete
 to authenticated using(blocker_id=(select auth.uid()));
