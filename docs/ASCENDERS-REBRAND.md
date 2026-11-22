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
