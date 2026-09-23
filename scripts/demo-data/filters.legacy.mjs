import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const require = createRequire(new URL('../../website/package.json', import.meta.url));
const ts = require('typescript');
const rx = require('rxjs');
const source = readFileSync(new URL('../../website/src/app/layout/pages/grocery/category/category.component.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true } }).outputText;
const exports = {};
vm.runInNewContext(code, { exports, module: { id: 'category-test' }, require: name => {
  if (name === '@angular/core') return { Component: () => value => value, Input: () => () => {}, ViewChild: () => () => {} };
  if (name.includes('sort.component')) return { SortComponent: class {} };
  if (name === 'rxjs') return rx;
  throw new Error(`Unexpected runtime dependency: ${name}`);
} });
const emptyFilters = () => ({ category: [], brand: [], price: [], rating: [] });
function make() {
  const component = new exports.CategoryComponent({}, {}, {}, { routeReuseStrategy: {} },
    { params: rx.of({}) }, { get: () => rx.of({ groceries: { categories: [] } }) });
  component.setItems.next([
    { name: 'C', brand: 'A', price: 7.49, rating: 4.8 },
    { name: 'A', brand: 'B', price: 12, rating: 4 },
    { name: 'B', brand: 'A', price: 6.50, rating: 3.9 },
    { name: 'D', brand: 'C', price: 0, rating: 0 }
  ]);
  return component;
}
test('custom bounds are inclusive, zero is a real maximum, and rating means at least', () => {
  const c = make();
  c.changeFilterStatus({ ...emptyFilters(), price: [{ from: 6.50, to: 7.49 }] });
  assert.equal(c.dispItems.length, 2);
  c.changeFilterStatus({ ...emptyFilters(), price: [{ from: 0, to: 0 }] });
  assert.equal(c.dispItems[0].name, 'D');
  assert.equal(c.dispItems.length, 1);
  c.changeFilterStatus({ ...emptyFilters(), rating: [{ rate: 4 }] });
  assert.equal(c.dispItems.map(p => p.name).join(','), 'C,A');
  assert.equal(c.availableFilters.rating.find(r => r.rate === 4).num, 2);
});
test('sort persists across filter changes and default restores source order', () => {
  const c = make();
  c.applySort(4);
  c.changeFilterStatus({ ...emptyFilters(), brand: [{ name: 'A' }] });
  assert.equal(c.dispItems.map(p => p.name).join(','), 'B,C');
  c.changeFilterStatus(emptyFilters());
  assert.equal(c.dispItems.map(p => p.price).join(','), '0,6.5,7.49,12');
  c.applySort(null);
  assert.equal(c.dispItems.map(p => p.name).join(','), 'C,A,B,D');
  c.setItems.next(c.items);
  assert.equal(c.availableFilters.brand.find(b => b.name === 'A').num, 2, 'Reloading must not double filter counts');
});
