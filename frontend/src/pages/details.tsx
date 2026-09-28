import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Trash2, ExternalLink, Leaf, Search, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CatalogGate, CompareButton, Crumbs, EmptyState, ProductImage, ProductRow, Rating } from '@/components/shared';
import { useCatalog, useComparison } from '@/lib/state';
import { money, PERSONAL_SITE, productUrl, slug } from '@/lib/catalog';

export function ProductPage() { return <CatalogGate><ProductDetails /></CatalogGate>; }
function ProductDetails() {
  const { cat, product: productSlug } = useParams(); const { products, entries } = useCatalog();
  const product = products.find(p => slug(p.category) === cat && slug(p.name) === productSlug);
  useEffect(() => { document.title = product ? `${product.name} - Grceri` : 'Product not found - Grceri'; }, [product]);
  if (!product) return <NotFoundPage />;
  const category = entries.find(e => String(e.node.id) === String(product.cat_id));
  const related = products.filter(p => p.sem3_id !== product.sem3_id && p.category === product.category).slice(0, 12);
  return <div className="restored-product" data-testid="product-detail"><div className="product-breadcrumb"><div className="restored-container"><Crumbs items={[{ name: 'Groceries', path: '/groceries' }, ...(category ? [...category.parents, category.node].map(node => ({ name: node.name || '', path: entries.find(e => String(e.node.id) === String(node.id))?.path })) : [{ name: product.category }]), { name: product.name }]} /></div></div>
    <div className="restored-container"><div className="original-product-summary"><div className="original-product-photo"><ProductImage product={product} className="detail-image" /></div><div className="original-product-meta"><h1>{product.name}</h1><Rating value={product.rating} /><p>{product.brand}</p>{product.upc && <p>Grceri # {product.upc}</p>}<p className="original-product-price">{money(product)}</p><Separator /><p className="my-5 text-sm text-muted-foreground">Sample product · Preview only</p><Separator /><div className="mt-5"><CompareButton product={product} /></div></div></div>
    <Separator className="my-10" /><ProductRow href={entries.find(e => !e.parents.length && e.node.name === product.category)?.path} title="Related groceries" products={related.length ? related : products.filter(p => p.sem3_id !== product.sem3_id).slice(0, 8)} />
    <Separator className="my-10" /><section className="original-product-section"><h2>Overview</h2><div className="original-product-overview"><div><h3>Product Details</h3><Separator /><dl><dt>Brand:</dt><dd>{product.brand || 'Not provided'}</dd><dt>Category:</dt><dd>{category ? <Link to={category.path}>{product.category}</Link> : product.category}</dd>{product.size && <><dt>Size:</dt><dd>{product.size}</dd></>}</dl></div><div><h3>Description</h3><Separator /><p>{product.description || `${product.name} from the Grceri preview catalog.`}</p></div></div></section><section className="original-product-section"><h2>Nutritional Facts</h2><p>Verified nutrition and allergen information is unavailable for this sample product. Refer to the product packaging.</p></section><section className="original-product-section"><h2>Ratings &amp; Reviews</h2><p>Reviews are unavailable in this public preview.</p></section></div></div>;

}
export function ComparePage() {
  const { products } = useCatalog(); const { ids, remove, clear } = useComparison();
  const selected = ids.map(id => products.find(p => p.sem3_id === id)).filter(p => p !== undefined);
  return <CatalogGate><div className="page-width py-8" data-testid="comparison"><Crumbs items={[{ name: 'Compare products' }]} /><div className="mb-7 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-4xl">Compare your finds</h1><p className="mt-3 text-muted-foreground">Your selections are saved in this browser.</p></div>{selected.length > 0 && <Button variant="outline" onClick={clear}><Trash2 />Clear comparison</Button>}</div>
    {!selected.length ? <EmptyState title="You have no items to compare" detail="Add products to comparison as you browse the catalog." /> : <Card className="overflow-hidden py-0 shadow-none"><Table><TableHeader><TableRow><TableHead className="min-w-28">Product</TableHead>{selected.map(p => <TableHead key={p.sem3_id} className="min-w-56 max-w-72 whitespace-normal py-6"><ProductImage product={p} /><Link className="mt-3 block text-foreground hover:text-primary" to={productUrl(p)}>{p.name}</Link><Button variant="ghost" size="sm" className="mt-3" aria-label={`Remove ${p.name} from comparison`} onClick={() => remove(p.sem3_id)}><Trash2 />Remove</Button></TableHead>)}</TableRow></TableHeader><TableBody>
      <TableRow><TableCell>Sample price</TableCell>{selected.map(p => <TableCell key={p.sem3_id} className="text-lg font-semibold">{money(p)}</TableCell>)}</TableRow>
      <TableRow><TableCell>Brand</TableCell>{selected.map(p => <TableCell key={p.sem3_id}>{p.brand}</TableCell>)}</TableRow>
      <TableRow><TableCell>Category</TableCell>{selected.map(p => <TableCell key={p.sem3_id} className="whitespace-normal">{p.category}</TableCell>)}</TableRow>
      <TableRow><TableCell>Rating</TableCell>{selected.map(p => <TableCell key={p.sem3_id}><Rating value={p.rating} /></TableCell>)}</TableRow>
      <TableRow><TableCell>Size</TableCell>{selected.map(p => <TableCell key={p.sem3_id}>{p.size || 'Not provided'}</TableCell>)}</TableRow>
    </TableBody></Table></Card>}
  </div></CatalogGate>;
}
const audiences: Record<string, { title: string; description: string; cards: string[] }> = {
  parents: { title: 'Make everyday shopping simpler.', description: 'Discover familiar favorites for the family and compare your grocery finds in one place.', cards: ['Find family favorites', 'Explore everyday staples', 'Compare your options'] },
  cooks: { title: 'Find your next great ingredient.', description: 'From pantry staples to specialty ingredients, explore groceries for the meals you love to make.', cards: ['Discover new ingredients', 'Browse the pantry', 'Keep your finds together'] },
  hosts: { title: 'Bring something good to the table.', description: 'Explore snacks, drinks, and ingredients for your next gathering.', cards: ['Plan the spread', 'Discover something different', 'Compare before you choose'] },
  students: { title: 'Good food for busy days.', description: 'Find everyday basics and compare sample prices while exploring simple meal ideas.', cards: ['Find the essentials', 'Explore easy staples', 'Compare sample prices'] }
};
export function SolutionsPage() {
  const { audience = 'parents' } = useParams(); const content = audiences[audience];
  if (!content) return <NotFoundPage />;
  return <div className="solutions-page page-width"><section className="solutions-hero"><div className="solutions-hero-copy"><p className="solutions-eyebrow">A simpler way to shop</p><Badge variant="secondary">For {audience}</Badge><h1>{content.title}</h1><p className="solutions-lede">{content.description}</p><Button asChild size="lg"><Link to="/groceries/all">Explore the catalog <ArrowRight /></Link></Button></div><div className="solutions-hero-note"><Leaf aria-hidden="true" /><p>Compare everyday products, discover new favorites, and make more confident choices from one focused catalog.</p></div></section><section className="solutions-path"><div><p className="solutions-eyebrow">Find your path</p><h2>Grceri for the way you shop.</h2></div><Tabs value={audience}><TabsList>{Object.keys(audiences).map(name => <TabsTrigger value={name} key={name} asChild><Link to={`/solutions/${name}`} className="capitalize">{name}</Link></TabsTrigger>)}</TabsList></Tabs></section><section className="solutions-benefits"><div className="solutions-section-intro"><p className="solutions-eyebrow">Made for real routines</p><h2>Everything you need to get started.</h2></div><div className="solutions-benefit-list">{content.cards.map((title, index) => { const Icon = [Search, Leaf, Scale][index]; return <article key={title}><Icon aria-hidden="true" /><div><h3>{title}</h3><p>Browse our sample grocery collection without an account.</p><Link to="/groceries/all">Start browsing <ArrowRight /></Link></div></article>; })}</div></section><div className="solutions-footer-link"><a href={PERSONAL_SITE}>Learn more about Grceri <ExternalLink /></a></div></div>;
}
export function ExternalPage() {
  useEffect(() => { window.location.replace(PERSONAL_SITE); }, []);
  return <div className="page-width py-16"><Button asChild><a href={PERSONAL_SITE}>Continue to Chris Rodriguez website <ExternalLink /></a></Button></div>;
}
export function NotFoundPage() { return <div className="page-width py-14"><Badge variant="secondary">404</Badge><h1 className="mt-5 text-4xl">This page is not on the shelf.</h1><p className="my-6 text-muted-foreground">The link may have moved. Let's find something else.</p><Button asChild><Link to="/groceries/all">Browse groceries <ArrowRight /></Link></Button></div>; }
