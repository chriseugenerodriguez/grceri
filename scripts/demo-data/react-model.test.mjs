import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
const source = stripTypeScriptTypes(readFileSync(new URL('../../frontend/src/lib/catalog.ts', import.meta.url), 'utf8'));
const exports = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const { categoryEntries, searchProducts, filterProducts, pageOf, readComparison, productUrl } = exports;
const products = JSON.parse(readFileSync(new URL('../../website/src/assets/json/products-demo.json', import.meta.url)));
const entries = categoryEntries(JSON.parse(readFileSync(new URL('../../website/src/assets/json/category.json', import.meta.url))));
const filters = { brands: [], categories: [], min: null, max: null, rating: null, sort: 'default' };
test('React catalog preserves product URLs and searches category ancestry', () => {
  assert.equal(new Set(products.map(productUrl)).size, products.length);
  assert.equal(searchProducts(products, entries, 'breakfast oatmeal').length, 5);
  assert.equal(searchProducts([{ name: 'Café', brand: 'X', category: '', cat_id: '' }], [], 'CAFE').length, 1);
  assert.equal(searchProducts(products, entries, 'no-such-product').length, 0);
});
test('React filters include descendants, exact prices, zero bounds and rating thresholds', () => {
  const pasta = entries.find(e => e.path === '/groceries/pasta');
  const matches = filterProducts(products, entries, { ...filters, categories: [String(pasta.node.id)] });
  assert.ok(matches.length > 24);
  assert.ok(matches.every(p => pasta.ids.has(String(p.cat_id))));
  const sample = [{price:0,rating:0}, {price:6.1,rating:4.5}, {price:8,rating:5}, {price:8.01,rating:3}];
  assert.equal(filterProducts(sample, [], {...filters,max:0}).length, 1);
  assert.equal(filterProducts(sample, [], {...filters,min:6.1,max:8}).length, 2);
  assert.equal(filterProducts(sample, [], {...filters,rating:4}).length, 2);
  assert.equal(filterProducts(sample, [], {...filters,min:20,max:8}).length, 0);
  assert.equal(filterProducts(sample, [], {...filters,sort:'price-desc'})[0].price, 8.01);
  assert.equal(sample[0].price, 0);
});
test('React pagination clamps invalid and oversized requests without losing records', () => {
  assert.equal(pageOf(products, '2').start, 25);
  for (const value of ['0', '-1', 'NaN', '2.5', 'Infinity']) assert.equal(pageOf(products, value).page, 1);
  assert.equal(pageOf(products, '999').end, products.length);
  assert.equal(pageOf([], '2').start, 0);
  const ids = [];
  for (let page = 1; page <= pageOf(products, null).pages; page++) ids.push(...pageOf(products, String(page)).items.map(p => p.sem3_id));
  assert.deepEqual(ids, products.map(p => p.sem3_id));
});
test('React comparison migrates old objects, deduplicates and tolerates restricted storage', () => {
  assert.equal(JSON.stringify(readComparison({getItem:()=>JSON.stringify([{sem3_id:'one'},'one','two',null])})), '["one","two"]');
  assert.equal(readComparison({getItem:()=>'{bad'}).length, 0);
  assert.equal(readComparison({getItem:()=>{throw Error('blocked')}}).length, 0);
});
