# UI component migration inventory

The active frontend now uses React, Vite, Tailwind and actual shadcn/ui components generated with the official CLI. Source is in `frontend/`; Firebase builds use this app. The old Angular source is retained as reference, while `website/src/assets` remains the shared data/image source. No Angular, Bootstrap or Kendo runtime is included in the new build.

## Theme to preserve

Measured from the current site and its local Sass/font assets:

- Brand green: `#48B56A`; existing search action green: `#238345`.
- Hero: charcoal `#333`, white display text, existing angled background treatment.
- Body text: `#292B2C`; white surfaces; gray borders and muted backgrounds.
- Body font: local `AM` with Helvetica/Arial fallbacks, 16px base size. Local `AL` and `AB` are available for supporting weights.
- Display headings: local `B`, with the desktop home heading at 50px. Keep responsive sizing.
- Preserve the Grceri logo, food illustrations, local product photos, and category artwork.
- Map these to semantic component tokens rather than importing the old Bootstrap/Kendo stylesheet into the new components.
- Preserve visible keyboard focus and sufficient contrast, including the darker existing green for text-bearing buttons.

Baseline screenshots are saved locally under `data/demo/theme-home-desktop.png`, `theme-category-desktop.png`, and `theme-catalog-mobile.png` (ignored generated artifacts).

## Active component coverage

| Existing surface | Replacement components |
| --- | --- |
| Header category/resources menus | Navigation Menu / Dropdown Menu; mobile Sheet |
| Search and price forms | Input, Label, Button, Alert |
| Product cards and category tiles | Card, Badge, Button |
| Brand/category/rating filters | Checkbox, Accordion, Label |
| Sorting and layout controls | Select, Toggle Group |
| Search/all-products pagination | Pagination |
| Hierarchical category navigation | Breadcrumb, Accordion |
| Homepage and related-product rows | Carousel / responsive Card collections |
| Product overview and details | Card, Tabs / Separator, Button |
| Comparison page | Table, Button, empty-state Card |
| Loading, errors and empty results | Skeleton, Alert, accessible status text |
| Solutions pages, footer and 404 | Shared typography, Card and Button components |

## Preserved behavior

- All 610 products, 606 taxonomy records, current source IDs and existing product URLs.
- Search by names, brands, barcodes and category ancestry; accent-insensitive matching.
- 24 products per search page, URL query/page state and reload/back navigation.
- Exact custom price bounds, clearing filters, persistent sorting and correct rating thresholds.
- Nested category pages and counts, including numeric/string IDs from Supabase.
- Product details, local comparison storage and recovery from malformed local storage.
- Disabled account/payment routes; social, blog and help links pointing to the personal website.
- Firebase static hosting with local catalog/image assets; existing Supabase import and snapshot commands.
- Mobile layouts, keyboard-operated menus/forms, accessible labels, loading/error/empty states.

## Scope

Components are replaced across the active public frontend. Legacy Azure APIs, mobile code and disabled account/payment screens do not become active during this migration. The existing catalog pipeline remains intact. The production browser suite covers navigation, catalog interactions, legacy comparison migration, mobile drawers and data-load recovery.

Search and filtering refinements: brand search, removable active-filter buttons, category parent/child navigation, facet counts respecting other filters, and price/search drafts preserved during sorting. List view uses the actual card selector. Desktop and mobile interactions are covered by the browser suite.

Deployment status: published successfully to https://grceri-c3702.web.app on September 22, 2026 (Pacific time). The production browser suite passed against the live React/shadcn site, covering search, pagination, filters, sorting, product tabs, comparisons, error recovery and mobile drawers.

Follow-up component fixes: clear-search control restores input focus; blank searches open all products; product breadcrumbs include the full category ancestry; related-product links open the matching category; detail tabs reset between products; mobile filters offer a result-count close action. Added browser assertions for these controls.

Carousel follow-up: three desktop/two tablet/one mobile cards, at most nine related items, visible 40px arrow controls above cards, grouped scrolling and keyboard focus. Browser regression checks verify real slide movement in both directions, keyboard scrolling and mobile card width. Filter changes preserve page position; unfinished price ranges can be cleared, and category navigation resets the mobile filter sheet.

Search/sort sizing: full-width search forms, short readable placeholder, fixed-size search actions, and a wider sort trigger. Browser tests check widths and overflow at 320px, 390px and 768px. Root npm start and website npm start/build now delegate to React; archived Angular commands are explicitly named start:legacy and build:legacy.

## Localhost 64680 audit correction
The user's active preview at http://localhost:64680 is Angular, confirmed by app-root and runtime/polyfills/vendor/main scripts. Earlier Firebase React fixes did not address this running preview. Direct Angular fixes now cover search host/parent widths, readable native sorting, accessible grid/list buttons, keyboard-operable filter headings, labelled category/brand checkboxes, brand search without an overlapping hint input, price-control layout, product card spacing, and product-detail columns. Related products are restricted to nine matching products and rendered once. The old carousel advanced by the total item count modulo that same count, leaving it at zero; native horizontal scrolling now supports arrows, touch and keyboard with responsive 3/2/1 cards.
Validated against port 64680: 42 category products, selecting five salt products, selecting twelve Sanniti products, eight products in the $6–$8 range, clearing restores 42, sorting, grid/list, real carousel movement both directions, homepage search navigation, 300px mobile homepage input and no horizontal overflow. Angular production build and 12 legacy regression tests pass. The separate React Firebase build was not redeployed for this local correction.

## Active local preview now uses shadcn
The Angular process bound to localhost:64680 was stopped and replaced by the React/Vite shadcn app. Vite defaults to localhost:64680 with strictPort, so npm start/npm run dev will not silently choose a different port. The complete React browser suite passed against this exact local origin. The herbs/spices category was verified to render React, shadcn Select and Checkbox, and no app-root. Angular repairs above are historical only; the requested active component library is shadcn.

Header/home visual restoration: restored the original compact header placement (logo, Categories, inline inner-page search, right-aligned Solutions and Resources), original menu labels and nested taxonomy submenus, without an added header Compare button. Restored the original homepage section structure, angled charcoal hero, original food sprite composition and circular category artwork using scoped original CSS and React markup. Interactive controls continue using shadcn. No Angular runtime was reintroduced. Production build and browser suite pass, including the restored nested menu on mobile.

Restoration follow-up: category landing page again shows 23 top-level headings with subcategory columns and shadcn dropdowns for deeper levels; footer restores the cart mark, Online Grocery Database block, social links and right-hand Solutions/Resources columns; homepage CTA and compact seven-column desktop carousels restore their original placement, side arrows and dots. Related-product carousels retain three desktop cards. Sidebar order is Category, Brand, Price, Rating, with original-style compact controls and functional preset prices. Header menus now open on hover while retaining keyboard/touch access. Centered containers follow the original breakpoint widths and stop growing at 1570px of content inside the original 1600px cap. Validated with the complete React browser suite and restoration-smoke.cjs against localhost:64680; production build passes.

Further visual corrections: restored the header dropdown's Radix arrow, shortened homepage search to 44px, changed homepage carousels to four desktop cards and reduced title spacing with no duplicated title, swipe text or View all link. Product details return to an unboxed image/metadata layout and stacked Overview, Nutritional Facts and Reviews sections. Footer column widths and type sizes match the original template. Build and localhost browser checks pass.
