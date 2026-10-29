import { categoryTree } from '../../../scripts/demo-data/categories.mjs';
export async function loadPersonalCatalog(signal, fetcher = fetch) {
  const timed = AbortSignal.any([signal, AbortSignal.timeout(15000)]);
  const configResponse = await fetcher('/personal-demo.json', {signal: timed});
  if (!configResponse.ok) throw new Error('Catalog configuration unavailable');
  const config = await configResponse.json();
  async function all(table, select) {
    const rows = [];
    for (let offset = 0; offset < 100000; offset += 500) {
      const response = await fetcher(`${config.url}/rest/v1/${table}?select=${select}&order=id&limit=500&offset=${offset}`, {
        headers: {apikey: config.anonKey, 'Accept-Profile': 'grceri'}, signal: timed
      });
      if (!response.ok) throw new Error('Catalog unavailable');
      const page = await response.json();
      if (!Array.isArray(page)) throw new Error('Invalid catalog response');
      rows.push(...page);
      if (page.length < 500) return rows;
    }
    throw new Error('Catalog exceeds supported size');
  }
  const [products, categories] = await Promise.all([all('demo_products', 'payload'), all('demo_categories', '*')]);
  if (!products.length) throw new Error('Empty catalog');
  return [products.map(row => row.payload), categoryTree(categories)];
}
