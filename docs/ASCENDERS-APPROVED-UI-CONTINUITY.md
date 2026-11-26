# Ascenders — approved UI decisions and continuation record

Updated: 2026-11-24. Source: founder's screenshots of prior development conversation, plus current GitHub file inspection.

## Non-negotiable product scope
- Three active products only: Ascenders Hub, Ascenders Academy, Ascenders Media, with The Ascenders Club as the parent brand.
- Preserve existing work. Do not replace functioning app experiences with unrelated static demos, simplified placeholders, or generic templates.

## Explicitly approved visual changes
### Academy
- **Keep the approved layout as is.**
- Do not change its classroom / MasterClass-like composition, learning navigation or interactive experience as part of Hub/Media work.

### Media
- **Keep the existing streaming layout, shelves, player, navigation and interactions.**
- Change the blue/cyan tint only.
- Approved replacement palette: deep charcoal backgrounds; muted olive-green atmospheric depth; soft champagne/brass accents and active controls; warm off-white text.
- This is a palette correction, not a structural redesign. Do not make Media look identical to Academy.

### Hub
- **Full composition/layout redesign, not just recolouring.**
- Center the working interactive global map; intentional navigation rail and visual hierarchy; strong symmetry and sacred geometry; spatial discovery rather than stacked admin/directory cards; refined controls and horizontal event cards on mobile.
- **Retain** functional map, geographically accurate pins, colour-coded categories and legend, filters, member profiles, projects and events. Ensure a real pin in New Jersey appears for a real qualifying New Jersey event (or label examples unambiguously).
- Public map/discovery is independent of unavailable membership database; privileged actions still require appropriate authentication/approval.
- Do not claim fixtures/simulated actions are real members, events, opportunities or playback.

## Historical implementation assertions vs verified repository
Prior chat claimed Media's colour change was committed and Hub's major makeover was implemented in the development branch. These claims are **not sufficient verification** by themselves.
Inspection of `ascend-hub-functional-foundation` on 2026-11-24 found:
- `src/app/hub/page.tsx` renders `PublicHub.tsx`; `PublicHub.tsx` is an independent public map with sample location fixtures.
- `src/app/hub/members/page.tsx` still exposes the older gated `HubClient`.
- `src/app/media/MediaLibrary.tsx` imports `media-app.css`; inspected styling begins with a white layout and pale-green cover, not the asserted charcoal palette.
- Academy remains served by `AcademyCatalog.tsx` on this branch.
- Earlier live screenshots showed the old Hub Supabase setup error and must **not** be presented as a successful new preview.
- A READY Vercel deployment for commit `1e595b48` is not proof of later commits or functionality; verify exact SHA and browser output before declaring success.
- Separate ad-hoc `gh-pages` and `feat/ascenders-hub-map-experience` branches created in a later chat are **not** authoritative replacements for the development app.

## Release and preview gate
1. Reconcile the actual application branch and preserve approved Academy/Media compositions.
2. Implement the Hub's approved full spatial redesign in the existing app without dropping core features.
3. Apply only Media colour adjustments.
4. Run build, functionality and mobile checks. Fix any failure.
5. Deploy exact commit as preview and verify homepage + Hub + Academy + Media URLs directly before presenting to founder for approval.
6. Do not promote to production until expressly approved.
7. Record commit SHA, deployment ID, URL, tested routes and outstanding blockers.

## Avoid
- No faux screenshots, substitute chat prototypes, generic four-screen samples, or unverifiable GitHub Pages links presented as the actual application.
- No claims of completed or live work without code, build and deployment evidence.
- No unrequested rebranding, new pillars or wholesale rewrites of Academy/Media.

## Founder direction — 2026-11-25
- Founder explicitly praised the current Academy and Media layouts. Preserve both as the visual benchmark, without cloning their screens.
- Main site and Hub should follow their cinematic design quality. Improve Hub map and add Businesses to its legend and category filter.
- Implemented on authoritative branch: standalone Hub map controls and stable legend (1cdccee), map-first composition and Business category (5a98988); public Next.js Hub Business example, click-to-filter legend, pointer/keyboard panning (5b5235b), map-first styling (a8339c1); homepage cinematic geometry and distinct product gateways (5b464ce).
- Business example in Next.js public preview is explicitly fictional. Standalone Hub supports the Business category but permanent real-business listing schema and moderation are not yet implemented. No claims of actual businesses until verified.
- Academy and Media files untouched in this change set. Build, deployment and mobile verification pending; do not call these changes live before verification.


## Approved trademark system — 2026-11-25
- Founder approved a single unchanged original Ascenders mark plus uppercase HUB, ACADEMY or MEDIA underneath. No alternate geometry or secondary symbols.
- Original raster source remains unchanged: public/logo.PNG (blob 422ba07b88af837237e3234034356b64f52e34da). Icon masks are resampled directly from that original, not redrawn. White on solid black 1024x1024 opaque RGB store icons; transparent adaptive Android foregrounds; small transparent header lockups. Wordmarks are separate typography beneath the trademark.
- Applied web favicon/touch icons and header lockups, native Expo icon/adaptive icon configuration, and native header mark. Existing labels, copy, navigation, app content, layouts and behavior are otherwise retained.
- Authoritative project for live theascendersclub.com is Vercel project prj_dhM20t5bbVkGYtG9JE3KvD5kg78L. Hub, Academy and Media branded subdomains were each verified HTTP 200 before this branding change. Namecheap CNAMEs are correct. Vercel daily limit prevented the last navigation-only production deployment; do not claim this new branding is live until verified at actual branded hostnames.
- Android APK workflow triggers on the approved native assets and config changes. APKs are internal testing, not Play Store releases. Signed iOS/Android cloud builds still require configured Expo projects and credentials; actual installation and device testing outstanding.
