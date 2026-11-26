-- Public portfolio/profile pictures deliberately opt-in and image-only.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('ascend-public-profile-images','ascend-public-profile-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
-- Files must be stored under their authenticated owner's UUID path.
drop policy if exists "Ascend profile owner uploads image" on storage.objects;
create policy "Ascend profile owner uploads image" on storage.objects
 for insert to authenticated with check(
 bucket_id='ascend-public-profile-images' and (storage.foldername(name))[1]=(select auth.uid())::text
 and public.is_ascend_hub_approved()
 );
drop policy if exists "Ascend profile owner deletes image" on storage.objects;
create policy "Ascend profile owner deletes image" on storage.objects
 for delete to authenticated using(
 bucket_id='ascend-public-profile-images' and (storage.foldername(name))[1]=(select auth.uid())::text
 );
drop policy if exists "Ascend profile owner lists images" on storage.objects;
create policy "Ascend profile owner lists images" on storage.objects
 for select to authenticated using(
 bucket_id='ascend-public-profile-images' and (storage.foldername(name))[1]=(select auth.uid())::text
 );