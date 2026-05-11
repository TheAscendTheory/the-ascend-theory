create table if not exists public.ascend_user_trades (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  trade_date date not null,
  symbol text not null,
  direction text not null check (direction in ('Long', 'Short')),
  entry numeric not null default 0,
  exit numeric not null default 0,
  stop numeric not null default 0,
  size numeric not null default 0,
  fees numeric not null default 0,
  setup text not null default 'Unlabeled',
  notes text not null default '',
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists public.ascend_demo_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  starting_balance numeric not null default 100000,
  balance numeric not null default 100000,
  updated_at timestamptz not null default now()
);

create table if not exists public.ascend_demo_positions (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  opened_at date not null,
  symbol text not null,
  direction text not null check (direction in ('Long', 'Short')),
  entry numeric not null default 0,
  stop numeric not null default 0,
  size numeric not null default 0,
  fees numeric not null default 0,
  setup text not null default 'Practice setup',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.ascenders_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.ascend_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  handle text unique,
  avatar_url text,
  bio text not null default '',
  academy_level text not null default 'New Ascender',
  pnl_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ascend_friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ascend_friendships_unique_pair unique (requester_id, addressee_id),
  constraint ascend_friendships_not_self check (requester_id <> addressee_id)
);

create table if not exists public.ascend_conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.ascend_conversation_members (
  conversation_id uuid not null references public.ascend_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.ascend_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ascend_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ascend_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  type text not null,
  body text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ascend_social_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  visibility text not null default 'friends' check (visibility in ('public', 'friends', 'private')),
  category text,
  tags text[] not null default '{}',
  media_url text,
  media_type text check (media_type in ('photo', 'video', 'chart', 'pnl')),
  pnl_amount numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ascend_saved_posts (
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.ascend_social_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table if not exists public.ascend_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_url text,
  caption text not null default '',
  expires_at timestamptz not null default (now() + interval '24 hours'),
  kept_on_profile boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.ascend_media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  kind text not null check (kind in ('video', 'audio', 'course', 'documentary', 'podcast', 'music')),
  source text not null check (source in ('youtube', 'file')),
  source_url text not null,
  thumbnail_url text,
  access_level text not null default 'free' check (access_level in ('free', 'member', 'paid', 'exclusive')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ascend_media_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_item_id uuid references public.ascend_media_items(id) on delete cascade,
  entitlement text not null default 'purchase' check (entitlement in ('purchase', 'subscription', 'admin')),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.ascend_media_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  media_item_id uuid not null references public.ascend_media_items(id) on delete cascade,
  progress_seconds integer not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, media_item_id)
);

create table if not exists public.ascend_academy_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  stage_id text,
  course_id text,
  saved_question text,
  score integer not null default 0,
  xp_earned integer not null default 0,
  completed_at timestamptz not null default now(),
  progress_key text generated always as (coalesce(stage_id, course_id, saved_question)) stored,
  primary key (user_id, progress_key),
  constraint ascend_academy_progress_has_item check (
    stage_id is not null or course_id is not null or saved_question is not null
  )
);
