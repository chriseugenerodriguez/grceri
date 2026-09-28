import { HoverMenu } from '@/components/original-header';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useEffect, useId, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { useCatalog } from '@/lib/state';
import { children, filterProducts, pageOf, searchProducts, type Product, type CategoryEntry, type Filters } from '@/lib/catalog';
import { CatalogGate, Crumbs, EmptyState, Pages, ProductCard, SearchForm } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const numberParam = (value: string | null) => value !== null && value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : null;
function CheckOption({ name, count, checked, change }: { name: string; count: number; checked: boolean; change: () => void }) {
  const id = useId();
  return <div className="flex items-start gap-2 py-2"><Checkbox id={id} checked={checked} disabled={!count && !checked} onCheckedChange={change} className="mt-0.5" /><Label htmlFor={id} className="min-w-0 flex-1 cursor-pointer text-sm font-normal leading-relaxed">{name} <span className="text-muted-foreground">({count})</span></Label></div>;
}
function FilterPanel({ base, entry, entries, filters }: { base: Product[]; entry?: CategoryEntry; entries: CategoryEntry[]; filters: Filters }) {
  const [params, setParams] = useSearchParams(); const prefix = useId();
  const [brandQuery, setBrandQuery] = useState('');
  const [min, setMin] = useState(params.get('min') || ''); const [max, setMax] = useState(params.get('max') || '');
  const savedMin = params.get('min') || ''; const savedMax = params.get('max') || '';
  useEffect(() => { setMin(savedMin); setMax(savedMax); }, [savedMin, savedMax]);
  const invalid = (min !== '' && numberParam(min) === null) || (max !== '' && numberParam(max) === null) || (min !== '' && max !== '' && Number(min) > Number(max));
  const change = (key: string, value: string) => { const next = new URLSearchParams(params); const values = next.getAll(key); next.delete(key); for (const v of values.includes(value) ? values.filter(v => v !== value) : [...values, value]) next.append(key, v); next.delete('page'); setParams(next); };
  const categories = entry ? children(entry.node).map(node => entries.find(e => e.node.id === node.id)!).filter(Boolean) : entries.filter(e => !e.parents.length);
  const brands = [...new Set(base.map(p => p.brand).filter(Boolean))].sort();
  const categoryMatches = filterProducts(base, entries, { ...filters, categories: [] });
  const brandMatches = filterProducts(base, entries, { ...filters, brands: [] });
  const priceMatches = filterProducts(base, entries, { ...filters, min: null, max: null });
  const ranges: [number, number | null][] = [[0,4.99],[5,9.99],[10,19.99],[20,29.99],[30,39.99],[40,49.99],[50,74.99],[75,99.99],[100,null]];
  const ratingMatches = filterProducts(base, entries, { ...filters, rating: null });
  const clearPrice = () => { const next = new URLSearchParams(params); next.delete('min'); next.delete('max'); next.delete('page'); setParams(next); setMin(''); setMax(''); };
  return <div className="restored-sidebar space-y-4" data-testid="filters"><div className="flex items-center justify-between"><h2 className="text-xl">Filters</h2><Button variant="ghost" size="sm" onClick={() => { const next = new URLSearchParams(params); for (const key of ['brand', 'category', 'rating', 'min', 'max', 'page']) next.delete(key); setParams(next); setMin(''); setMax(''); setBrandQuery(''); }}>Reset</Button></div>
    <Accordion type="multiple" defaultValue={['category', 'brand', 'price', 'rating']}>
      {categories.length > 0 && <AccordionItem value="category"><AccordionTrigger>Category</AccordionTrigger><AccordionContent className="max-h-80 overflow-y-auto">{categories.map(e => <CheckOption key={e.node.id} name={e.node.name || ''} count={categoryMatches.filter(p => e.ids.has(String(p.cat_id))).length} checked={filters.categories.includes(String(e.node.id))} change={() => change('category', String(e.node.id))} />)}</AccordionContent></AccordionItem>}
      <AccordionItem value="brand"><AccordionTrigger>Brand</AccordionTrigger><AccordionContent><Label htmlFor={`${prefix}-brand`} className="sr-only">Find a brand</Label><Input id={`${prefix}-brand`} placeholder="Find a brand" value={brandQuery} onChange={e => setBrandQuery(e.target.value)} className="mb-3" /><div className="max-h-72 overflow-y-auto">{brands.filter(brand => brand.toLowerCase().includes(brandQuery.trim().toLowerCase())).map(brand => <CheckOption key={brand} name={brand} count={brandMatches.filter(p => p.brand === brand).length} checked={filters.brands.includes(brand)} change={() => change('brand', brand)} />)}{!brands.some(brand => brand.toLowerCase().includes(brandQuery.trim().toLowerCase())) && <p className="py-2 text-sm text-muted-foreground">No matching brands</p>}</div></AccordionContent></AccordionItem>
      <AccordionItem value="price"><AccordionTrigger>Price</AccordionTrigger><AccordionContent><form onSubmit={event => { event.preventDefault(); if (invalid) return; const next = new URLSearchParams(params); for (const [key, value] of [['min', min], ['max', max]]) { if (value !== '') next.set(key, value); else next.delete(key); } next.delete('page'); setParams(next); }} className="space-y-3">
        <div className="grid grid-cols-2 gap-2"><div><Label htmlFor={`${prefix}-min`} className="mb-2">Minimum price</Label><Input id={`${prefix}-min`} type="number" min="0" step="0.01" placeholder="0" value={min} onChange={e => setMin(e.target.value)} /></div><div><Label htmlFor={`${prefix}-max`} className="mb-2">Maximum price</Label><Input id={`${prefix}-max`} type="number" min="0" step="0.01" placeholder="Any" value={max} onChange={e => setMax(e.target.value)} /></div></div>
        {invalid && <p role="alert" className="text-sm text-destructive">Use nonnegative prices with the minimum no greater than the maximum.</p>}
        <Button type="submit" disabled={invalid || (min === '' && max === '')} className="w-full">Apply price range</Button>
        {(min !== '' || max !== '' || filters.min !== null || filters.max !== null) && <Button type="button" variant="outline" className="w-full" onClick={clearPrice}>Clear price filter</Button>}
      </form><div className="mt-4">{ranges.map(([low,high])=>{const count=priceMatches.filter(p=>p.price>=low&&(high===null||p.price<=high)).length; const checked=filters.min===low&&filters.max===high; return count || checked ? <CheckOption key={low} name={high===null ? `$${low} and up` : `$${low} - $${high}`} count={count} checked={checked} change={()=>{const next=new URLSearchParams(params);next.delete('page');if(checked){next.delete('min');next.delete('max');}else{next.set('min',String(low));if(high===null)next.delete('max');else next.set('max',String(high));}setParams(next);}} /> : null;})}</div></AccordionContent></AccordionItem>

      <AccordionItem value="rating"><AccordionTrigger>Rating</AccordionTrigger><AccordionContent>{[5, 4, 3, 2, 1].map(rate => <CheckOption key={rate} name={`${rate} stars & up`} count={ratingMatches.filter(p => Number(p.rating || 0) >= rate).length} checked={filters.rating === rate} change={() => { const next = new URLSearchParams(params); if (filters.rating === rate) next.delete('rating'); else next.set('rating', String(rate)); next.delete('page'); setParams(next); }} />)}</AccordionContent></AccordionItem>
    </Accordion>
  </div>;
}
export function CatalogPage() { return <CatalogGate><CatalogResults /></CatalogGate>; }
function CatalogResults() {
  const { products, entries } = useCatalog(); const { pathname } = useLocation(); const [params, setParams] = useSearchParams();
  const entry = entries.find(e => e.path === pathname);
  const general = pathname === '/groceries/all' || pathname === '/groceries/search';
  const query = params.get('q')?.trim() || '';
  const base = useMemo(() => searchProducts(entry ? products.filter(p => entry.ids.has(String(p.cat_id))) : products, entries, query), [products, entries, entry, query]);
  const filters: Filters = { brands: params.getAll('brand'), categories: params.getAll('category'), min: numberParam(params.get('min')), max: numberParam(params.get('max')), rating: numberParam(params.get('rating')), sort: params.get('sort') || 'default' };
  const filtered = filterProducts(base, entries, filters); const page = pageOf(filtered, params.get('page'));
  const list = params.get('view') === 'list';
  const setParam = (key: string, value: string) => { const next = new URLSearchParams(params); next.set(key, value); next.delete('page'); setParams(next); };
  const heading = entry?.node.name || (query ? 'Search groceries' : 'Browse groceries');
  const activeFilters = [
    ...filters.brands.map(value => ({ key: 'brand', value, label: value })),
    ...filters.categories.map(value => ({ key: 'category', value, label: entries.find(e => String(e.node.id) === value)?.node.name || value })),
    ...(filters.min !== null ? [{ key: 'min', value: String(filters.min), label: `Min $${filters.min}` }] : []),
    ...(filters.max !== null ? [{ key: 'max', value: String(filters.max), label: `Max $${filters.max}` }] : []),
    ...(filters.rating !== null ? [{ key: 'rating', value: String(filters.rating), label: `${filters.rating} stars & up` }] : [])
  ];
  useEffect(() => { document.title = `${heading} - Grceri`; }, [heading]);
  if (!general && !entry) return <div className="page-width py-12"><EmptyState title="Category not found" detail="That category link is no longer available." /></div>;
  return <div className="page-width pb-8" data-testid="catalog">
    <Crumbs items={[{ name: 'Groceries', path: '/groceries' }, ...(entry ? entry.parents.map(node => ({ name: node.name || '', path: entries.find(e => e.node.id === node.id)?.path })) : []), { name: heading || '' }]} />
    <div className="mb-7"><div className="catalog-heading-row"><div><h1 className="text-3xl sm:text-4xl">{heading}</h1><p className="mt-3 text-muted-foreground">Explore the sample catalog. Prices are for demonstration.</p></div><SearchForm /></div></div>
    <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden lg:block" aria-label="Product filters"><FilterPanel key={pathname} base={base} entry={entry} entries={entries} filters={filters} /></aside>
      <section className="min-w-0"><div className="mb-6 flex flex-wrap items-center gap-3">
        <p role="status" className="mr-auto text-sm">{filtered.length} products{query && <> matching “{query}”</>}{filtered.length > 0 && <>. Showing {page.start}–{page.end}.</>}</p>
        <Sheet key={pathname}><SheetTrigger asChild><Button variant="outline" className="lg:hidden"><SlidersHorizontal />Filters{activeFilters.length > 0 && <span className="catalog-filter-count">{activeFilters.length}</span>}</Button></SheetTrigger><SheetContent side="left" className="w-[min(90vw,360px)] overflow-y-auto"><SheetHeader><SheetTitle>Refine your groceries</SheetTitle><SheetDescription>Filter by category, brand, price or rating.</SheetDescription></SheetHeader><div className="px-5 pb-8"><FilterPanel key={pathname} base={base} entry={entry} entries={entries} filters={filters} /></div><div className="sticky bottom-0 border-t bg-background p-4"><SheetClose asChild><Button className="w-full">Show {filtered.length} products</Button></SheetClose></div></SheetContent></Sheet>
        <Select value={filters.sort} onValueChange={v => setParam('sort', v)}><SelectTrigger aria-label="Sort products" className="h-10 w-52 shrink-0"><SelectValue /></SelectTrigger><SelectContent>{[['default', 'Default sorting'], ['name', 'Name: A to Z'], ['price-asc', 'Price: Low to High'], ['price-desc', 'Price: High to Low'], ['rating', 'Highest rated']].map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>
        <ToggleGroup type="single" value={list ? 'list' : 'grid'} onValueChange={v => v && setParam('view', v)} variant="outline" aria-label="Product layout"><ToggleGroupItem value="grid" aria-label="Grid view"><LayoutGrid className="size-4" /></ToggleGroupItem><ToggleGroupItem value="list" aria-label="List view"><List className="size-4" /></ToggleGroupItem></ToggleGroup>
      </div>
      {activeFilters.length > 0 && <div className="mb-4 flex flex-wrap gap-2" aria-label="Active filters">{activeFilters.map(filter => <Button key={`${filter.key}-${filter.value}`} size="sm" variant="secondary" aria-label={`Remove filter ${filter.label}`} onClick={() => { const next = new URLSearchParams(params); next.delete(filter.key, filter.value); next.delete('page'); setParams(next); }}>{filter.label}<X className="size-3" /></Button>)}<Button size="sm" variant="ghost" onClick={() => { const next = new URLSearchParams(params); for (const key of ['brand', 'category', 'rating', 'min', 'max', 'page']) next.delete(key); setParams(next); }}><X />Clear all filters</Button></div>}
      {filters.min !== null && filters.max !== null && filters.min > filters.max && <Alert variant="destructive" className="mb-5"><AlertDescription>The minimum price is greater than the maximum. Clear the price filter or adjust the range.</AlertDescription></Alert>}
      {!filtered.length ? <EmptyState title="No products found" detail={entry && !base.length ? 'There are no sample products in this category yet.' : 'Try another search or adjust your filters.'}>{(activeFilters.length > 0 || query) && <div className="flex flex-wrap justify-center gap-3"><Button variant="outline" onClick={() => { const next = new URLSearchParams(params); for (const key of ['brand', 'category', 'rating', 'min', 'max', 'q', 'page']) next.delete(key); setParams(next); }}>Clear search and filters</Button><Button asChild><Link to="/groceries/all">Browse all products</Link></Button></div>}</EmptyState> : <div className={list ? 'catalog-list' : 'catalog-grid'} data-testid="product-results">{page.items.map(p => <ProductCard key={p.sem3_id} product={p} />)}</div>}
      <Pages page={page.page} pages={page.pages} />
      </section>
    </div>
  </div>;
}
export function CategoriesPage() {
 const { entries } = useCatalog();
 return <CatalogGate><div className="restored-container category-directory"><Button variant="link" asChild className="px-0"><Link to="/groceries/all">Browse all sample products</Link></Button>{entries.filter(e=>!e.parents.length).map(entry=><section key={entry.node.id}><h2><Link to={entry.path}>{entry.node.name}</Link></h2><div className="category-directory-grid">{children(entry.node).map(node=>{const e=entries.find(e=>String(e.node.id)===String(node.id))!;return <article key={node.id}>{children(node).length ? <HoverMenu label={node.name || ''} arrow><DropdownMenuItem asChild><Link to={e.path}>All {node.name}</Link></DropdownMenuItem>{children(node).map(child=><DropdownMenuItem asChild key={child.id}><Link to={entries.find(e=>String(e.node.id)===String(child.id))!.path}>{child.name}</Link></DropdownMenuItem>)}</HoverMenu>:<Link to={e.path}>{node.name}</Link>}</article>})}</div></section>)}</div></CatalogGate>;
}
