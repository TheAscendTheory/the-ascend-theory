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

alter table public.ascend_user_trades enable row level security;
alter table public.ascend_demo_accounts enable row level security;
alter table public.ascend_demo_positions enable row level security;
alter table public.ascenders_waitlist enable row level security;

create policy "Users can read their trades"
  on public.ascend_user_trades for select
  using (auth.uid() = user_id);

create policy "Users can insert their trades"
  on public.ascend_user_trades for insert
  with check (auth.uid() = user_id);

create policy "Users can update their trades"
  on public.ascend_user_trades for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their trades"
  on public.ascend_user_trades for delete
  using (auth.uid() = user_id);

create policy "Users can read their demo account"
  on public.ascend_demo_accounts for select
  using (auth.uid() = user_id);

create policy "Users can upsert their demo account"
  on public.ascend_demo_accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their demo account"
  on public.ascend_demo_accounts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read their demo positions"
  on public.ascend_demo_positions for select
  using (auth.uid() = user_id);

create policy "Users can insert their demo positions"
  on public.ascend_demo_positions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their demo positions"
  on public.ascend_demo_positions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their demo positions"
  on public.ascend_demo_positions for delete
  using (auth.uid() = user_id);

create table if not exists public.ascend_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  handle text unique,
  avatar_url text,
  bio text not null default '',
  academy_level text not null default 'New Ascender',
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
  user_id uuid not null references auth.users(id) on delete cascade,
  media_item_id uuid not null references public.ascend_media_items(id) on delete cascade,
  entitlement text not null default 'purchase' check (entitlement in ('purchase', 'subscription', 'admin')),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  primary key (user_id, media_item_id)
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

alter table public.ascend_profiles enable row level security;
alter table public.ascend_friendships enable row level security;
alter table public.ascend_conversations enable row level security;
alter table public.ascend_conversation_members enable row level security;
alter table public.ascend_messages enable row level security;
alter table public.ascend_notifications enable row level security;
alter table public.ascend_social_posts enable row level security;
alter table public.ascend_saved_posts enable row level security;
alter table public.ascend_stories enable row level security;
alter table public.ascend_media_items enable row level security;
alter table public.ascend_media_entitlements enable row level security;
alter table public.ascend_media_progress enable row level security;
alter table public.ascend_academy_progress enable row level security;

create policy "Profiles are readable by signed in users"
  on public.ascend_profiles for select
  using (auth.uid() is not null);

create policy "Users can create their profile"
  on public.ascend_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their profile"
  on public.ascend_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read their friendship rows"
  on public.ascend_friendships for select
  using (auth.uid() in (requester_id, addressee_id));

create policy "Users can send friend requests"
  on public.ascend_friendships for insert
  with check (auth.uid() = requester_id);

create policy "Users can respond to friend requests"
  on public.ascend_friendships for update
  using (auth.uid() in (requester_id, addressee_id))
  with check (auth.uid() in (requester_id, addressee_id));

create policy "Users can remove their friendships"
  on public.ascend_friendships for delete
  using (auth.uid() in (requester_id, addressee_id));

create policy "Conversation members can read conversations"
  on public.ascend_conversations for select
  using (
    exists (
      select 1 from public.ascend_conversation_members members
      where members.conversation_id = id and members.user_id = auth.uid()
    )
  );

create policy "Signed in users can create conversations"
  on public.ascend_conversations for insert
  with check (auth.uid() is not null);

create policy "Conversation members can read members"
  on public.ascend_conversation_members for select
  using (auth.uid() = user_id);

create policy "Users can add themselves to conversations"
  on public.ascend_conversation_members for insert
  with check (auth.uid() = user_id);

create policy "Conversation members can read messages"
  on public.ascend_messages for select
  using (
    exists (
      select 1 from public.ascend_conversation_members members
      where members.conversation_id = conversation_id and members.user_id = auth.uid()
    )
  );

create policy "Conversation members can send messages"
  on public.ascend_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.ascend_conversation_members members
      where members.conversation_id = conversation_id and members.user_id = auth.uid()
    )
  );

create policy "Users can read their notifications"
  on public.ascend_notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their notifications"
  on public.ascend_notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Signed in users can create notifications"
  on public.ascend_notifications for insert
  with check (auth.uid() is not null);

create policy "Users can read visible posts"
  on public.ascend_social_posts for select
  using (
    visibility = 'public'
    or auth.uid() = user_id
    or (
      visibility = 'friends'
      and exists (
        select 1
        from public.ascend_friendships friendships
        where friendships.status = 'accepted'
          and (
            (friendships.requester_id = auth.uid() and friendships.addressee_id = user_id)
            or (friendships.addressee_id = auth.uid() and friendships.requester_id = user_id)
          )
      )
    )
  );

create policy "Users can create their posts"
  on public.ascend_social_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their posts"
  on public.ascend_social_posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their posts"
  on public.ascend_social_posts for delete
  using (auth.uid() = user_id);

create policy "Users can read their saved posts"
  on public.ascend_saved_posts for select
  using (auth.uid() = user_id);

create policy "Users can save posts"
  on public.ascend_saved_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave posts"
  on public.ascend_saved_posts for delete
  using (auth.uid() = user_id);

create policy "Users can read active or kept stories"
  on public.ascend_stories for select
  using (expires_at > now() or kept_on_profile = true or auth.uid() = user_id);

create policy "Users can create their stories"
  on public.ascend_stories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their stories"
  on public.ascend_stories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their stories"
  on public.ascend_stories for delete
  using (auth.uid() = user_id);

create policy "Users can read available media"
  on public.ascend_media_items for select
  using (
    published = true
    and (
      access_level = 'free'
      or (access_level = 'member' and auth.uid() is not null)
      or exists (
        select 1
        from public.ascend_media_entitlements entitlements
        where entitlements.media_item_id = id
          and entitlements.user_id = auth.uid()
          and (entitlements.expires_at is null or entitlements.expires_at > now())
      )
    )
  );

create policy "Users can read their media entitlements"
  on public.ascend_media_entitlements for select
  using (auth.uid() = user_id);

create policy "Users can read their media progress"
  on public.ascend_media_progress for select
  using (auth.uid() = user_id);

create policy "Users can save their media progress"
  on public.ascend_media_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their media progress"
  on public.ascend_media_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read their academy progress"
  on public.ascend_academy_progress for select
  using (auth.uid() = user_id);

create policy "Users can save their academy progress"
  on public.ascend_academy_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their academy progress"
  on public.ascend_academy_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.create_direct_conversation(other_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  existing_conversation_id uuid;
  new_conversation_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if other_user_id is null or other_user_id = current_user_id then
    raise exception 'A different user is required';
  end if;

  if not exists (
    select 1
    from public.ascend_friendships
    where status = 'accepted'
      and (
        (requester_id = current_user_id and addressee_id = other_user_id)
        or (requester_id = other_user_id and addressee_id = current_user_id)
      )
  ) then
    raise exception 'Users must be friends before messaging';
  end if;

  select members_a.conversation_id into existing_conversation_id
  from public.ascend_conversation_members members_a
  join public.ascend_conversation_members members_b
    on members_b.conversation_id = members_a.conversation_id
  where members_a.user_id = current_user_id
    and members_b.user_id = other_user_id
  limit 1;

  if existing_conversation_id is not null then
    return existing_conversation_id;
  end if;

  insert into public.ascend_conversations default values
  returning id into new_conversation_id;

  insert into public.ascend_conversation_members (conversation_id, user_id)
  values
    (new_conversation_id, current_user_id),
    (new_conversation_id, other_user_id);

  return new_conversation_id;
end;
$$;
