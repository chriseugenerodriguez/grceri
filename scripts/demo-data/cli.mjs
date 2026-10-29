import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { normalize, extractProducts, request, saveRows } from './catalog.mjs';
import { withDatabase, saveDatabaseRows } from './database.mjs';
import { flattenCategories, categoryTree } from './categories.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
if (existsSync(resolve(root, '.env'))) process.loadEnvFile(resolve(root, '.env'));

async function writeJson(file, data) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(data, null, 2) + '\n');
}

function credentials(publicKey = false, readOnly = false) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env[publicKey ? 'SUPABASE_ANON_KEY' : 'SUPABASE_SERVICE_ROLE_KEY'] ||
    (readOnly ? process.env.SUPABASE_ANON_KEY : undefined);
  if (!url || !key) throw new Error(`Set SUPABASE_URL and ${publicKey ? 'SUPABASE_ANON_KEY' : 'SUPABASE_SERVICE_ROLE_KEY'} in the root .env`);
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname))) {
    throw new Error('SUPABASE_URL must use HTTPS (HTTP is allowed for local Supabase)');
  }
  if (publicKey) {
    let role;
    try { role = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role; } catch { /* publishable keys are not JWTs */ }
    if (!key.startsWith('sb_publishable_') && role !== 'anon') throw new Error('Frontend key must be a publishable key or legacy anon JWT, never a service-role key');
  }
  return { url, key };
}

async function main() {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    input: { type: 'string' }, output: { type: 'string' }, source: { type: 'string' },
    'dry-run': { type: 'boolean', default: false }
  } });
  const [command, ...urls] = positionals;
  if (command === 'migrate') {
    const tree = JSON.parse(await readFile(resolve(root, 'website/src/assets/json/category.json'), 'utf8'));
    const categories = flattenCategories(tree);
    await withDatabase(async client => {
      for (const file of (await readdir(resolve(root, 'supabase/migrations'))).filter(f => f.endsWith('.sql')).sort()) {
        await client.query(await readFile(resolve(root, 'supabase/migrations', file), 'utf8'));
        console.log(`Applied ${file}`);
      }
      await client.query('begin');
      try {
        await client.query(`insert into grceri.demo_categories (id, parent_id, name, position, child_key, icon_class)
          select id, parent_id, name, position, child_key, icon_class from jsonb_to_recordset($1::jsonb)
          as c(id text, parent_id text, name text, position integer, child_key text, icon_class text)
          on conflict (id) do update set parent_id=excluded.parent_id, name=excluded.name,
            position=excluded.position, child_key=excluded.child_key, icon_class=excluded.icon_class, updated_at=now()`, [JSON.stringify(categories)]);
        await client.query('commit');
      } catch (error) { await client.query('rollback'); throw error; }
    });
    console.log(`Saved ${categories.length} categories without replacing existing products.`);
    return;
  }
  if (command === 'verify') {
    await withDatabase(async client => {
      const counts = (await client.query(`select (select count(*)::int from grceri.demo_products) as products,
        (select count(*)::int from grceri.demo_categories) as categories,
        (select count(*)::int from grceri.demo_products p left join grceri.demo_categories c
          on c.id=p.payload->>'cat_id' where c.id is null) as unknown_categories`)).rows[0];
      const permissions = (await client.query(`select c.relname as name,c.relrowsecurity as rls,
        has_table_privilege('anon',c.oid,'SELECT') as public_read,
        has_table_privilege('anon',c.oid,'INSERT,UPDATE,DELETE') as public_write,
        has_table_privilege('authenticated',c.oid,'INSERT,UPDATE,DELETE') as authenticated_write
        from pg_class c join pg_namespace n on n.oid=c.relnamespace
        where n.nspname='grceri' and c.relname in ('demo_products','demo_categories')`)).rows;
      if (!counts.products || !counts.categories || counts.unknown_categories || permissions.length !== 2 ||
        permissions.some(p => !p.rls || !p.public_read || p.public_write || p.authenticated_write)) throw new Error('Catalog verification failed');
      console.log(JSON.stringify({ ...counts, permissions }, null, 2));
    });
    return;
  }
  if (command === 'configure') {
    const { url, key } = credentials(true);
    await writeJson(resolve(root, 'website/src/assets/demo-config.json'), { url, anonKey: key });
    console.log('Configured frontend Supabase reads. Restart/rebuild the website to include the public config.');
    return;
  }
  if (command === 'export' || command === 'snapshot') {
    const { url, key } = credentials(false, true);
    const products = [];
    for (let offset = 0; ; offset += 100) {
      const page = await request(`${url}/rest/v1/demo_products?select=payload&order=id&limit=100&offset=${offset}`, key);
      products.push(...page.map(row => row.payload));
      if (page.length < 100) break;
    }
    if (command === 'snapshot' && !products.length) throw new Error('The hosted catalog is empty; seed it before publishing a snapshot.');
    const output = command === 'snapshot' ? resolve(root, 'website/src/assets/json/products-demo.json') :
      resolve(values.output ?? resolve(root, 'data/demo/export.json'));
    let tree;
    if (command === 'snapshot') {
      const categories = [];
      for (let offset = 0; ; offset += 100) {
        const page = await request(`${url}/rest/v1/demo_categories?select=*&order=id&limit=100&offset=${offset}`, key);
        categories.push(...page);
        if (page.length < 100) break;
      }
      tree = categoryTree(categories);
    }
    await writeJson(output, products);
    if (command === 'snapshot') {
      await writeJson(resolve(root, 'website/src/assets/json/category.json'), tree);
      await writeJson(resolve(root, 'website/src/assets/demo-config.json'), { mode: 'snapshot' });
    }
    console.log(`Exported ${products.length} products to ${output}`);
    return;
  }
  let input;
  let source = values.source;
  if (command === 'scrape') {
    if (!urls.length) throw new Error('Usage: npm run data:scrape -- https://store.example/product --source store');
    input = [];
    for (const address of urls) {
      const url = new URL(address);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Product URLs must use HTTP(S)');
      const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'GrceriDemo/1.0' } });
      if (!response.ok) throw new Error(`Product page returned HTTP ${response.status}`);
      input.push(...extractProducts(await response.text(), response.url));
    }
    source ??= 'scraped';
    const output = resolve(values.output ?? resolve(root, 'data/demo/scraped.json'));
    await writeJson(output, input);
    console.log(`Saved ${input.length} scraped products to ${output}`);
  } else if (command === 'seed' || command === 'import') {
    if (command === 'import' && !values.input) throw new Error('Usage: npm run data:import -- --input products.json --source target');
    input = JSON.parse(await readFile(resolve(values.input ?? resolve(root, 'website/src/assets/json/products-local.json')), 'utf8'));
    source ??= command === 'seed' ? 'fixture' : 'import';
  } else {
    throw new Error('Commands: migrate, verify, seed, import --input file.json, scrape URL..., export, snapshot, configure. Use --dry-run to validate imports without database writes.');
  }
  // Validate the entire input before any database writes.
  const rows = normalize(input, source);
  if (values['dry-run']) {
    console.log(`Validated ${rows.length} unique products (${source}); no database writes.`);
    return;
  }
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { url, key } = credentials();
    await saveRows(url, key, rows);
  } else {
    await withDatabase(client => saveDatabaseRows(client, rows));
  }
  console.log(`Saved ${rows.length} temporary products to Supabase. Rerunning the same source updates existing records.`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
