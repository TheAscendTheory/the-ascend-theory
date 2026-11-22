# Ascenders Club website rebrand — 2026-11-22

## Approved direction
The Ascenders Club is a broad international changemaker collective. The active product ecosystem consists of three platforms: Ascenders Hub (first), Ascenders Academy, and Ascenders Media. The old nine-pillar site architecture is superseded. Do not equate the Club solely with environmental work.

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
