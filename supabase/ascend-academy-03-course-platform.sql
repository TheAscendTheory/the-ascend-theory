-- Ascend Academy: author-managed interdisciplinary learning platform.
-- Independent from retired finance and trading curriculum.
-- Requires ascend-hub-01-membership-projects.sql (uses admin-check function).

create table if not exists public.ascend_academy_courses (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check(slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
 title text not null check(char_length(title) between 5 and 160),
 summary text not null default '',
 discipline text not null default '',
 cover_url text not null default '',
 published boolean not null default false,
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.ascend_academy_lessons (
 id uuid primary key default gen_random_uuid(),
 course_id uuid not null references public.ascend_academy_courses(id) on delete cascade,
 title text not null check(char_length(title) between 3 and 160),
 content text not null default '',
 sequence integer not null default 0 check(sequence between 0 and 10000),
 published boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create unique index if not exists ascend_academy_lesson_order_uniq
 on public.ascend_academy_lessons(course_id,sequence);

create table if not exists public.ascend_academy_lesson_completions (
 user_id uuid not null references auth.users(id) on delete cascade,
 lesson_id uuid not null references public.ascend_academy_lessons(id) on delete cascade,
 completed_at timestamptz not null default now(),
 primary key(user_id,lesson_id)
);

alter table public.ascend_academy_courses enable row level security;
alter table public.ascend_academy_lessons enable row level security;
alter table public.ascend_academy_lesson_completions enable row level security;

drop policy if exists "Academy browse published courses" on public.ascend_academy_courses;
create policy "Academy browse published courses"
 on public.ascend_academy_courses for select to anon,authenticated
 using(published=true or public.is_ascend_hub_admin());
drop policy if exists "Academy admins create courses" on public.ascend_academy_courses;
create policy "Academy admins create courses"
 on public.ascend_academy_courses for insert to authenticated
 with check(public.is_ascend_hub_admin() and created_by=(select auth.uid()));
drop policy if exists "Academy admins update courses" on public.ascend_academy_courses;
create policy "Academy admins update courses"
 on public.ascend_academy_courses for update to authenticated
 using(public.is_ascend_hub_admin()) with check(public.is_ascend_hub_admin());

drop policy if exists "Academy browse published lessons" on public.ascend_academy_lessons;
create policy "Academy browse published lessons"
 on public.ascend_academy_lessons for select to anon,authenticated
 using(
 public.is_ascend_hub_admin() or
 (published=true and exists(select 1 from public.ascend_academy_courses c
   where c.id=course_id and c.published=true))
 );
drop policy if exists "Academy admins create lessons" on public.ascend_academy_lessons;
create policy "Academy admins create lessons"
 on public.ascend_academy_lessons for insert to authenticated
 with check(public.is_ascend_hub_admin());
drop policy if exists "Academy admins update lessons" on public.ascend_academy_lessons;
create policy "Academy admins update lessons"
 on public.ascend_academy_lessons for update to authenticated
 using(public.is_ascend_hub_admin()) with check(public.is_ascend_hub_admin());

drop policy if exists "Learners read own completions" on public.ascend_academy_lesson_completions;
create policy "Learners read own completions"
 on public.ascend_academy_lesson_completions for select to authenticated
 using(user_id=(select auth.uid()));
drop policy if exists "Learners complete published lessons" on public.ascend_academy_lesson_completions;
create policy "Learners complete published lessons"
 on public.ascend_academy_lesson_completions for insert to authenticated
 with check(user_id=(select auth.uid()) and exists(
 select 1 from public.ascend_academy_lessons lesson
 join public.ascend_academy_courses course on course.id=lesson.course_id
 where lesson.id=lesson_id and lesson.published=true and course.published=true));
drop policy if exists "Learners remove own completion" on public.ascend_academy_lesson_completions;
create policy "Learners remove own completion"
 on public.ascend_academy_lesson_completions for delete to authenticated
 using(user_id=(select auth.uid()));

-- Explicit API grants, restricted by the policies above.
grant select,insert,update on public.ascend_academy_courses to authenticated;
grant select on public.ascend_academy_courses to anon;
grant select,insert,update on public.ascend_academy_lessons to authenticated;
grant select on public.ascend_academy_lessons to anon;
grant select,insert,delete on public.ascend_academy_lesson_completions to authenticated;
