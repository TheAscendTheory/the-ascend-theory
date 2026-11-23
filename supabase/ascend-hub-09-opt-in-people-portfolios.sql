-- Ascend Hub: opt-in public changemaker profiles and user-curated initiative portfolios.
-- Public data is deliberately stored separately from private membership applications.
create table if not exists public.ascend_hub_public_profiles(
 user_id uuid primary key references public.ascend_hub_members(user_id) on delete cascade,
 headline text not null default '' check(char_length(headline)<=160),
 about text not null default '' check(char_length(about)<=3000),
 photo_url text not null default '' check(char_length(photo_url)<=500),
 banner_url text not null default '' check(char_length(banner_url)<=500),
 website_url text not null default '' check(char_length(website_url)<=500),
 featured_skills text[] not null default '{}'::text[],
 publicly_visible boolean not null default false,
 updated_at timestamptz not null default now()
);
create table if not exists public.ascend_hub_portfolio_initiatives(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.ascend_hub_public_profiles(user_id) on delete cascade,
 title text not null check(char_length(title) between 3 and 160),
 summary text not null default '' check(char_length(summary)<=2000),
 role_title text not null default '' check(char_length(role_title)<=150),
 start_date date,
 end_date date,
 cover_url text not null default '' check(char_length(cover_url)<=500),
 project_url text not null default '' check(char_length(project_url)<=500),
 featured boolean not null default false,
 publicly_visible boolean not null default false,
 sort_order integer not null default 0,
 updated_at timestamptz not null default now(),
 constraint valid_portfolio_dates check(end_date is null or start_date is null or end_date>=start_date)
);
create index if not exists hub_portfolio_owner on public.ascend_hub_portfolio_initiatives(user_id,sort_order);
alter table public.ascend_hub_public_profiles enable row level security;
alter table public.ascend_hub_portfolio_initiatives enable row level security;
-- RLS checks the membership status for public display. A user owns their draft independently.
create policy "Published approved profile read" on public.ascend_hub_public_profiles
 for select to anon using (publicly_visible and exists (
 select 1 from public.ascend_hub_members m where m.user_id=ascend_hub_public_profiles.user_id and m.status='approved'));
create policy "Signed-in profile read" on public.ascend_hub_public_profiles
 for select to authenticated using(user_id=(select auth.uid()) or public.is_ascend_hub_admin() or
 (publicly_visible and exists(select 1 from public.ascend_hub_members m where m.user_id=ascend_hub_public_profiles.user_id and m.status='approved')));
create policy "Owners create profile" on public.ascend_hub_public_profiles
 for insert to authenticated with check(user_id=(select auth.uid()));
create policy "Owners edit profile" on public.ascend_hub_public_profiles
 for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy "Public opt-in portfolio read" on public.ascend_hub_portfolio_initiatives
 for select to anon using(publicly_visible and exists (
 select 1 from public.ascend_hub_public_profiles p join public.ascend_hub_members m on m.user_id=p.user_id
 where p.user_id=ascend_hub_portfolio_initiatives.user_id and p.publicly_visible and m.status='approved'));
create policy "Signed-in portfolio read" on public.ascend_hub_portfolio_initiatives
 for select to authenticated using(user_id=(select auth.uid()) or public.is_ascend_hub_admin() or
 (publicly_visible and exists(
 select 1 from public.ascend_hub_public_profiles p join public.ascend_hub_members m on m.user_id=p.user_id
 where p.user_id=ascend_hub_portfolio_initiatives.user_id and p.publicly_visible and m.status='approved')));
create policy "Portfolio owners insert" on public.ascend_hub_portfolio_initiatives
 for insert to authenticated with check(user_id=(select auth.uid()));
create policy "Portfolio owners update" on public.ascend_hub_portfolio_initiatives
 for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy "Portfolio owners delete" on public.ascend_hub_portfolio_initiatives
 for delete to authenticated using(user_id=(select auth.uid()));
grant select on public.ascend_hub_public_profiles,public.ascend_hub_portfolio_initiatives to anon;
grant select,insert,update on public.ascend_hub_public_profiles to authenticated;
grant select,insert,update,delete on public.ascend_hub_portfolio_initiatives to authenticated;
-- Anonymous can obtain only explicitly shareable profile fields through the
-- security-invoker view, NOT private application data such as biography/contact info.
create or replace view public.ascend_hub_public_people with (security_invoker=true) as
 select p.user_id, m.display_name, m.discipline, m.city, m.country, m.organization,
 p.headline,p.about,p.photo_url,p.banner_url,p.website_url,p.featured_skills,p.updated_at
 from public.ascend_hub_public_profiles p
 join public.ascend_hub_members m on m.user_id=p.user_id
 where p.publicly_visible and m.status='approved';
grant select on public.ascend_hub_public_people to anon,authenticated;
-- Anon must be able to SELECT approved membership rows for this security-invoker
-- view to work; member table's public policy exposes only approved people in the
-- view, but the underlying members table is NOT safe as a public API. Instead,
-- use a carefully controlled security-definer RPC returning whitelisted fields.
revoke select on public.ascend_hub_public_people from anon,authenticated;
drop view public.ascend_hub_public_people;
create or replace function public.discover_ascend_hub_people()
returns table(user_id uuid,display_name text,discipline text,city text,country text,organization text,
 headline text,about text,photo_url text,banner_url text,website_url text,featured_skills text[])
language sql stable security definer set search_path='' as $$
 select p.user_id,m.display_name,m.discipline,m.city,m.country,m.organization,
 p.headline,p.about,p.photo_url,p.banner_url,p.website_url,p.featured_skills
 from public.ascend_hub_public_profiles p
 join public.ascend_hub_members m on m.user_id=p.user_id
 where p.publicly_visible and m.status='approved'
 order by m.display_name limit 200;
$$;
revoke all on function public.discover_ascend_hub_people() from public;
grant execute on function public.discover_ascend_hub_people() to anon,authenticated;
