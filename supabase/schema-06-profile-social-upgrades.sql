alter table public.ascend_profiles
  add column if not exists pnl_public boolean not null default false;

alter table public.ascend_social_posts
  add column if not exists category text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists media_url text,
  add column if not exists media_type text,
  add column if not exists pnl_amount numeric;

alter table public.ascend_social_posts
  drop constraint if exists ascend_social_posts_media_type_check;

alter table public.ascend_social_posts
  add constraint ascend_social_posts_media_type_check
  check (media_type is null or media_type in ('photo', 'video', 'chart', 'pnl'));

create index if not exists ascend_social_posts_category_idx
  on public.ascend_social_posts (category);

create index if not exists ascend_social_posts_tags_idx
  on public.ascend_social_posts using gin (tags);
