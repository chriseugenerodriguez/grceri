import { createHash } from 'node:crypto';

export const WEBSITE = 'https://chriseugenerodriguez.com/';
export const slug = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-');

function amount(value, field, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw new Error(`Invalid ${field}: ${value}`);
  return number;
}

export function normalize(input, source = 'fixture') {
  const records = Array.isArray(input) ? input.flat() : input.products;
  if (!Array.isArray(records) || !records.length) throw new Error('Expected a nonempty product array or {products: [...]}');
  if (!/^[a-z0-9_-]+$/i.test(source)) throw new Error('Source must contain only letters, numbers, underscores or hyphens');
  const rows = new Map();
  for (const item of records) {
    if (!item || typeof item !== 'object') throw new Error('Each product must be an object');
    const name = String(item.name ?? item.title ?? item.Title ?? '').trim();
    if (!name) throw new Error('Product is missing a name/title');
    const sourceId = String([item.sem3_id, item.upc, item.UPC, item.id, item.sku, item.base_url]
      .find(value => value !== undefined && value !== null && String(value).trim() !== '') ?? slug(name));
    const id = createHash('sha256').update(`${source}:${sourceId}`).digest('hex');
    let images = item.images ?? item.Images ?? [];
    if (typeof images === 'string') {
      try { images = JSON.parse(images); } catch { images = [images]; }
    }
    if (!Array.isArray(images)) images = [images];
    images = images.map(image => typeof image === 'string' ? image : image?.original ?? image?.url)
      .filter(image => typeof image === 'string' && /^https?:\/\//i.test(image))
      .map(image => image.replace(/^http:/i, 'https:'));
    if (!images.length) images = ['/assets/svg/cart.svg'];
    const brand = item.brand?.name ?? item.brand ?? item.Brand ?? 'Demo';
    const category = String(item.category ?? item.category_path?.split('/').pop() ?? 'Groceries');
    const price = amount(item.price ?? item.Price ?? item.min_price, 'price');
    const rating = amount(item.rating ?? item.average_rating, 'rating');
    if (rating > 5) throw new Error(`Rating exceeds 5 for ${name}`);
    // Explicit allowlist: scraper exports may contain unrelated or private fields.
    const payload = {
      sem3_id: id, upc: String(item.upc ?? item.UPC ?? ''), name,
      description: String(item.description ?? item.details ?? ''),
      brand: String(brand), category, cat_id: String(item.cat_id ?? item.category_id ?? ''),
      price, price_currency: String(item.price_currency ?? 'USD'), rating,
      size: String(item.size ?? ''), images, images_total: images.length,
      source_name: source,
      source_url: /^https:\/\//.test(item.source_url ?? '') ? String(item.source_url) : '',
      fetched_at: String(item.fetched_at ?? ''),
      quantity: 1, features: {},
      sitedetails: [{ name: 'Demo', url: WEBSITE, latestoffers: [{ price, currency: 'USD', isactive: 1 }] }]
    };
    rows.set(id, { id, source, source_id: sourceId, payload });
  }
  return [...rows.values()];
}

export function extractProducts(html, pageUrl) {
  const products = [];
  function visit(node) {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== 'object') return;
    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    if (types.some(type => /(^|[/#])Product$/.test(type ?? ''))) {
      const offer = Array.isArray(node.offers) ? node.offers[0] : node.offers;
      const images = [node.image ?? []].flat().map(image => {
        const url = typeof image === 'string' ? image : image?.url;
        return url ? new URL(url, pageUrl).href : undefined;
      }).filter(Boolean);
      products.push({
        name: node.name, description: node.description, brand: node.brand,
        category: node.category, images, price: offer?.price ?? offer?.lowPrice,
        price_currency: offer?.priceCurrency, rating: node.aggregateRating?.ratingValue,
        upc: node.gtin12 ?? node.gtin13 ?? node.gtin, sku: node.sku,
        base_url: node.url ? new URL(node.url, pageUrl).href : pageUrl
      });
    }
    for (const [key, value] of Object.entries(node)) if (key !== '@context') visit(value);
  }
  for (const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi)) {
    try { visit(JSON.parse(match[1])); } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }
  }
  if (!products.length) throw new Error('No Product JSON-LD found. Use a JSON export for pages that require JavaScript.');
  return products;
}

export async function request(url, key, { method = 'GET', body, fetcher = fetch } = {}) {
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  // New sb_* keys are API keys, not JWT bearer tokens.
  if (!key.startsWith('sb_')) headers.Authorization = `Bearer ${key}`;
  if (method === 'POST') headers.Prefer = 'resolution=merge-duplicates,return=minimal';
  const response = await fetcher(url, { method, headers, body: body && JSON.stringify(body), signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Supabase HTTP ${response.status}. Check project credentials and apply the demo_products migration.`);
  if (method === 'GET') return response.json();
}

export async function saveRows(url, key, rows, fetcher = fetch) {
  for (let i = 0; i < rows.length; i += 100) {
    await request(`${url}/rest/v1/demo_products?on_conflict=id`, key, {
      method: 'POST', body: rows.slice(i, i + 100).map(row => ({ ...row, updated_at: new Date().toISOString() })), fetcher
    });
  }
}
