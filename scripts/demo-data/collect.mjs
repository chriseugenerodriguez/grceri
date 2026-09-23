// Bounded public storefront collection feed scraper. No login or private API keys.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as pause } from 'node:timers/promises';
import { normalize } from './catalog.mjs';
import { classifyProduct } from './classification.mjs';
import { parseArgs } from 'node:util';
const { values } = parseArgs({ options: { limit: { type: 'string', default: '32' } } });
const limit = Number(values.limit);
if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('--limit must be between 1 and 100');
const root = fileURLToPath(new URL('../../', import.meta.url));
const tree = JSON.parse(await readFile(resolve(root, 'website/src/assets/json/category.json'), 'utf8'));
const collections = [
  ['spices', 982], ['artichokes', 22384], ['oil-vinegar', 9570],
  ['ramen', 8166], ['beverages-sodas', 9581], ['ground-coffee', 9581],
  ['chocolate', 6741], ['mustard', 16494], ['baking-ingredients', 2929],
  ['bread', 24430], ['panettone', 24430], ['pasta', 8966], ['meats', 7323],
  ['chips', 1183], ['nuts-seeds', 1183], ['pasta-sauce', 11419],
  ['cheese', 7207], ['oatmeal', 5597], ['fruit-jams-jellies', 8490],
  ['beans', 17138], ['rice', 17138], ['cherries', 16000], ['seafood', 20632], ['candy', 9786]
];
const products = new Map();
const coverage = [];
const fetchedAt = new Date().toISOString();
await mkdir(resolve(root, 'data/demo'), { recursive: true });
for (const [collection, categoryId] of collections) {
  const url = `https://supermarketitaly.com/collections/${collection}/products.json?limit=${limit}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30000),
    headers: { 'User-Agent': 'GrceriDemo/1.0 (https://chriseugenerodriguez.com/)' } });
  if (!response.ok) throw new Error(`${collection}: HTTP ${response.status}; previous export left intact`);
  const feed = await response.json();
  if (!Array.isArray(feed.products)) throw new Error(`Invalid feed: ${collection}`);
  const category = tree.groceries.categories.find(c => c.id === categoryId);
  let added = 0;
  for (const p of feed.products) {
    const variant = p.variants?.find(v => v.available) ?? p.variants?.[0];
    if (!p.id || !p.title || !variant || !p.images?.length || products.has(String(p.id))) continue;
    const price = Number(variant.price);
    if (!Number.isFinite(price) || price <= 0) continue;
    products.set(String(p.id), {
      id: String(p.id), name: p.title, brand: p.vendor, price,
      category: category.name, cat_id: String(category.id),
      size: variant.title === 'Default Title' ? '' : variant.title,
      description: `${p.title}. Catalog snapshot from Supermarket Italy; prices and availability may change.`,
      images: p.images.slice(0, 1).map(i => { const u = new URL(i.src); u.searchParams.set('width', '480'); return u.href; }),
      source_url: `https://supermarketitaly.com/products/${p.handle}`, fetched_at: fetchedAt
    });
    added++;
  }
  coverage.push({ collection, category: category.name, added });
  console.log(`${collection}: ${added} products`);
  await pause(1100);
}
const result = [...products.values()];
for (const product of result) product.cat_id = classifyProduct(product, tree);
normalize(result, 'supermarketitaly'); // Validate all records before replacing the usable export.
if (result.length < 100) throw new Error('Fewer than 100 products collected; previous export left intact');
await writeFile(resolve(root, 'data/demo/storefront.json'), JSON.stringify(result, null, 2) + '\n');
await writeFile(resolve(root, 'data/demo/collection-report.json'), JSON.stringify({ fetchedAt, products: result.length, coverage }, null, 2) + '\n');
console.log(`Collected ${result.length} unique products. Import with npm run data:import -- --input data/demo/storefront.json --source supermarketitaly`);
