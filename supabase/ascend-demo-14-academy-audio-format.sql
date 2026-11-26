-- Add a technical audio sample to the fictional Academy format switcher.
-- External sample audio is not an actual instructional recording.
update public.ascend_demo_fixtures
set payload=jsonb_set(payload,'{lessons,0,formats}',
 (payload#>'{lessons,0,formats}') ||
 jsonb_build_array(jsonb_build_object(
  'format','audio',
  'title','Listen: Audio player demonstration',
  'body','DEMO AUDIO — Audio playback test only. Not a real lecture or Ascenders production.',
  'source_url','https://www.w3schools.com/html/horse.mp3'
 )))
where kind='academy_course' and fixture_id='demo-c1';
