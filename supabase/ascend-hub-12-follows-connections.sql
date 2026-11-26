-- Ascend Hub member-to-member following and consent-based connection requests.
create table if not exists public.ascend_hub_follows (
 follower_id uuid not null references auth.users(id) on delete cascade,
 followed_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(follower_id,followed_id),
 constraint no_self_follow check(follower_id<>followed_id)
);
create table if not exists public.ascend_hub_connection_requests (
 id uuid primary key default gen_random_uuid(),
 requester_id uuid not null references auth.users(id) on delete cascade,
 recipient_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','accepted','declined','cancelled')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint no_self_connection check(requester_id<>recipient_id),
 unique(requester_id,recipient_id)
);
create index if not exists hub_connection_recipient_idx on public.ascend_hub_connection_requests(recipient_id,status);
alter table public.ascend_hub_follows enable row level security;
alter table public.ascend_hub_connection_requests enable row level security;
create policy "Participants view following" on public.ascend_hub_follows
 for select to authenticated using(follower_id=(select auth.uid()) or followed_id=(select auth.uid()));
create policy "Approved member follow" on public.ascend_hub_follows
 for insert to authenticated with check(follower_id=(select auth.uid()) and public.is_ascend_hub_approved() and
 followed_id<>follower_id and exists(select 1 from public.ascend_hub_members m where m.user_id=followed_id and m.status='approved'));
create policy "Unfollow own" on public.ascend_hub_follows
 for delete to authenticated using(follower_id=(select auth.uid()));
create policy "Connection participants read" on public.ascend_hub_connection_requests
 for select to authenticated using(requester_id=(select auth.uid()) or recipient_id=(select auth.uid()));
create policy "Approved members request connection" on public.ascend_hub_connection_requests
 for insert to authenticated with check(requester_id=(select auth.uid()) and status='pending'
 and public.is_ascend_hub_approved() and exists(select 1 from public.ascend_hub_members m where m.user_id=recipient_id and m.status='approved'));
grant select,insert,delete on public.ascend_hub_follows to authenticated;
grant select,insert on public.ascend_hub_connection_requests to authenticated;
-- Changes to request status are performed by restricted RPCs, never directly by clients.
create or replace function public.respond_to_ascend_connection(p_request_id uuid,p_accept boolean)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Sign-in required';end if;
 update public.ascend_hub_connection_requests
 set status=case when p_accept then 'accepted' else 'declined' end, updated_at=now()
 where id=p_request_id and recipient_id=auth.uid() and status='pending';
 return found;
end;$$;
revoke all on function public.respond_to_ascend_connection(uuid,boolean) from public,anon;
grant execute on function public.respond_to_ascend_connection(uuid,boolean) to authenticated;
create or replace function public.cancel_ascend_connection(p_request_id uuid)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Sign-in required';end if;
 update public.ascend_hub_connection_requests set status='cancelled',updated_at=now()
 where id=p_request_id and requester_id=auth.uid() and status='pending';
 return found;
end;$$;
revoke all on function public.cancel_ascend_connection(uuid) from public,anon;
grant execute on function public.cancel_ascend_connection(uuid) to authenticated;
