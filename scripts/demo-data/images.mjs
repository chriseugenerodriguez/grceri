// Cache product images with the static site, so visitors need only Firebase Hosting.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const file = resolve(root, 'website/src/assets/json/products-demo.json');
const products = JSON.parse(await readFile(file, 'utf8'));
const folder = resolve(root, 'website/src/assets/img/products');
await mkdir(folder, { recursive: true });
let cached = 0, fallback = 0;
// Sequential requests keep the image host load bounded; existing files are reused.
for (const product of products) {
  const url = product.images?.[0];
  if (url?.startsWith('/assets/')) continue;
  try {
    const id = createHash('sha256').update(url).digest('hex').slice(0, 24);
    let path;
    for (const extension of ['jpeg', 'png', 'webp', 'gif', 'avif']) {
      const candidate = `/assets/img/products/${id}.${extension}`;
      try { await access(resolve(root, 'website/src' + candidate)); path = candidate; break; } catch { /* Download missing images. */ }
    }
    if (!path) {
      const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!response.ok || !/^image\/(jpeg|png|webp|gif|avif)(;|$)/.test(response.headers.get('content-type') || '')) throw new Error('Unavailable image');
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length > 3 * 1024 * 1024) throw new Error('Image too large');
      path = `/assets/img/products/${id}.${response.headers.get('content-type').split(';')[0].split('/')[1]}`;
      await writeFile(resolve(root, 'website/src' + path), bytes);
    }
    product.images = [path]; cached++;
  } catch { product.images = ['/assets/svg/cart.svg']; fallback++; }
  product.images_total = 1;
  if ((cached + fallback) % 50 === 0) console.log(`Prepared ${cached + fallback} images...`);
}
await writeFile(file, JSON.stringify(products, null, 2) + '\n');
await writeFile(resolve(root, 'website/src/assets/demo-config.json'), '{"mode":"snapshot"}\n');
console.log(`Images ready: ${cached} cached, ${fallback} placeholders, ${products.length} total products.`);
