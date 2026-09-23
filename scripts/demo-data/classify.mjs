import { writeFile, mkdir } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { withDatabase, saveDatabaseRows } from './database.mjs';
import { classifyProduct } from './classification.mjs';
import { categoryTree } from './categories.mjs';
process.loadEnvFile(new URL('../../.env', import.meta.url));
const { values } = parseArgs({ options: { 'dry-run': { type: 'boolean', default: false } } });
await withDatabase(async client => {
  const tree = categoryTree((await client.query('select * from public.demo_categories')).rows);
  const rows = (await client.query("select id, source, source_id, payload from public.demo_products where source='supermarketitaly'")).rows;
  const changes = rows.map(row => ({ ...row, payload: { ...row.payload, cat_id: classifyProduct(row.payload, tree) } }))
    .filter((row, index) => row.payload.cat_id !== rows[index].payload.cat_id);
  const report = changes.map(row => ({ name: row.payload.name, category_id: row.payload.cat_id }));
  await mkdir(new URL('../../data/demo/', import.meta.url), { recursive: true });
  await writeFile(new URL('../../data/demo/classification-report.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  if (!values['dry-run'] && changes.length) await saveDatabaseRows(client, changes);
  console.log(`${values['dry-run'] ? 'Would update' : 'Updated'} ${changes.length} product category assignments; product IDs, names, prices and URLs preserved.`);
});
