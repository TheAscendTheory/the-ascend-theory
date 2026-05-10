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
