# Ascenders Club website rebrand — 2026-11-22

## Approved direction
The Ascenders Club is a broad international changemaker collective. The active product ecosystem consists of three platforms: Ascend Hub (first), Ascend Academy, and Ascend Media. The old nine-pillar site architecture is superseded. Do not equate the Club solely with environmental work.

## Changes
- Replaced marketing homepage, public-facing shell/navigation, footer, About, Contact and Media.
- Added Hub and Academy introductory routes; retained previous Academy curriculum under /learn and other legacy code untouched.
- Added responsive scoped CSS and updated root organization metadata, sitemap and robots to the new domain.
- Preserved original Supabase schema, social features and routes for migration assessment.

## Remaining verification
- Run npm ci, npm run lint and npm run build; check Vercel preview before merging.
- Audit legacy pages, privacy/disclaimer, SEO and old-domain references.
- Logo is a provisional text/shape mark until approved vector assets are integrated.
- Hub directory/map, membership approvals, Academy migration and Media CMS are not implemented yet.
- New domain email: contact@theascendersclub.com; Fourthwall storefront: shop.theascendersclub.com.
- Do not merge or deploy to production without preview QA.

## Brand architecture decision (2026-11-22)
- **Ascend** is the extensible product and initiative naming family, distinct from legal ownership structures.
- **The Ascenders Club** is the public-facing collective and community; its members are **Ascenders**.
- The three active platforms are named **Ascend Hub**, **Ascend Academy**, and **Ascend Media**. Future ventures may use Ascend naming but are not currently active product commitments.
- Preserve theascendersclub.com as the primary public domain. Do not rename the organization to Ascend.
- This update supersedes the earlier plural-platform naming in the original development plan.

## Creative direction correction — 2026-11-22
- Founder explicitly rejected the generic initial redesign and Unicode symbols used as interface decoration.
- Preserve and extend the creative identity of the original black-and-gold website: sacred geometry, layered optical illusion, colour manipulation and cinematic interactions.
- Interactive visual language must extend throughout: page-to-page transitions, button feedback, hover/focus states and slide transitions; not just a decorative hero background.
- Current visual-restoration PR adds concentric and intersecting-circle SVG art, orbital motion, subtle chromatic gradients, dimensional responsive cards, Lucide interface icons, page transitions and a three-scene interactive optical sequence with swipe/tap controls.
- Reduced-motion preferences are supported; no flashing/strobing effects.
- This is a new draft design iteration, NOT an approved final direction or a production launch. Review actual mobile and desktop previews before merge.

## Colour variation — 2026-11-22
Founder approved the restored geometry and interactions, requested another published colour variation: absolute black backgrounds, dominant luminous white, and small green accents. Preserve sacred geometry, interactive optical sequences, motion, transitions, and proper UI icons. Implemented as a final scoped stylesheet `ascenders-monochrome.css` loaded after `ascenders-art.css` and `optical-interactions.css`, avoiding invasive rewrites. Review legibility, visual contrast, mobile breakpoints, and rendered scenes. This is a colour experiment, not a commitment to replace the geometric design language.
