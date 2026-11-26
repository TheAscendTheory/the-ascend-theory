-- Open discovery of verified, approved initiatives; no anonymous writes.
-- Keep member applications and full profiles private to signed-in approved members.
grant select on public.ascend_hub_projects to anon;
drop policy if exists "Public can discover approved Hub projects" on public.ascend_hub_projects;
create policy "Public can discover approved Hub projects"
 on public.ascend_hub_projects for select to anon
 using(status = 'approved');
