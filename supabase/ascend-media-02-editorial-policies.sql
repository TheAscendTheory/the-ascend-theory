-- Ascend Media: editorial publishing by verified Hub administrators.
-- This migration EXTENDS existing ascend_media_items. Apply after existing media tables and Hub migration.
-- Free published content is readable via the pre-existing access policy.
drop policy if exists "Ascend editorial admins read drafts" on public.ascend_media_items;
create policy "Ascend editorial admins read drafts"
 on public.ascend_media_items for select to authenticated
 using (public.is_ascend_hub_admin());
drop policy if exists "Ascend editorial admins create media" on public.ascend_media_items;
create policy "Ascend editorial admins create media"
 on public.ascend_media_items for insert to authenticated
 with check (public.is_ascend_hub_admin());
drop policy if exists "Ascend editorial admins edit media" on public.ascend_media_items;
create policy "Ascend editorial admins edit media"
 on public.ascend_media_items for update to authenticated
 using (public.is_ascend_hub_admin())
 with check (public.is_ascend_hub_admin());
drop policy if exists "Ascend editorial admins delete media" on public.ascend_media_items;
create policy "Ascend editorial admins delete media"
 on public.ascend_media_items for delete to authenticated
 using (public.is_ascend_hub_admin());
-- Existing read entitlements remain in effect.
-- Never publish paid/member media via free-content browser route.
