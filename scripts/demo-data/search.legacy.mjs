import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const require = createRequire(new URL('../../website/package.json', import.meta.url));
const ts = require('typescript');
const source = readFileSync(new URL('../../website/src/app/core/services/catalog-search.ts', import.meta.url), 'utf8');
const exports = {};
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports });
const { catalogIndex, catalogPage } = exports;
const tree = { groceries: { id: 1, categories: [{ id: 2, name: 'Breakfast Foods', category: [{ id: 3, name: 'Cereal', sub: [{ id: 4, name: 'Oatmeal' }] }] }] } };
test('search includes nested category names, folds accents and preserves barcode zeros', () => {
  const index = catalogIndex([{ name: 'Café Organic Porridge Oats', brand: 'Brand', cat_id: '4', upc: '001234' }], tree);
  for (const query of ['cafe', 'oatmeal', 'breakfast cereal', 'organic-brand', '001234']) {
    assert.equal(catalogPage(index, query, 1).total, 1, query);
  }
  assert.equal(catalogPage(index, 'cafe missing', 1).total, 0);
});
test('pagination covers each result once, clamps invalid pages, and resets narrow searches', () => {
  const index = catalogIndex(Array.from({ length: 53 }, (_, n) => ({ name: `Item ${n}`, cat_id: '4', sem3_id: n })), tree);
  const results = [1, 2, 3].flatMap(page => catalogPage(index, '', page).products);
  assert.equal(results.length, 53);
  assert.equal(new Set(results.map(p => p.sem3_id)).size, 53);
  assert.equal(catalogPage(index, '', 99).products.length, 5);
  for (const invalid of ['bad', -1, 1.5, Infinity]) assert.equal(catalogPage(index, '', invalid).page, 1);
  assert.equal(catalogPage(index, 'Item 52', 3).page, 1);
  const empty = catalogPage(index, 'missing', 3);
  assert.equal(empty.total, 0);
  assert.equal(empty.start, 0);
});
