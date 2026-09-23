import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../../website/dist/browser/', import.meta.url));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
assert.ok(html.includes('id="root"') && !html.includes('<app-root'), 'Hosting must build the React frontend');
const catalog = JSON.parse(await readFile(resolve(root, 'assets/json/products-demo.json'), 'utf8'));
assert.ok(catalog.length > 0, 'Built catalog must not be empty');
const config = JSON.parse(await readFile(resolve(root, 'assets/demo-config.json'), 'utf8'));
assert.deepEqual(config, { mode: 'snapshot' }, 'Firebase must use the bundled catalog');
const routes = new Set();
const slug = value => value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-');
for (const product of catalog) {
  const route = `${slug(product.category)}/${slug(product.name)}`;
  assert.ok(!routes.has(route), `Ambiguous product URL: ${route}`);
  routes.add(route);
  assert.ok(Number.isFinite(product.price) && product.price >= 0, 'Invalid product price');
  for (const image of product.images) {
    assert.ok(image.startsWith('/assets/') && !image.includes('..'), 'Product images must be hosted locally');
    await access(resolve(root, '.' + image));
  }
}
console.log(`Validated ${catalog.length} built products, unique detail routes, and local images.`);
