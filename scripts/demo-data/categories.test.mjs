import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { flattenCategories, categoryTree } from './categories.mjs';

test('database category round trip preserves every navigation name, level, icon and order', async () => {
  const tree = JSON.parse(await readFile(new URL('../../website/src/assets/json/category.json', import.meta.url), 'utf8'));
  const rows = flattenCategories(tree);
  assert.equal(rows.length, 606);
  assert.deepEqual(categoryTree([...rows].reverse()), tree);
});

test('invalid category snapshots cannot silently replace the navigation tree', () => {
  const rows = flattenCategories({ groceries: { id: 1, categories: [{ id: 2, name: 'Fruit' }] } });
  assert.throws(() => categoryTree([...rows, rows[1]]), /duplicate/);
  assert.throws(() => categoryTree([rows[1]]), /root/);
  assert.throws(() => categoryTree([rows[0], { ...rows[1], parent_id: '99' }]), /parent/);
  assert.throws(() => flattenCategories({ groceries: { id: 1, categories: [{ id: 1 }] } }), /Duplicate/);
});
