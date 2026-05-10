drop policy if exists "Conversation members can read conversations" on public.ascend_conversations;
create policy "Conversation members can read conversations"
  on public.ascend_conversations for select
  using (
    exists (
      select 1 from public.ascend_conversation_members members
      where members.conversation_id = id and members.user_id = auth.uid()
    )
  );

drop policy if exists "Signed in users can create conversations" on public.ascend_conversations;
create policy "Signed in users can create conversations"
  on public.ascend_conversations for insert
  with check (auth.uid() is not null);

drop policy if exists "Conversation members can read members" on public.ascend_conversation_members;
create policy "Conversation members can read members"
  on public.ascend_conversation_members for select
  using (auth.uid() = user_id);

drop policy if exists "Users can add themselves to conversations" on public.ascend_conversation_members;
create policy "Users can add themselves to conversations"
  on public.ascend_conversation_members for insert
  with check (auth.uid() = user_id);

drop policy if exists "Conversation members can read messages" on public.ascend_messages;
create policy "Conversation members can read messages"
  on public.ascend_messages for select
  using (
    exists (
      select 1 from public.ascend_conversation_members members
      where members.conversation_id = conversation_id and members.user_id = auth.uid()
    )
  );

drop policy if exists "Conversation members can send messages" on public.ascend_messages;
create policy "Conversation members can send messages"
  on public.ascend_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.ascend_conversation_members members
      where members.conversation_id = conversation_id and members.user_id = auth.uid()
    )
  );

drop policy if exists "Users can read their notifications" on public.ascend_notifications;
create policy "Users can read their notifications"
  on public.ascend_notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update their notifications" on public.ascend_notifications;
create policy "Users can update their notifications"
  on public.ascend_notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Signed in users can create notifications" on public.ascend_notifications;
create policy "Signed in users can create notifications"
  on public.ascend_notifications for insert
  with check (auth.uid() is not null);
