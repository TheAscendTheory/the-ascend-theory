-- Hardening verified against the live Supabase project 2026-11-22.
-- Anonymous users may read published Academy data; privileged auth status functions
-- are restricted to signed-in users, and publication policies are separated by role.
revoke all on function public.is_ascend_hub_admin() from public, anon;
revoke all on function public.is_ascend_hub_approved() from public, anon;
grant execute on function public.is_ascend_hub_admin() to authenticated;
grant execute on function public.is_ascend_hub_approved() to authenticated;

drop policy if exists "Academy browse published courses" on public.ascend_academy_courses;
drop policy if exists "Academy public published courses" on public.ascend_academy_courses;
drop policy if exists "Academy signed-in published or admin courses" on public.ascend_academy_courses;
create policy "Academy public published courses" on public.ascend_academy_courses
 for select to anon using(published=true);
create policy "Academy signed-in published or admin courses" on public.ascend_academy_courses
 for select to authenticated using(published=true or public.is_ascend_hub_admin());

drop policy if exists "Academy browse published lessons" on public.ascend_academy_lessons;
drop policy if exists "Academy public published lessons" on public.ascend_academy_lessons;
drop policy if exists "Academy signed-in published or admin lessons" on public.ascend_academy_lessons;
create policy "Academy public published lessons" on public.ascend_academy_lessons
 for select to anon using(
 published=true and exists(
 select 1 from public.ascend_academy_courses c where c.id=course_id and c.published=true));
create policy "Academy signed-in published or admin lessons" on public.ascend_academy_lessons
 for select to authenticated using(
 public.is_ascend_hub_admin() or
 (published=true and exists(
 select 1 from public.ascend_academy_courses c where c.id=course_id and c.published=true)));
