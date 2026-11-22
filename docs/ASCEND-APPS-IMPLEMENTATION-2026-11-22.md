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
- KEEP existing rank artwork under public/ranks and rank-system logic for conceptual reference only. Old lesson files are kept in source control for safe extraction until remaining imports are audited; they are not served through /learn.
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
