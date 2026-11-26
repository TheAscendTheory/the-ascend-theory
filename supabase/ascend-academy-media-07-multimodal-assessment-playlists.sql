-- Ascenders learning formats, no-penalty assessments and mixed-media editorial queues.
-- Existing Academy and Media releases remain unchanged.
create table if not exists public.ascend_academy_lesson_formats (
 id uuid primary key default gen_random_uuid(),
 lesson_id uuid not null references public.ascend_academy_lessons(id) on delete cascade,
 format text not null check(format in ('passage','video','audio','interactive')),
 title text not null default '',
 body text not null default '',
 source_url text not null default '',
 sort_order integer not null default 0,
 published boolean not null default false,
 unique(lesson_id,format,sort_order)
);
create index if not exists academy_lesson_formats_lookup on public.ascend_academy_lesson_formats(lesson_id,published,sort_order);
alter table public.ascend_academy_lesson_formats enable row level security;
create policy "Academy read public formats" on public.ascend_academy_lesson_formats
 for select to anon using (published and exists (
 select 1 from public.ascend_academy_lessons l join public.ascend_academy_courses c on c.id=l.course_id
 where l.id=lesson_id and l.published and c.published));
create policy "Academy members read public or editorial formats" on public.ascend_academy_lesson_formats
 for select to authenticated using(public.is_ascend_hub_admin() or
 (published and exists(select 1 from public.ascend_academy_lessons l join public.ascend_academy_courses c on c.id=l.course_id
 where l.id=lesson_id and l.published and c.published)));
create policy "Academy admins insert formats" on public.ascend_academy_lesson_formats
 for insert to authenticated with check(public.is_ascend_hub_admin());
create policy "Academy admins edit formats" on public.ascend_academy_lesson_formats
 for update to authenticated using(public.is_ascend_hub_admin()) with check(public.is_ascend_hub_admin());
create policy "Academy admins delete formats" on public.ascend_academy_lesson_formats
 for delete to authenticated using(public.is_ascend_hub_admin());
grant select on public.ascend_academy_lesson_formats to anon;
grant select,insert,update,delete on public.ascend_academy_lesson_formats to authenticated;

create table if not exists public.ascend_academy_learning_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 preferred_format text not null default 'passage' check(preferred_format in ('passage','video','audio','interactive')),
 updated_at timestamptz not null default now()
);
alter table public.ascend_academy_learning_preferences enable row level security;
create policy "Learners read preferences" on public.ascend_academy_learning_preferences for select to authenticated using(user_id=(select auth.uid()));
create policy "Learners set preferences" on public.ascend_academy_learning_preferences for insert to authenticated with check(user_id=(select auth.uid()));
create policy "Learners update preferences" on public.ascend_academy_learning_preferences for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
grant select,insert,update on public.ascend_academy_learning_preferences to authenticated;

create table if not exists public.ascend_academy_assessments (
 id uuid primary key default gen_random_uuid(),
 course_id uuid not null references public.ascend_academy_courses(id) on delete cascade,
 title text not null check(char_length(title) between 3 and 160),
 passing_percent integer not null default 60 check(passing_percent between 0 and 100),
 published boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.ascend_academy_assessment_questions (
 id uuid primary key default gen_random_uuid(),
 assessment_id uuid not null references public.ascend_academy_assessments(id) on delete cascade,
 prompt text not null check(char_length(prompt) between 5 and 1500),
 choices jsonb not null check(jsonb_typeof(choices)='array' and jsonb_array_length(choices) between 2 and 6),
 sequence integer not null default 0,
 unique(assessment_id,sequence)
);
-- Correct answers are never included in public JSON or exposed API tables.
create schema if not exists ascend_private;
revoke all on schema ascend_private from public,anon,authenticated;
create table if not exists ascend_private.academy_answer_keys (
 question_id uuid primary key references public.ascend_academy_assessment_questions(id) on delete cascade,
 correct_index integer not null check(correct_index between 0 and 5)
);
revoke all on ascend_private.academy_answer_keys from public,anon,authenticated;

create table if not exists public.ascend_academy_assessment_attempts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 assessment_id uuid not null references public.ascend_academy_assessments(id) on delete cascade,
 correct_count integer not null,
 question_count integer not null,
 score_percent integer not null check(score_percent between 0 and 100),
 passed boolean not null,
 submitted_at timestamptz not null default now()
);
create index if not exists assessment_attempt_lookup on public.ascend_academy_assessment_attempts(user_id,assessment_id,submitted_at desc);
alter table public.ascend_academy_assessments enable row level security;
alter table public.ascend_academy_assessment_questions enable row level security;
alter table public.ascend_academy_assessment_attempts enable row level security;
create policy "Public published assessments" on public.ascend_academy_assessments
 for select to anon using (published and exists(select 1 from public.ascend_academy_courses c where c.id=course_id and c.published));
create policy "Members published or editorial assessments" on public.ascend_academy_assessments
 for select to authenticated using(public.is_ascend_hub_admin() or (published and exists(select 1 from public.ascend_academy_courses c where c.id=course_id and c.published)));
create policy "Admins write assessments" on public.ascend_academy_assessments
 for all to authenticated using(public.is_ascend_hub_admin()) with check(public.is_ascend_hub_admin());
create policy "Public assessment questions" on public.ascend_academy_assessment_questions
 for select to anon using(exists(select 1 from public.ascend_academy_assessments a join public.ascend_academy_courses c on c.id=a.course_id where a.id=assessment_id and a.published and c.published));
