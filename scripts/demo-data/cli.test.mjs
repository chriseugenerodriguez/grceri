import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

test('CLI seeds twice without duplicates, scrapes, imports and exports', async () => {
  const rows = new Map();
  const directory = await mkdtemp(join(tmpdir(), 'grceri-demo-test-'));
  const server = createServer(async (req, res) => {
    if (req.url === '/product') {
      res.end('<script type="application/ld+json">{"@type":"Product","name":"Test Milk","sku":"milk","offers":{"price":"3.50"}}</script>');
      return;
    }
    if (req.headers.apikey !== 'sb_secret_test') { res.writeHead(403).end(); return; }
    if (req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      for (const row of JSON.parse(body)) rows.set(row.id, row);
      res.writeHead(201).end();
    } else {
      const url = new URL(req.url, 'http://localhost');
      const offset = Number(url.searchParams.get('offset'));
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify([...rows.values()].slice(offset, offset + 100)));
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const cli = (...args) => promisify(execFile)(process.execPath,
    [fileURLToPath(new URL('./cli.mjs', import.meta.url)), ...args],
    { env: { ...process.env, SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_test' } });
  try {
    await cli('seed');
    await cli('seed');
    assert.equal(rows.size, 10);
    const scraped = join(directory, 'scraped.json');
    await cli('scrape', `${url}/product`, '--source', 'test', '--output', scraped, '--dry-run');
    assert.equal(rows.size, 10);
    await cli('import', '--input', scraped, '--source', 'test');
    assert.equal(rows.size, 11);
    const exported = join(directory, 'export.json');
    await cli('export', '--output', exported);
    const products = JSON.parse(await readFile(exported, 'utf8'));
    assert.equal(products.length, 11);
    assert.equal(products.find(product => product.name === 'Test Milk').price, 3.5);
  } finally {
    await new Promise(resolve => server.close(resolve));
    const cleanupPath = resolve(directory);
    assert.equal(dirname(cleanupPath), resolve(tmpdir()));
    assert.ok(basename(cleanupPath).startsWith('grceri-demo-test-'));
    await rm(cleanupPath, { recursive: true, force: true });
  }
});
