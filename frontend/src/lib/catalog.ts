export type Product = {
  sem3_id: string; name: string; category: string; cat_id: string; brand: string;
  price: number; price_currency?: string; rating?: number; upc?: string;
  description?: string; size?: string; images: string[]; source_name?: string;
};
export type Category = { id: number; name?: string; class?: string; categories?: Category[]; category?: Category[]; sub?: Category[] };
export type Tree = { groceries: Category };
export type CategoryEntry = { node: Category; path: string; parents: Category[]; ids: Set<string> };
export const PERSONAL_SITE = 'https://chriseugenerodriguez.com/';
export const PAGE_SIZE = 24;
export const slug = (value: string) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-');
export const productUrl = (p: Product) => `/grocery/${slug(p.category)}/${slug(p.name)}`;
export const children = (node: Category) => node.categories || node.category || node.sub || [];
export const money = (p: Product) => new Intl.NumberFormat('en-US', { style: 'currency', currency: p.price_currency || 'USD' }).format(p.price);
export const normalizeSearch = (text: string) => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export function categoryEntries(tree: Tree): CategoryEntry[] {
  const entries: CategoryEntry[] = [];
  function visit(node: Category, parents: Category[], path: string) {
    const ids = new Set([String(node.id)]);
    const entry = { node, parents, path, ids };
    entries.push(entry);
    for (const child of children(node)) {
      const nested = visit(child, [...parents, node], `${path}/${slug(child.name || '')}`);
      nested.forEach(id => ids.add(id));
    }
    return ids;
  }
  for (const node of children(tree.groceries)) visit(node, [], `/groceries/${slug(node.name || '')}`);
  return entries;
}
export function searchProducts(products: Product[], entries: CategoryEntry[], query: string) {
  const names = new Map(entries.map(e => [String(e.node.id), [...e.parents, e.node].map(n => n.name).join(' ')]));
  const words = normalizeSearch(query).split(' ').filter(Boolean);
  return products.filter(p => {
    const text = normalizeSearch(`${p.name} ${p.brand} ${p.category} ${p.upc || ''} ${names.get(String(p.cat_id)) || ''}`);
    return words.every(word => text.includes(word));
  });
}
export type Filters = { brands: string[]; categories: string[]; min: number | null; max: number | null; rating: number | null; sort: string };
export function filterProducts(products: Product[], entries: CategoryEntry[], filters: Filters) {
  const ids = new Set<string>();
  for (const id of filters.categories) entries.find(e => String(e.node.id) === id)?.ids.forEach(id => ids.add(id));
  const filtered = products.filter(p => (!filters.brands.length || filters.brands.includes(p.brand)) &&
    (!filters.categories.length || ids.has(String(p.cat_id))) && (filters.min === null || p.price >= filters.min) &&
    (filters.max === null || p.price <= filters.max) && (filters.rating === null || Number(p.rating || 0) >= filters.rating));
  if (filters.sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (filters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (filters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (filters.sort === 'rating') filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  return filtered;
}
export function pageOf<T>(items: T[], requested: string | null) {
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const n = Number(requested);
  const page = Number.isSafeInteger(n) && n > 0 ? Math.min(n, pages) : 1;
  return { page, pages, items: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    start: items.length ? (page - 1) * PAGE_SIZE + 1 : 0, end: Math.min(page * PAGE_SIZE, items.length) };
}
export function readComparison(storage: Pick<Storage, 'getItem'>): string[] {
  try {
    const value = JSON.parse(storage.getItem('compare') || '[]');
    return Array.isArray(value) ? [...new Set(value.map(p => typeof p === 'string' ? p : p?.sem3_id).filter((id): id is string => typeof id === 'string'))] : [];
  } catch { return []; }
}
