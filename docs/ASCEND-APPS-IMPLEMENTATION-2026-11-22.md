# Ascend Apps — implementation handoff and release gates
Date: 2026-11-22
Status: Development branch. Not a completed public/mobile app release.

## Confirmed brand and design direction
- The Ascenders Club is the organization/community; people are Ascenders.
- Ascend Hub, Ascend Academy and Ascend Media are the three current apps. "Ascend" is expandable to future initiatives, but no additional apps are currently authorized.
- Approved visual direction: white backgrounds, black optical/sacred geometry, restrained green accents, cinematic transitions.
- The public website's design is approved. No further homepage redesign is part of this branch.

## Repository audit
- Existing Next.js 16 web platform, Supabase browser client, account/email OTP flow, Supabase social tables, existing Academy lesson and progression system.
- Public Hub page at the previous release was descriptive only.
- Academy previously linked to finance/trading lessons at /learn.
- Media has a descriptive page and pre-existing database media-item tables but no current publishing experience.
- No Expo/React Native/Xcode/Android native app project or store listing was found in the inspected repository.

## This branch: Ascend Hub foundation
Files:
- src/app/hub/HubClient.tsx, hub.css, page.tsx
- src/app/hub/admin/HubAdminClient.tsx, admin.css, page.tsx
- supabase/ascend-hub-01-membership-projects.sql

The implemented Hub UI provides:
1. Email OTP sign-in through the existing Supabase client (subject to auth configuration).
2. Member application with pending / approved / declined states.
3. Approved-member-only searchable project and people directory, filter by discipline.
4. Project submission for moderator approval.
5. Map preview of projects WITH verified member-supplied coordinates using OpenStreetMap. It is not yet a multi-pin global map.
6. Admin moderation page at /hub/admin (row-level security checks determine privileges).
7. Privacy: public browser reads of approved directory are restricted to approved members; members cannot approve themselves via API/RLS.

IMPORTANT: The SQL schema is written but NOT applied. No Supabase connector with schema execution is available through this integration. Unless a privileged operator runs the SQL and seeds one verified administrator UID, the Hub does not work end-to-end. It displays a setup-unavailable message rather than simulating success.
- The social module is legacy trading-focused; do not claim it is the new Ascend Hub.
- Authentication email redirect /hub must be on the Supabase allowlist, alongside production and previews as appropriate.
- Define first admin explicitly via the guarded INSERT example at the bottom of the SQL file.
- Verify all RLS policies, profile privacy and content moderation with at least two distinct test users before production release.

## Academy decision update
- Old finance/trading curriculum retired from public route. /learn redirects to /academy.
- Academy public copy now describes a forthcoming interdisciplinary platform, without resurrecting the old financial lessons.
- KEEP existing rank artwork under public/ranks and rank-system logic for conceptual reference only. Old AcademyExperience and both curriculum files were deleted from this development branch; Git commit history retains recoverable source. The rank-system was decoupled from the old lessons and now retains static tiers and icon references. No historical content is served through /learn.
- Do not infer the new Academy syllabus. User will determine revised content and philosophy.

## Media
- Current Media page remains an informational entry point, not a published media streaming platform.
- Existing ascend_media_items database, media playback context and access-level policies can be reused, but require a new content creation, moderation and publishing workflow.

## Production / app-store requirements
- Web application and native mobile apps are different deliverables. No Apple App Store or Google Play upload can happen through the existing GitHub connector alone.
- Native iOS/Android: platform project, user-owned Apple Developer / Google Play accounts, app signing, build automation, deep links, safety/privacy policies, store assets and review.
- Before claiming any platform live, verify deployment, database migrations, sign-in, membership review and production acceptance testing. Do not advertise the three as fully operational while they remain under construction.

## Release checklist
[ ] Check type/build previews in Vercel for this branch
[ ] Verify Supabase production table/RLS migration deployment
[ ] Seed a named first administrator
[ ] Configure OTP email redirect domain
[ ] Complete user acceptance test (two user accounts, administrator)
[ ] Test member approval, project approval, public access denial, filter and map
[ ] Review abuse/reporting/privacy and moderation safety
[ ] Publish Hub to production only after end-to-end QA
[ ] Create Academy content model and new syllabus
[ ] Build Media CMS and accessible library
[ ] Create iOS/Android app code and submit to stores separately

## Expanded implementation / release status (Nov 22)
Three web apps now have functional source implementations behind existing app routes. The initial Hub and Academy entries are not the only code: Hub user applications/directories/review/report/block, Academy interdisciplinary course catalogue/reader/editor/progress, and Media published catalogue/player/editor have been committed. No sample courses, projects or films have been invented.

Three Expo-native product variants also exist under apps/native for iOS and Android (Hub, Academy, Media), each with distinct product IDs. Source supports OTP-code sign-in, native Hub projects and collaboration, Academy reading/progress, Media catalogue/playback, and account deletion. GitHub Actions CI independently validates Expo dependencies, TypeScript, and iOS/Android JavaScript bundles; those are not signed device builds, app-store submissions, or installed applications.

Additional database SQL:
- supabase/ascend-hub-04-moderation-and-blocks.sql for UGC reports and blocks
- supabase/ascend-academy-03-course-platform.sql for courses, lessons, and learner progress
- supabase/ascend-media-02-editorial-policies.sql for restricted publishing
Apply after supabase/ascend-hub-01-membership-projects.sql, respecting dependencies and existing production schema.

Privacy policy, community participation terms, account deletion endpoint, account settings, moderation review UI and web-app manifest have been added on this branch. They require real configuration and testing.

**NOT READY TO CLAIM LIVE YET:**
1. Supabase connector is not installed/connected, so no verified migration, permissions, administrator account, OTP email template, row-level policy acceptance testing or account deletion key deployment. Never expose service-role keys in client builds.
2. Vercel rate-limit has prevented preview deployments for this PR; GitHub Actions CI runs independently, and its current result must be checked for the latest commit.
3. Expo native JS bundle success does not equal a signed iOS/Android binary; store developer accounts, EAS project, app icons/assets, screenshots, privacy/deletion verification, and Apple/Google review remain.
4. New Academy syllabus and actual content are founder/team decisions; rights-cleared filmed Media productions and real Hub members/projects must be supplied/approved. Blank catalogue is not evidence of a populated usable learning/media platform.
5. The old Academy course files were deleted from this branch. Rank images and decoupled tier reference logic remain. /learn redirects to /academy.
6. The visual direction on main stays white canvas, black sacred geometry and restrained green; do not merge unverified backend without testing.

Test with anonymous/pending/approved/admin accounts, SQL RLS checks, moderator review, completion syncing, media publishing and account deletion in a safe test environment before promoting the branch.
