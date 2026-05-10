drop policy if exists "Users can read their trades" on public.ascend_user_trades;
create policy "Users can read their trades"
  on public.ascend_user_trades for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their trades" on public.ascend_user_trades;
create policy "Users can insert their trades"
  on public.ascend_user_trades for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their trades" on public.ascend_user_trades;
create policy "Users can update their trades"
  on public.ascend_user_trades for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their trades" on public.ascend_user_trades;
create policy "Users can delete their trades"
  on public.ascend_user_trades for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can read their demo account" on public.ascend_demo_accounts;
create policy "Users can read their demo account"
  on public.ascend_demo_accounts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can upsert their demo account" on public.ascend_demo_accounts;
create policy "Users can upsert their demo account"
  on public.ascend_demo_accounts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their demo account" on public.ascend_demo_accounts;
create policy "Users can update their demo account"
  on public.ascend_demo_accounts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their demo positions" on public.ascend_demo_positions;
create policy "Users can read their demo positions"
  on public.ascend_demo_positions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their demo positions" on public.ascend_demo_positions;
create policy "Users can insert their demo positions"
  on public.ascend_demo_positions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their demo positions" on public.ascend_demo_positions;
create policy "Users can update their demo positions"
  on public.ascend_demo_positions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their demo positions" on public.ascend_demo_positions;
create policy "Users can delete their demo positions"
  on public.ascend_demo_positions for delete
  using (auth.uid() = user_id);

drop policy if exists "Profiles are readable by signed in users" on public.ascend_profiles;
create policy "Profiles are readable by signed in users"
  on public.ascend_profiles for select
  using (auth.uid() is not null);

drop policy if exists "Users can create their profile" on public.ascend_profiles;
create policy "Users can create their profile"
  on public.ascend_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their profile" on public.ascend_profiles;
create policy "Users can update their profile"
  on public.ascend_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their friendship rows" on public.ascend_friendships;
create policy "Users can read their friendship rows"
  on public.ascend_friendships for select
  using (auth.uid() in (requester_id, addressee_id));

drop policy if exists "Users can send friend requests" on public.ascend_friendships;
create policy "Users can send friend requests"
  on public.ascend_friendships for insert
  with check (auth.uid() = requester_id);

drop policy if exists "Users can respond to friend requests" on public.ascend_friendships;
create policy "Users can respond to friend requests"
  on public.ascend_friendships for update
  using (auth.uid() in (requester_id, addressee_id))
  with check (auth.uid() in (requester_id, addressee_id));

drop policy if exists "Users can remove their friendships" on public.ascend_friendships;
create policy "Users can remove their friendships"
  on public.ascend_friendships for delete
  using (auth.uid() in (requester_id, addressee_id));

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

drop policy if exists "Users can read visible posts" on public.ascend_social_posts;
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

drop policy if exists "Users can create their posts" on public.ascend_social_posts;
create policy "Users can create their posts"
  on public.ascend_social_posts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their posts" on public.ascend_social_posts;
create policy "Users can update their posts"
  on public.ascend_social_posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their posts" on public.ascend_social_posts;
create policy "Users can delete their posts"
  on public.ascend_social_posts for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can read their saved posts" on public.ascend_saved_posts;
create policy "Users can read their saved posts"
  on public.ascend_saved_posts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can save posts" on public.ascend_saved_posts;
create policy "Users can save posts"
  on public.ascend_saved_posts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can unsave posts" on public.ascend_saved_posts;
create policy "Users can unsave posts"
  on public.ascend_saved_posts for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can read active or kept stories" on public.ascend_stories;
create policy "Users can read active or kept stories"
  on public.ascend_stories for select
  using (expires_at > now() or kept_on_profile = true or auth.uid() = user_id);

drop policy if exists "Users can create their stories" on public.ascend_stories;
create policy "Users can create their stories"
  on public.ascend_stories for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their stories" on public.ascend_stories;
create policy "Users can update their stories"
  on public.ascend_stories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their stories" on public.ascend_stories;
create policy "Users can delete their stories"
  on public.ascend_stories for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can read available media" on public.ascend_media_items;
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
        where entitlements.user_id = auth.uid()
          and (entitlements.media_item_id = id or entitlements.entitlement in ('subscription', 'admin'))
          and (entitlements.expires_at is null or entitlements.expires_at > now())
      )
    )
  );

drop policy if exists "Users can read their media entitlements" on public.ascend_media_entitlements;
create policy "Users can read their media entitlements"
  on public.ascend_media_entitlements for select
  using (auth.uid() = user_id);

drop policy if exists "Users can read their media progress" on public.ascend_media_progress;
create policy "Users can read their media progress"
  on public.ascend_media_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Users can save their media progress" on public.ascend_media_progress;
create policy "Users can save their media progress"
  on public.ascend_media_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their media progress" on public.ascend_media_progress;
create policy "Users can update their media progress"
  on public.ascend_media_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their academy progress" on public.ascend_academy_progress;
create policy "Users can read their academy progress"
  on public.ascend_academy_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Users can save their academy progress" on public.ascend_academy_progress;
create policy "Users can save their academy progress"
  on public.ascend_academy_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their academy progress" on public.ascend_academy_progress;
create policy "Users can update their academy progress"
  on public.ascend_academy_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
