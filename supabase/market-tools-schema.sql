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

alter table public.ascend_user_trades enable row level security;
alter table public.ascend_demo_accounts enable row level security;
alter table public.ascend_demo_positions enable row level security;

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
