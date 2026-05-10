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
