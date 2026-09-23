import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { classifyProduct } from './classification.mjs';
const tree = JSON.parse(await readFile(new URL('../../website/src/assets/json/category.json', import.meta.url), 'utf8'));
const group = (category, name) => classifyProduct({ category, name }, tree);
test('products reach appropriate nested categories without changing their URL category', () => {
  assert.equal(group('Pasta', 'Giuseppe Cocco Spaghetti, 17.6 oz'), '13261');
  assert.equal(group('Breakfast Foods', 'Organic Porridge Oats'), String(tree.groceries.categories.find(c => c.id === 5597).category[1].sub.find(c => c.name === 'Oatmeal').id));
  assert.equal(group('Seafood', 'Anchovy Fillets in Olive Oil'), '10723');
  assert.equal(group('Condiments', 'Dijon Mustard'), '21479');
});
test('classification stays inside the original family and preserves unknown groups', () => {
  assert.equal(group('Cooking & Baking Supplies', 'Organic Rice Flour'), '12624');
  assert.equal(group('Herbs, Spices & Seasonings', 'Garlic Pepper Seasoning'), '5352');
  assert.equal(group('Jams, Jellies & Spreads', 'Strawberry Preserve'), '4236');
  assert.equal(group('Pasta', 'Assorted Gift Box'), '8966');
  assert.equal(classifyProduct({ category: 'Unknown', cat_id: 'original', name: 'Spaghetti' }, tree), 'original');
});
