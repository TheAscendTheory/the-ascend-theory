# Ascenders three-product UX separation — November 23, 2026

## Founder feedback
The initial standalone demos felt like three copies of a generic website. Academy did not feel like a premium learning application; Media player resembled an ordinary audio/video test; Hub map contained tiles but no usable pins. Founder rejected that design and explicitly required **three independent app identities**.

## Implemented correction (standalone browser apps)
### Hub — events and world map
- `standalone/hub/map.js` now implements a real interactive Leaflet + OpenStreetMap map.
- Coordinates from approved real events/projects and clearly labeled DEMO records yield distinct colored map markers.
- Popup shows category, title, location and a button to jump to its event/project card; card selection can focus the map pin.
- Pins and event cards obey the same search/category/nearby filters. The legend explains colors and remains visible while the filtered pin set changes.
- Demo fixtures include `demo-e3` for **Newark, New Jersey (40.7357, -74.1724)** category `Meetup`, and a Lisbon exhibition; see `supabase/ascend-demo-15-map-location-fixtures.sql`.
- No precise user location requested by default. "Near me" remains optional and requires browser permission. OS/permission denial should never block global discovery.
- Host is GitHub Pages at `https://theascendtheory.github.io/the-ascend-theory/`; page build explicitly copies `map.js`. Leaflet CDN and OSM tile availability are external dependencies.

### Academy — distinct cinematic learning studio
- Replaced `standalone/academy/index.html` rather than just changing colors.
- Premium dark forest/gold editorial design, featured course hero, course artwork tiles, subject discovery, chapter navigation, reading/listening/video/practice modes, local demo completion meter and graded retakeable tests.
- Demo marks are session-scoped and do not affect real learner records. Demo recordings are labeled external technical playback samples.
- In `apps/native/src/Academy.tsx`, added a separate dark warm classroom palette while retaining real Supabase lesson and marks flows.

### Media — distinct streaming studio
- Replaced `standalone/media/index.html` with immersive black/teal interface, Watch / Listen / Discover navigation, film and sound shelves, curated playlists and a persistent docked player.
- Now-playing surface exposes next/previous, play/pause, volume, seek, mini-player reopen and a mixed audio/video queue, using one HTMLMediaElement and the Media Session API where available.
- Browser/OS background restrictions still apply; *do not claim guaranteed gapless playback or lock-screen continuity*. Native device signing/testing is required.
- In `apps/native/src/Media.tsx`, added a distinct dark/cyan streaming style and retained the native queue/player.

## Tests
- Pages deployment validates JavaScript syntax for all three apps and the external Hub map module.
- Hub mobile acceptance `.github/scripts/hub-browser-smoke.cjs` now tests New Jersey marker display, category filtering, popup focus, and navigation.
- Academy/Media mobile acceptance `.github/scripts/ascend-demo-browser-smoke.cjs` tests reading/audio/practice, grading + retry and Media queued playback + minimized player.
- The independent browser acceptance test for Academy/Media run **45325204750** passed, along with Hub's earlier marker-filter test **45325201502**. Later popup-focused Hub test must be checked before claiming it passed.
- Final public release requires content replacement and real native builds/device tests. This correction is for deployed browser apps and native visual identity; fully native map parity still needs a dedicated implementation.

## Product invariant
Never again replace bespoke functional product navigation with a reused brochure/catalogue page. Hub is live-location discovery; Academy is a learning classroom; Media is streaming and listening.
