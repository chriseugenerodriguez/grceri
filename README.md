# Grceri

The active React + shadcn/ui frontend is in `frontend/`. The Angular source in `website/` is retained for reference; its assets remain the canonical catalog/image inputs. The older Azure APIs and Go crawlers are legacy code; the Go crawler directory is ignored and contains unresolved merge conflicts.

The site now runs as a public preview: accounts, login, signup, payments, checkout, and server-backed submissions are disabled. Old account URLs redirect to `/groceries/all`. Search and product comparison work without an account; comparison is stored locally. See [the audit report](docs/AUDIT.md) for fixes, validation, and remaining findings.

## Firebase Hosting and the populated catalog

The public site is a static React build on Firebase project/site `grceri-c3702`. Search, categories, product details, comparisons, and homepage recommendations use the same bundled catalog. Supabase remains the import store; visitors do not need a live database connection. No Firebase Functions, Firestore, or authentication migration is needed for this preview.

Search and the all-products view show 24 products per page. Shareable `q` and `page` URL parameters preserve searches and navigation. Search matches product names, brands, barcodes, and category ancestry, ignoring accents and punctuation. Out-of-range page requests are clamped to the available results.

From the repository root, refresh the public storefront sample and publish it:

```powershell
npm run data:collect
npm run data:import -- --input data/demo/storefront.json --source supermarketitaly
npm run data:snapshot
npm run hosting:deploy
```

`data:collect` fetches at most 32 products from each of 24 explicit Supermarket Italy collection feeds, with a pause between requests. Change the bounded page size with `npm run data:collect -- --limit 48` (maximum 100). It excludes missing/invalid prices and deduplicates by product ID. It stores the source URL and collection time, and generates a local coverage report in `data/demo/collection-report.json`. Some collections are empty; they are not filled with fabricated listings. Prices are captured snapshots, not current offers. Descriptions are short factual summaries rather than copied retailer marketing text. Product images and trademarks belong to their respective owners.

`npm run data:refresh` runs migrations, collects and imports products, verifies table permissions and category references, exports products and categories, and caches images. It does not deploy; follow it with `npm run hosting:deploy` to publish the refreshed catalog. `npm run data:verify` can also be run separately.

New imports assign more specific subcategories when the product title supports them (for example spaghetti, oatmeal, Dijon mustard, and anchovies). Unclear products remain in their broad category. Product URL categories stay unchanged. For existing Supermarket Italy records, preview assignment changes with `npm run data:classify -- --dry-run`, then apply with `npm run data:classify`; follow with snapshot/build/deploy. The local review report is `data/demo/classification-report.json`.

`hosting:deploy` caches product images into `website/src/assets/img/products/`, selects snapshot mode, builds production, and deploys **only** Hosting to `grceri-c3702`. The separate `grceri-api` site and legacy services are unaffected. It requires an authenticated Firebase CLI (`firebase login`). On Windows installations that need the operating system CA store, set `$env:NODE_USE_SYSTEM_CA='1'` first. Unavailable images use the local placeholder. The image cache and catalog should be committed together. Run `npm run hosting:build` to prepare without deploying.

### Supabase setup

Requires Node.js 22 or newer. Run `npm ci` in the repository root to install the Postgres client used by database commands. Run `npm --prefix frontend ci` to install the frontend dependencies. Start the app with `npm run dev`. No Angular dependencies are required.

1. Copy `.env.example` to `.env` in the repository root. Fill in the project URL, public publishable/anon key, and database connection parameters from Supabase **Connect → Session pooler**. The database password is used only by local CLI commands. `.env` is ignored by Git. Set `SUPABASE_DB_SSL_CA_FILE=supabase/certs/prod-ca-2021.crt` to use the supplied public CA certificate; TLS and hostname verification remain enabled.
2. Run `npm run data:migrate`. It applies all SQL files in `supabase/migrations/` in filename order, creating isolated `demo_products` and `demo_categories` tables with public read access and server-only writes. It also upserts the 606-node category tree, preserving parent links, display order, and icons. The migrations and category import can be run again safely without replacing products. A service-role key is optional for REST product imports; it does not replace the database connection needed by `data:migrate`.
3. From the repository root:

   ```powershell
   npm run data:seed -- --dry-run
   npm run data:seed
   npm run data:snapshot
   npm run dev
   ```

`data:seed` imports the existing ten-product fixture. Stable source/product IDs make reruns update existing records rather than duplicate them. All records are validated before writing. Password-based imports run in one database transaction and roll back on failure. If `SUPABASE_SERVICE_ROLE_KEY` is set, imports use REST batches of 100 instead; if a later batch fails, earlier batches remain saved and rerunning is safe. Changing `--source` intentionally creates a separate set of products. Missing products are not deleted on a subsequent import.

`data:snapshot` reads saved products and categories using the public key, writes `website/src/assets/json/products-demo.json` and `category.json`, and selects snapshot mode locally. Category rows are rebuilt into the original navigation tree; invalid or disconnected trees and empty catalogs are rejected. Commit both snapshots with frontend changes: Firebase builds use them by default, even without the ignored local config, and visitors do not depend on Supabase being awake. Regenerate and rebuild after changing the database.

The React frontend uses the exported snapshot only. Supabase credentials stay in local data commands; session middleware and authentication SDKs are unnecessary. The legacy `data:configure` command is retained for the archived Angular implementation.

### Scrape or import products

```powershell
# Scrape explicit product pages containing Product JSON-LD and save a local export.
# Dry-run still writes the local export, but does not write to Supabase.
npm run data:scrape -- https://store.example/product --source store --dry-run
# Import the saved export into Supabase.
npm run data:import -- --input data/demo/scraped.json --source store

# Or scrape and save directly in one command.
npm run data:scrape -- https://store.example/product --source store

# Import a legacy JSON export; validate first.
npm run data:import -- --input path/to/products.json --source target --dry-run
npm run data:import -- --input path/to/products.json --source target

# Read back saved data to a local file.
npm run data:export -- --output data/demo/export.json
# Refresh the static frontend snapshot from Supabase.
npm run data:snapshot
npm run test:data
```

The temporary scraper supports static Product JSON-LD (including `@graph` and product arrays). It fetches only the URLs provided; it does not crawl entire stores or bypass access controls. Pages requiring JavaScript or lacking Product JSON-LD need a JSON export. Imports accept a product array or `{ "products": [...] }`, with `name`/`title`, `upc`/`id`/`sku`, `price`, `category`, and `images`. Legacy Target-style `category_path`, `average_rating`, and JSON-encoded image arrays are supported. UPCs should be strings to preserve leading zeros. Imported data is restricted to public display fields and is only for previews; prices and availability are not live.

To remove the temporary database data, run `delete from public.demo_products;` in the project's SQL editor. To update the public preview after any database change, export a new snapshot and rebuild.

The importer uses the [Supabase REST API](https://supabase.com/docs/guides/api). Social, blog, help-center, and app-store links point to [Chris's website](https://chriseugenerodriguez.com/).

## Frontend validation

Run `npm run test:data` for importer and React catalog regressions, then `npm run hosting:build` for type checking, production compilation and asset validation. `npm run test:browser` runs the production app through Playwright; install Playwright in your development tools and set `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE` if it is not on the default module/browser path. See [UI migration](docs/UI-MIGRATION.md) for component coverage.

The active shadcn development preview runs at **http://localhost:64680** via `npm start` or `npm run dev`. Stop an existing preview before restarting; strict port checking prevents opening a different app on an unexpected port.
