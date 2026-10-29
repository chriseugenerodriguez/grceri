import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, extractProducts, saveRows } from './catalog.mjs';

test('normalizes legacy exports, preserves leading zero UPCs and deduplicates reruns', () => {
  const item = { title: 'Milk', upc: '00123', price: '2.49', images: '["http://example.com/milk.jpg"]', secret: 'private' };
  const rows = normalize([item, { ...item, price: '3.00' }], 'target');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, normalize([item], 'target')[0].id);
  assert.notEqual(rows[0].id, normalize([item], 'other')[0].id);
  assert.equal(rows[0].payload.upc, '00123');
  assert.equal(rows[0].payload.price, 3);
  assert.equal(rows[0].payload.images[0], 'https://example.com/milk.jpg');
  assert.equal(rows[0].payload.secret, undefined);
  assert.equal(normalize([{ name: 'Milk', upc: '', sku: 'milk' }, { name: 'Tea', upc: '', sku: 'tea' }]).length, 2);
});

test('rejects malformed input before saving', () => {
  for (const input of [[], [{}], [{ name: 'Milk', price: 'NaN' }], [{ name: 'Milk', price: -1 }], [{ name: 'Milk', rating: 6 }]]) {
    assert.throws(() => normalize(input));
  }
});

test('scrapes JSON-LD graphs and resolves relative images', () => {
  const html = `<script type="application/ld+json">invalid</script><script type='application/ld+json'>
    {"@graph":[{"@type":["Thing","Product"],"name":"Milk","image":"/milk.jpg","sku":"milk","offers":{"price":"2.49","priceCurrency":"USD"}}]}
    </script>`;
  const products = extractProducts(html, 'https://example.com/product');
  assert.equal(products[0].images[0], 'https://example.com/milk.jpg');
  assert.equal(normalize(products, 'scraped')[0].payload.price, 2.49);
  assert.throws(() => extractProducts('<html></html>', 'https://example.com'));
});

test('upserts batches and does not send new API keys as bearer JWTs', async () => {
  const calls = [];
  const rows = Array.from({ length: 201 }, (_, id) => ({ id }));
  await saveRows('https://example.supabase.co', 'sb_secret_test', rows, async (url, options) => {
    calls.push({ url, options });
    return { ok: true };
  });
  assert.deepEqual(calls.map(call => JSON.parse(call.options.body).length), [100, 100, 1]);
  assert.equal(calls[0].options.headers.Authorization, undefined);
  assert.equal(calls[0].options.headers['Accept-Profile'], 'grceri');
  assert.equal(calls[0].options.headers['Content-Profile'], 'grceri');
  assert.match(calls[0].options.headers.Prefer, /merge-duplicates/);
  assert.match(calls[0].url, /on_conflict=id/);
});

test('stops on database failure and reports no secret', async () => {
  let count = 0;
  await assert.rejects(saveRows('https://example.supabase.co', 'secret', Array(201).fill({}), async () => {
    count++;
    return { ok: false, status: 403 };
  }), /Supabase HTTP 403/);
  assert.equal(count, 1);
});
