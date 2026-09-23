export const CATALOG_PAGE_SIZE = 24;

export function searchText(value: any): string {
  return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function catalogIndex(products: any[], tree: any) {
  const paths = new Map<string, string>();
  function visit(node: any, parents: string[] = []) {
    const names = [...parents, node.name || ''];
    paths.set(String(node.id), names.join(' '));
    (node.categories || node.category || node.sub || []).forEach(child => visit(child, names));
  }
  visit(tree.groceries);
  return products.map(product => ({ product, text: searchText([
    product.name, product.brand, product.category, product.upc, paths.get(String(product.cat_id))
  ].filter(Boolean).join(' ')) }));
}

export function catalogPage(index: ReturnType<typeof catalogIndex>, query: string, requestedPage: any) {
  const words = searchText(query).split(' ').filter(Boolean);
  const matches = index.filter(item => words.every(word => item.text.includes(word)));
  const total = matches.length;
  const pages = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
  const requested = Number(requestedPage);
  const page = Number.isSafeInteger(requested) && requested > 0 ? Math.min(requested, pages) : 1;
  const offset = (page - 1) * CATALOG_PAGE_SIZE;
  return { query, total, pages, page, start: total ? offset + 1 : 0, end: Math.min(offset + CATALOG_PAGE_SIZE, total),
    products: matches.slice(offset, offset + CATALOG_PAGE_SIZE).map(item => item.product), error: '' };
}
