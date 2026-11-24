# Ascenders launch execution — 23–30 November 2026

## Verified objectives
- **Black Friday 2026: Friday 27 November.** Cyber Monday: Monday 30 November.
- Current merch provider **Fourthwall**. Current shop: **https://shop.theascendersclub.com**; the prior **https://shop.theascendtheory.com** is retired.
- The Fourthwall page was previously observed in **Coming soon** mode. No proof yet of published stock, checkout, payouts, payment method, fulfillment, or tested order.
- Production site Shop CTA was corrected on **main** at commit `231e5504aad0cf3becb6422cdb787031844b932e`; Vercel production deployment `dpl_BrVQtR5Pp8m9arFxuda7N8Yc9SCV` READY; the shop page returns 200 and links to new Fourthwall URL.
- Three real native apps in repository `apps/native`: Hub, Academy, Media. Separate bundle IDs, native CI passing. **Unsigned JS bundles are not store binaries**.

## Store owner's critical action queue (Fourthwall app/dashboard)
1. Go to **Products** → **Create new product**. Build a focused first drop using approved brand assets; verify sizes, colours, print positions, landed production cost and profit. Do not publish a product lacking authorized printable artwork.
2. **Settings → Billing and payouts**: owner completes payout setup and adds a payment method (Fourthwall may charge it for unprofitable orders/codes). These are payment details for the merchant; never request or place them in GitHub.
3. **Site design → Layout**: build the premium branded storefront home, hero product photography, featured products/collection, clear shipping/returns/contact support, and Black Friday announcement.
4. In **Promotions**, configure a **shop promo code** and test that gross margin remains positive after discount, taxes and processing. Fourthwall does not support scheduled price changes; promo codes require manual deactivation or a usage limit. Do not claim an end date is automatic.
5. **Fourthwall dashboard Home → Site status → Live → Save.** Coming Soon must be explicitly turned off. Verify actual public product visibility.
6. Mobile end-to-end dry run: open **shop.theascendersclub.com** in private browser session → browse product → choose variant → add cart → taxes/shipping → secure checkout. If authorized, place test order and confirm order email/fulfillment, otherwise stop before charge and mark test incomplete.
7. Launch sale and share links Friday 27 November; manually retire promo after desired period, e.g. Monday 30 November.

## Build deliverables accomplished in repo
- `.github/workflows/ascenders-native-cloud-build.yml`: iOS+Android Expo cloud build matrix on demand, with signed APK/IPA paths after credentials/project IDs configured.
- `apps/native/eas.json` now has separate `preview-hub`, `preview-academy`, `preview-media` profiles for internal distribution.
- `apps/native/app.config.js` maps Expo cloud project IDs from `EXPO_PROJECT_ID_HUB`, `EXPO_PROJECT_ID_ACADEMY`, `EXPO_PROJECT_ID_MEDIA`.
- `.github/workflows/ascenders-android-apk.yml` builds **release-mode Android APKs signed with debug credentials for testing**, no Expo account required. GitHub Actions artifacts expire after 14 days.
- Source changes remain in **`ascend-hub-functional-foundation`**, separate from production homepage.

## Credentials needed before real iOS TestFlight / App Store and Google Play
- Expo account with **three Expo projects** (one per app), linked by the project's UUID. Owner generates an account-scoped automation token and adds it directly in GitHub **Settings → Secrets and variables → Actions** as **EXPO_TOKEN**. Do not paste account tokens in chat or commit them.
- Repo Actions variables `EXPO_PROJECT_ID_HUB`, `EXPO_PROJECT_ID_ACADEMY`, `EXPO_PROJECT_ID_MEDIA`; public Supabase app settings `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (publishable only).
- Apple Developer Program membership, signing credentials, App Store Connect/TestFlight and store review; Google Play Console account, Play signing, app listing and review.
- Expo cloud build initial setup may require one-time interactive device/provider signing authorization; GitHub Actions `--non-interactive` cannot complete that onboarding on its own.
- Generate and approve final icons/splash assets and privacy disclosures before public store submission.
- Test media background/lock-screen playback on signed iPhone and Android; test Academy assessments, Hub email magic links, member approval, content uploads, payments and privacy.

**Current launch state:** production Shop link fixed, actual Fourthwall live selling not verified. Native builds partially automated, not yet approved or published.