create policy "Members assessment questions" on public.ascend_academy_assessment_questions
 for select to authenticated using(public.is_ascend_hub_admin() or exists(select 1 from public.ascend_academy_assessments a join public.ascend_academy_courses c on c.id=a.course_id where a.id=assessment_id and a.published and c.published));
create policy "Admins write assessment questions" on public.ascend_academy_assessment_questions
 for all to authenticated using(public.is_ascend_hub_admin()) with check(public.is_ascend_hub_admin());
create policy "Learner sees own marks" on public.ascend_academy_assessment_attempts
 for select to authenticated using(user_id=(select auth.uid()));
grant select on public.ascend_academy_assessments,public.ascend_academy_assessment_questions to anon;
grant select,insert,update,delete on public.ascend_academy_assessments,public.ascend_academy_assessment_questions to authenticated;
grant select on public.ascend_academy_assessment_attempts to authenticated;

create or replace function public.submit_ascend_academy_assessment(p_assessment_id uuid,p_answers jsonb)
returns table(correct_count integer,question_count integer,score_percent integer,passed boolean)
language plpgsql security definer set search_path='' as $$
declare
 v_user uuid:=auth.uid();
 v_passing integer;
 v_total integer;
 v_correct integer;
 v_score integer;
begin
 if v_user is null then raise exception 'Sign in to submit an assessment'; end if;
 if p_answers is null or jsonb_typeof(p_answers)<>'object' then raise exception 'Answers must be an object'; end if;
 select a.passing_percent into v_passing from public.ascend_academy_assessments a
 join public.ascend_academy_courses c on c.id=a.course_id
 where a.id=p_assessment_id and a.published and c.published;
 if not found then raise exception 'Assessment not available';end if;
 select count(*)::integer,
 count(*) filter (where k.correct_index is not null and
 p_answers ? q.id::text and
 p_answers->>q.id::text = k.correct_index::text)::integer
 into v_total,v_correct
 from public.ascend_academy_assessment_questions q
 left join ascend_private.academy_answer_keys k on k.question_id=q.id
 where q.assessment_id=p_assessment_id;
 if v_total=0 then raise exception 'Assessment has no questions';end if;
 if exists(select 1 from public.ascend_academy_assessment_questions q
 left join ascend_private.academy_answer_keys k on k.question_id=q.id
 where q.assessment_id=p_assessment_id and (k.question_id is null or k.correct_index>=jsonb_array_length(q.choices)))
 then raise exception 'Assessment answer key incomplete';end if;
 v_score:=round(v_correct*100.0/v_total)::integer;
 insert into public.ascend_academy_assessment_attempts(user_id,assessment_id,correct_count,question_count,score_percent,passed)
 values(v_user,p_assessment_id,v_correct,v_total,v_score,v_score>=v_passing);
 return query select v_correct,v_total,v_score,(v_score>=v_passing);
end;$$;
revoke all on function public.submit_ascend_academy_assessment(uuid,jsonb) from public,anon;
grant execute on function public.submit_ascend_academy_assessment(uuid,jsonb) to authenticated;

create table if not exists public.ascend_media_playlists (
 id uuid primary key default gen_random_uuid(),
 title text not null check(char_length(title) between 3 and 160),
 description text not null default '',
 thumbnail_url text,
 published boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.ascend_media_playlist_entries (
 id uuid primary key default gen_random_uuid(),
 playlist_id uuid not null references public.ascend_media_playlists(id) on delete cascade,
 media_id uuid not null references public.ascend_media_items(id) on delete cascade,
 sequence integer not null check(sequence>=0),
 unique(playlist_id,sequence),
 unique(playlist_id,media_id)
);
create index if not exists media_playlist_entry_sequence on public.ascend_media_playlist_entries(playlist_id,sequence);
alter table public.ascend_media_playlists enable row level security;
alter table public.ascend_media_playlist_entries enable row level security;
create policy "Public editorial playlists" on public.ascend_media_playlists
 for select to anon,authenticated using(published);
create policy "Media admins manage playlists" on public.ascend_media_playlists
 for all to authenticated using(public.is_ascend_hub_admin()) with check(public.is_ascend_hub_admin());
create policy "Public eligible playlist entries" on public.ascend_media_playlist_entries
 for select to anon,authenticated using(exists(select 1 from public.ascend_media_playlists p where p.id=playlist_id and p.published)
 and exists(select 1 from public.ascend_media_items m where m.id=media_id and m.published and m.access_level='free'));
create policy "Media admins manage playlist entries" on public.ascend_media_playlist_entries
 for all to authenticated using(public.is_ascend_hub_admin()) with check(public.is_ascend_hub_admin());
grant select on public.ascend_media_playlists,public.ascend_media_playlist_entries to anon;
grant select,insert,update,delete on public.ascend_media_playlists,public.ascend_media_playlist_entries to authenticated;

create table if not exists public.ascend_media_listening_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 media_id uuid not null references public.ascend_media_items(id) on delete cascade,
 position_seconds integer not null default 0 check(position_seconds>=0),
 updated_at timestamptz not null default now(),
 primary key(user_id,media_id)
);
alter table public.ascend_media_listening_progress enable row level security;
create policy "Listeners own progress" on public.ascend_media_listening_progress
 for select to authenticated using(user_id=(select auth.uid()));
create policy "Listeners create progress" on public.ascend_media_listening_progress
 for insert to authenticated with check(user_id=(select auth.uid()));
create policy "Listeners update progress" on public.ascend_media_listening_progress
 for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
grant select,insert,update on public.ascend_media_listening_progress to authenticated;
