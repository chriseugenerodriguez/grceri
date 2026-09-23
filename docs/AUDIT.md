# Public demo audit — September 21, 2026

## React and shadcn integration

The active app is now `frontend/` (React + official shadcn/ui, Tailwind and Vite). Firebase builds compile this app; the Angular source is retained only as reference. All public screens use the new shared components and original brand assets. Catalog snapshots and the Supabase pipeline remain unchanged. The frontend npm audit reports **0 vulnerabilities**, including development dependencies. The old Angular advisory counts below describe the archived dependency tree, not the active frontend.

Validation includes TypeScript, production asset checks, 17 importer/catalog regression tests and a production-browser suite for search, filters, paging, product tabs, comparisons, legacy storage, keyboard navigation, error recovery and mobile drawers. Price drafts now survive sorting changes, and empty-state titles have heading semantics.

## Earlier Angular audit (historical)

## Scope

Reviewed the active Angular browser app, routes, authentication, product data flow, forms, external scripts, navigation, hosting configuration, and repository configuration. Scanned the existing Go scraper for conflict markers, inventoried the legacy API/mobile directories, and ran npm advisory checks against every available package lockfile. This is a source/dependency/browser audit; no hosted backend, production database, or production deployment was changed.

## Fixed

- Authentication is disabled in the active frontend service. It creates no Auth0 SDK, reads no old tokens, and performs no login, signup, profile, or renewal requests.
- Login, registration, password reset, callback, account, pricing, membership, checkout, payment, cart, list, and watchlist routes—including descendant routes—redirect to the public catalog. Legacy account/payment modules are excluded from the active browser module.
- Removed login/account/cart navigation, signup calls to action, product-save requests against static JSON, seller login prompts, review submission/feedback controls, and checkout controls. Comparison remains local to the browser.
- Removed automatic Zendesk, AdSense, analytics, Stripe, Google login, scanner, and voice script loading. Replaced newsletter/lead forms with links to Chris's website. Blog, policy, and mobile-app deep links also go there.
- Search now searches the same fixture/Supabase catalog used by the other public pages. Removed embedded Nutritionix/Edamam credentials from the active API helper and disabled its obsolete enrichment calls. Previously exposed keys still require owner-side rotation if valid.
- Added a public all-products view, search results, no-results/error states, and fallback product images. Homepage data now uses the catalog service.
- Fixed mobile header overflow and made the public search field usable on narrow screens; the browser check asserts that the catalog fits a 390px viewport.
- Fixed product lookup, category descendant filtering, breadcrumb traversal, category view-query initialization, a brand-filter lifecycle error, the open-ended price filter, and nonfunctional sorting. Removed misleading pagination counts.
- Fixed product comparison add/remove/empty states and made local comparison storage tolerate corrupt or unavailable browser storage.
- Removed hardcoded nutrition/diet claims from public product details; fixed the image carousel for single-image products.
- Optional Supabase configuration now tolerates a static host returning the HTML app shell for a missing JSON file, while still surfacing real database failures.
- Ignored local Azure settings files to reduce accidental credential commits. Existing unrelated/untracked backend files were preserved.

## Remaining findings

1. **Dependencies need a separate migration.** The website lockfile reports 126 npm findings: 7 critical, 60 high, 46 moderate, and 13 low. These are advisory counts across the dependency tree, not confirmation that each issue is reachable in the public browser build. Many suggested fixes require incompatible Angular/ecosystem changes; none were force-applied. Full per-project counts, direct dependencies, and advisory links are in [dependency-audit.json](dependency-audit.json). `api/auth` and `api/functions` have no lockfile and could not be audited this way.
2. **Legacy backend credentials/configuration remain.** Local Azure settings and legacy API/scraper source contain credential configuration. The public demo does not use these integrations. Removing frontend references does not revoke credentials or disable any already-hosted backend. Review/rotate valid historical credentials through their owning services before reactivating or publishing legacy code.
3. **Legacy Go scraper is not runnable as-is.** `scraper/websites/target/products.go` contains unresolved merge markers; the directory is ignored by Git and still targets the old SQL setup. The supported temporary workflow is `scripts/demo-data`, documented in the root README. Other legacy API/mobile applications were inventoried and dependency-scanned, not migrated or runtime-tested.
4. **Supabase and Firebase Hosting verified.** The isolated migration and imports use the IPv4 session pooler with verified TLS. Public API reads succeeded. Database checks confirmed row-level security is enabled, anonymous reads are granted, and anonymous insert/update/delete privileges are absent. The database now contains 610 products: ten original samples and 600 scraped Supermarket Italy listings across 19 top-level categories. 363 imported products now have specific assignments across 73 subcategories, while product detail URLs remain unchanged. All 606 category/subcategory nodes are stored in demo_categories and exported from Supabase for frontend navigation. Repeat migration preserved every product; verification found zero unknown category references and confirmed read-only visitor access on both tables. The catalog snapshot and production frontend were deployed to https://grceri-c3702.web.app on September 21, 2026 (Pacific time). Visitors do not require Supabase connectivity. The separate API site and legacy backends were not migrated.
5. **Product data is a preview snapshot.** Prices and availability are not live. Imported product images are cached with the Firebase site; ten historical samples use the local placeholder. Some categories and subcategories have no samples and retain their empty state. Source URLs and fetch timestamps are preserved on imported records. The browser smoke test blocks external requests and verifies the site remains functional.

## Verification

- Production Angular build.
- Search/all-products views render 24 cards per page, preserve query/page URL state, and search category ancestry with accent-insensitive matching. Browser checks cover next/previous pages, reloads, retained queries, and clamped out-of-range pages.
- Custom price filters apply exact inclusive bounds, support an open-ended maximum and a zero maximum, reject reversed/negative ranges, and have a clear action. Sorting survives filter changes; default sorting restores source order. Rating filters/counts now match their at-least rating labels.
- Category sidebar checks cover numeric/string ID matching, selecting and clearing a leaf filter, and the nested Spaghetti route. The sidebar now keeps its selection as an array instead of replacing it with a category object.
- Built-catalog validation covers all 610 products, unique detail URLs, snapshot-only configuration, and the presence of every local product image. Firebase's live JSON and a cached image returned HTTP 200.
- `npm run test:data`: 25 passing tests covering importer, scrape/import/export round trip, REST upsert batching, transactional database imports, TLS/error handling, snapshot mode, category tree round trips and malformed-tree rejection, category selection, static-host fallback, disabled authentication, and resilient browser storage.
- Chromium smoke coverage in `scripts/demo-data/browser-smoke.cjs`: public browsing/search, old account/deep-link redirects, product details, categories, comparison, corrupt storage, mobile catalog, and absence of legacy API/script requests or form writes. This script requires Playwright and a running preview server; `PLAYWRIGHT_MODULE`, `CHROMIUM_EXECUTABLE`, and `DEMO_URL` can point to an existing local setup.
- `npm run audit:repo` regenerates the advisory report without changing dependencies. Windows environments using system certificates may require `NODE_USE_SYSTEM_CA=1`.

No claim of a clean security audit or production readiness is made while the remaining dependency and credential findings are open.
