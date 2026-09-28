import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, X, Scale, Check, AlertCircle, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useCatalog, useComparison } from '@/lib/state';
import { money, productUrl, type Product } from '@/lib/catalog';
import { Fragment } from 'react';

export function SearchForm({ large = false }: { large?: boolean }) {
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('q') || '');
  const navigate = useNavigate(); const id = useId(); const input = useRef<HTMLInputElement>(null);
  const savedQuery = params.get('q') || '';
  useEffect(() => setValue(savedQuery), [savedQuery]);
  return <form role="search" className={`search-form flex w-full min-w-0 items-center gap-2 ${large ? 'search-form-large max-w-xl rounded-xl bg-white p-2 shadow-lg' : 'search-form-compact'}`} onSubmit={e => { e.preventDefault(); navigate(value.trim() ? `/groceries/search?q=${encodeURIComponent(value.trim())}` : "/groceries/all"); }}>
    <Label htmlFor={id} className="sr-only">Search groceries</Label>
    <div className="relative min-w-0 flex-1"><Input ref={input} id={id} name="query" type="search" value={value} onChange={e => setValue(e.target.value)} placeholder="Search groceries" className={`min-w-0 bg-white pr-10 text-foreground ${large ? 'h-12 border-0 shadow-none' : 'h-11'}`} />
    {value && <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 size-8 -translate-y-1/2" aria-label="Clear search" onClick={() => { setValue(''); input.current?.focus(); }}><X className="size-4" /></Button>}</div>
    <Button type="submit" size={large ? 'lg' : 'icon'} className={'mr-0' + large ? 'h-12 shrink-0' : 'size-11 shrink-0'} aria-label="Search groceries"><Search />{large && <span className="hidden sm:inline">Search</span>}</Button>
  </form>;
}
export function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  return <img className={`product-image ${className}`} src={product.images?.[0] || '/assets/svg/cart.svg'} alt={product.name} loading="lazy" onError={e => { if (!e.currentTarget.src.endsWith('/assets/svg/cart.svg')) e.currentTarget.src = '/assets/svg/cart.svg'; }} />;
}
export function CompareButton({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { ids, toggle } = useComparison(); const selected = ids.includes(product.sem3_id);
  const button = <Button variant={selected ? 'secondary' : 'outline'} size={compact ? 'icon' : 'default'} aria-pressed={selected} aria-label={compact ? `${selected ? 'Remove from' : 'Add to'} comparison: ${product.name}` : undefined} onClick={() => toggle(product.sem3_id)}>
    {selected ? <Check /> : <Scale />}{!compact && (selected ? 'Now Comparing' : 'Add to Compare')}
  </Button>;
  return compact ? <Tooltip><TooltipTrigger asChild>{button}</TooltipTrigger><TooltipContent>{selected ? 'Remove from comparison' : 'Compare product'}</TooltipContent></Tooltip> : button;
}
export function ProductCard({ product }: { product: Product }) {
  return <Card className="h-full min-w-0 gap-3 py-4 shadow-none transition-shadow hover:shadow-md" data-testid="product-card" role="article">
    <Link to={productUrl(product)} className="block px-4"><ProductImage product={product} /></Link>
    <CardContent className="flex flex-1 flex-col gap-3 px-4">
      <p className="truncate text-[11px] font-semibold uppercase tracking-[.12em] text-muted-foreground">{product.brand || product.category}</p>
      <Link to={productUrl(product)} className="product-name text-sm font-semibold leading-relaxed hover:text-primary">{product.name}</Link>
      <div className="flex min-h-6 items-center"><Rating value={product.rating} /></div>
      <div className="mt-auto flex items-center justify-between gap-2"><span className="text-lg font-semibold" data-testid="product-price">{money(product)}</span><CompareButton product={product} compact /></div>
    </CardContent>
  </Card>;
}
export function ProductRow({ title, products, href = '/groceries/all' }: { title: string; products: Product[]; href?: string }) {
  if (!products.length) return null;
  return <section className="page-width py-10"><div className="mb-6 flex items-end justify-between gap-4"><h2 className="text-2xl sm:text-3xl"><Link to={href} className="section-heading-link">{title}<ArrowRight aria-hidden="true" /></Link></h2></div>
    <Carousel opts={{ align: 'start', slidesToScroll: 'auto' }} aria-label={title} tabIndex={0} className="min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-primary"><div className="mb-4 flex items-center justify-end gap-3"><div className="flex shrink-0 gap-2"><CarouselPrevious className="static size-10 translate-y-0" /><CarouselNext className="static size-10 translate-y-0" /></div></div><CarouselContent className="touch-pan-y">{products.slice(0, 9).map((p, index) => <CarouselItem key={p.sem3_id} aria-label={`${index + 1} of ${Math.min(products.length, 9)}`} className="basis-full sm:basis-1/2 lg:basis-1/3"><ProductCard product={p} /></CarouselItem>)}</CarouselContent></Carousel>
  </section>;
}
export function CatalogGate({ children }: { children: ReactNode }) {
  const { loading, error, retry } = useCatalog();
  if (loading) return <div className="page-width py-12" role="status" aria-label="Loading products"><p className="mb-6">Loading products…</p><div className="grid grid-cols-2 gap-6 md:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-64" />)}</div></div>;
  if (error) return <div className="page-width py-12"><Alert variant="destructive"><AlertCircle /><AlertTitle>Catalog unavailable</AlertTitle><AlertDescription>{error}<Button onClick={retry} variant="outline" className="mt-3 w-fit">Try again</Button></AlertDescription></Alert></div>;
  return children;
}
export function EmptyState({ title, detail, children }: { title: string; detail: string; children?: ReactNode }) {
  return <Card className="my-8 border-dashed text-center shadow-none"><CardHeader><CardTitle role="heading" aria-level={2} className="text-xl">{title}</CardTitle></CardHeader><CardContent className="space-y-5"><p className="text-muted-foreground">{detail}</p>{children || <Button asChild><Link to="/groceries/all">Browse all products</Link></Button>}</CardContent></Card>;
}
export function Crumbs({ items }: { items: { name: string; path?: string }[] }) {
  return <Breadcrumb className="py-5"><BreadcrumbList><BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>{items.map((item, i) => <Fragment key={i}><BreadcrumbSeparator /><BreadcrumbItem>{item.path ? <BreadcrumbLink asChild><Link to={item.path}>{item.name}</Link></BreadcrumbLink> : <BreadcrumbPage>{item.name}</BreadcrumbPage>}</BreadcrumbItem></Fragment>)}</BreadcrumbList></Breadcrumb>;
}
export function Pages({ page, pages }: { page: number; pages: number }) {
  const [params] = useSearchParams(); const { pathname } = useLocation(); const navigate = useNavigate();
  const href = (n: number) => { const next = new URLSearchParams(params); next.set('page', String(n)); return `${pathname}?${next}`; };
  const go = (n: number) => (event: React.MouseEvent<HTMLAnchorElement>) => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); navigate(href(n)); };
  if (pages <= 1) return null;
  return <Pagination aria-label="Catalog pages" className="mt-10"><PaginationContent className="flex-wrap gap-3">
    {page > 1 && <PaginationItem><PaginationPrevious aria-label="Previous page" href={href(page - 1)} onClick={go(page - 1)} /></PaginationItem>}
    <PaginationItem><PaginationLink isActive href={href(page)} onClick={go(page)} aria-label={`Page ${page}`} className="w-auto px-4">Page {page} of {pages}</PaginationLink></PaginationItem>
    {page < pages && <PaginationItem><PaginationNext aria-label="Next page" href={href(page + 1)} onClick={go(page + 1)} /></PaginationItem>}
  </PaginationContent></Pagination>;
}
export function Rating({ value }: { value?: number }) { return value ? <Badge variant="secondary" className="gap-1"><Star className="size-3 fill-amber-500 text-amber-500" />{value.toFixed(1)}</Badge> : <span className="text-sm text-muted-foreground">No rating in this snapshot</span>; }
