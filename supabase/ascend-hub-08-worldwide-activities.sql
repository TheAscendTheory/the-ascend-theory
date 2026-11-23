-- Hub real-world happening: events and activities as first-class moderated records.
create table if not exists public.ascend_hub_events(
 id uuid primary key default gen_random_uuid(),
 host_user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(char_length(title) between 5 and 160),
 description text not null default '' check(char_length(description)<=3000),
 category text not null default '',
 venue text not null default '',
 city text not null default '',
 country text not null default '',
 latitude double precision check(latitude between -90 and 90),
 longitude double precision check(longitude between -180 and 180),
 starts_at timestamptz not null,
 ends_at timestamptz,
 link_url text not null default '' check(char_length(link_url)<=500),
 is_online boolean not null default false,
 status text not null default 'pending' check(status in('pending','approved','declined','cancelled')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint end_after_start check(ends_at is null or ends_at>starts_at)
);
create index if not exists ascend_hub_events_public_idx on public.ascend_hub_events(status,starts_at);
alter table public.ascend_hub_events enable row level security;
create policy "Public discover approved upcoming activities" on public.ascend_hub_events
 for select to anon using(status='approved' and starts_at > now()-interval '1 day');
create policy "Members view published and own activities" on public.ascend_hub_events
 for select to authenticated using(status='approved' or host_user_id=(select auth.uid()) or public.is_ascend_hub_admin());
create policy "Approved members propose activities" on public.ascend_hub_events
 for insert to authenticated with check(host_user_id=(select auth.uid()) and status='pending' and (public.is_ascend_hub_approved() or public.is_ascend_hub_admin()));
create policy "Admins moderate activities" on public.ascend_hub_events
 for update to authenticated using(public.is_ascend_hub_admin()) with check(public.is_ascend_hub_admin());
grant select on public.ascend_hub_events to anon;
grant select,insert,update on public.ascend_hub_events to authenticated;