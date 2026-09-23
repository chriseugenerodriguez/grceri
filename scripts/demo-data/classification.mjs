// Conservative title-based grouping, scoped to the source's existing main category.
// Product.category remains unchanged so previously published detail URLs stay valid.
const rules = {
  982: [['Mixed Spices & Seasonings', /\b(seasoning|rub|blend|garlic pepper)\b/i]],
  22384: [['Artichokes', /\bartichoke(s)?\b/i]],
  9570: [['Olive Oils', /\bolive oil\b/i], ['Balsamic Vinegars', /\bbalsamic\b/i], ['Vinegars', /\bvinegar\b/i]],
  9581: [['Ground', /\bground coffee\b/i], ['Coffee', /\b(coffee|espresso)\b/i], ['Lemonade', /\blemonade\b/i], ['Juices', /\bjuice\b/i], ['Cocktail Mixers', /\b(mixer|tonic)\b/i]],
  16494: [['Dijon Mustard', /\bdijon\b/i], ['Honey Mustard', /\bhoney mustard\b/i], ['Mustard', /\bmustard\b/i]],
  2929: [['Rice Flour', /\brice flour\b/i], ['Flours & Meals', /\b(flour|semolina)\b/i], ['Leaveners & Yeasts', /\byeast\b/i], ['Extracts & Flavoring', /\b(extract|vanillina)\b/i]],
  24430: [['Panettones', /\bpanettone\b/i], ['Breadcrumbs', /\bbread\s?crumbs?\b/i], ['Breadsticks', /\b(breadstick|grissini)s?\b/i], ['Breads', /\bbread\b/i]],
  8966: [['Fettuccine', /\b(fettucce|fettuccine)\b/i], ['Bow-Tie Pasta', /\bfarfalle\b/i]],
  1183: [['Potato Chips', /\bpotato chips\b/i], ['Tortilla Chips', /\btortilla chips\b/i], ['Chips', /\bchips\b/i]],
  11419: [['Pesto Sauce', /\bpesto\b/i], ['Pasta Sauce', /\b(pasta sauce|marinara|arrabbiata|bolognese)\b/i]],
  7207: [['Parmigiano-Reggiano', /\bparmigiano[ -]reggiano\b/i], ['Cheese', /\b(cheese|grana padano)\b/i]],
  5597: [['Oatmeal', /\b(oatmeal|oats|porridge)\b/i]],
  8490: [['Marmalades', /\bmarmalade\b/i], ['Jams & Jellies', /\b(jam|jelly|preserve)s?\b/i]],
  17138: [['Lentils', /\blentils?\b/i], ['Peas', /\b(chick peas|chickpeas|peas)\b/i], ['Grains', /\b(farro|quinoa)\b/i], ['Beans', /\b(beans|lupini)\b/i]],
  16000: [['Cherries', /\b(cherries|cherry)\b/i]],
  20632: [['Anchovies', /\banchov(y|ies)\b/i], ['Shrimp & Prawns', /\b(shrimp|prawn)s?\b/i]]
};

export function classifyProduct(product, tree) {
  const main = tree.groceries.categories.find(c => c.name === product.category);
  if (!main) return String(product.cat_id);
  const descendants = [];
  function visit(node) { for (const c of node.category || node.sub || []) { descendants.push(c); visit(c); } }
  visit(main);
  const title = product.name || '';
  const explicit = (rules[main.id] || []).find(([, pattern]) => pattern.test(title));
  const named = explicit && descendants.find(c => c.name === explicit[0]);
  // Prefer an exact, specific descendant title over a generic family rule.
  const matches = descendants.filter(c => c.name.length > 4 && !/[&']/g.test(c.name)).filter(c => {
    const name = c.name.replace(/s$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${name}s?\\b`, 'i').test(title);
  }).sort((a, b) => b.name.length - a.name.length);
  if (named && main.id === 982) return String(named.id); // Blends should not become single spices.
  const exact = matches[0];
  return String(named && (!exact || named.name.length >= exact.name.length) ? named.id : exact?.id ?? named?.id ?? main.id);
}
