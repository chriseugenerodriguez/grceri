export function flattenCategories(tree) {
  const rows = [];
  const ids = new Set();
  function visit(node, parent = null, position = 0) {
    if (!node || node.id === undefined) throw new Error('Category is missing its ID');
    const id = String(node.id);
    if (ids.has(id)) throw new Error(`Duplicate category ID: ${id}`);
    ids.add(id);
    const childKey = ['categories', 'category', 'sub'].find(key => Array.isArray(node[key]));
    rows.push({ id, parent_id: parent, name: node.name || 'Groceries', position,
      child_key: childKey || null, icon_class: node.class || null });
    (node[childKey] || []).forEach((child, index) => visit(child, id, index));
  }
  visit(tree.groceries);
  return rows;
}

export function categoryTree(rows) {
  if (new Set(rows.map(r => r.id)).size !== rows.length || rows.some(r => !/^\d+$/.test(r.id))) {
    throw new Error('Invalid or duplicate category IDs');
  }
  const nodes = new Map(rows.map(row => [row.id, { ...(row.parent_id ? { name: row.name } : {}), id: Number(row.id),
    ...(row.icon_class ? { class: row.icon_class } : {}), ...(row.child_key ? { [row.child_key]: [] } : {}) }]));
  const roots = rows.filter(row => !row.parent_id);
  if (roots.length !== 1) throw new Error('Expected one grocery category root');
  const byId = new Map(rows.map(row => [row.id, row]));
  for (const row of [...rows].sort((a, b) => a.position - b.position)) {
    if (!row.parent_id) continue;
    const parent = byId.get(row.parent_id);
    if (!parent?.child_key) throw new Error('Invalid parent category');
    nodes.get(parent.id)[parent.child_key].push(nodes.get(row.id));
  }
  const tree = { groceries: nodes.get(roots[0].id) };
  if (flattenCategories(tree).length !== rows.length) throw new Error('Disconnected category tree');
  return tree;
}
