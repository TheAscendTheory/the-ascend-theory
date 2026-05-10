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
