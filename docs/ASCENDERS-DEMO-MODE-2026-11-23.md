# Temporary Ascenders Demo Mode — November 23, 2026

**Explicit founder authorization:** Populate Hub, Academy and Media with acting/fictional examples so the founder can test the app experiences before launching with genuine creators, courses and community initiatives. These are temporary and must be removable.

## Separation and safety
- Database fixtures live exclusively in public.ascend_demo_fixtures (RLS: public read-only). Do **not** create fake Supabase Auth accounts, approve synthetic members, publish dummy rows to real project/event/course/media tables, or write simulated activity to real tables.
- 15 fixtures: Hub: 3 projects, 2 events, 2 fictional personas, 2 fictional portfolios; Academy: 3 courses with lesson format examples and practice quizzes; Media: 3 playable technical samples.
- All samples must be marked DEMO. The video/audio linked are externally hosted sample files and are not Ascenders original productions.
- Browser Hub demo follows, connections and RSVP are **sessionStorage-only previews**, not actual network actions.
- Academy demo grades are **sessionStorage-only**, never written to real Academy grades or memberships.
- Media sample mixed queue is browser/native playback of direct sample media URLs, not a verified lock-screen-background-audio guarantee.
- With project/user approvals still enforced, **real networking and user-owned content continue to require approved membership**. Demo Mode lets visitors practice with synthetic content and safe simulated interactions; it never bypasses RLS.
- Native code in `apps/native/src/{HubDiscover,Academy,Media}.tsx` reads these same fixture rows. APKs built **before** these commits do not contain the native Demo Mode changes and must be rebuilt. The UI remains distinct across the three apps.

## Removal procedure
1. Remove demo UI and demo-fixture queries from the three standalone browser apps and the three native app screens; deploy and verify both platforms.
2. Remove temporary fixtures from the database with:
   `truncate table public.ascend_demo_fixtures;`
3. Confirm `select count(*) from public.ascend_demo_fixtures;` returns **0**. Optionally drop the fixture table and its grants after code no longer depends on it.
4. Check no real user, project, course, release, or assessment rows were deleted. Clear local demo session storage keys `ascend_demo_marks` and `ascend_demo_actions` (the latter only in browsers where demo activity was tested).
5. Remove DEMO banners from published UI only after demo content is retired. Do not silently present test content as genuine.

## Preview URLs
- Hub: https://theascendtheory.github.io/the-ascend-theory/
- Academy: https://theascendtheory.github.io/the-ascend-theory/academy/
- Media: https://theascendtheory.github.io/the-ascend-theory/media/
