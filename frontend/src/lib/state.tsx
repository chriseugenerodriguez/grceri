import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { categoryEntries, readComparison, type Product, type Tree } from './catalog';

function useCatalogState() {
  const [products, setProducts] = useState<Product[]>([]);
  const [tree, setTree] = useState<Tree>({ groceries: { id: 18203, categories: [] } });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    async function json(path: string) {
      const response = await fetch(path, { signal: controller.signal });
      if (!response.ok) throw new Error('Catalog unavailable');
      return response.json();
    }
    Promise.all([json('/assets/json/products-demo.json'), json('/assets/json/category.json')]).then(([products, tree]) => {
      if (!Array.isArray(products) || !tree?.groceries?.categories) throw new Error('Invalid catalog');
      setProducts(products); setTree(tree);
    }).catch(error => { if (error.name !== 'AbortError') setError('The catalog could not load. Please try again.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  const entries = useMemo(() => categoryEntries(tree), [tree]);
  return { products, tree, entries, error, loading, retry: () => setAttempt(n => n + 1) };
}
const CatalogContext = createContext<ReturnType<typeof useCatalogState> | null>(null);
export function CatalogProvider({ children }: { children: ReactNode }) { return <CatalogContext.Provider value={useCatalogState()}>{children}</CatalogContext.Provider>; }
export function useCatalog() { const value = useContext(CatalogContext); if (!value) throw new Error('Missing catalog provider'); return value; }

function useComparisonState() {
  const [ids, setIds] = useState<string[]>(() => { try { return readComparison(localStorage); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem('compare', JSON.stringify(ids)); } catch { /* Comparison still works in memory. */ } }, [ids]);
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === 'compare' || event.key === null) { try { setIds(readComparison(localStorage)); } catch { setIds([]); } } };
    window.addEventListener('storage', sync); return () => window.removeEventListener('storage', sync);
  }, []);
  return { ids, toggle: (id: string) => setIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]),
    remove: (id: string) => setIds(ids => ids.filter(i => i !== id)), clear: () => setIds([]) };
}
const ComparisonContext = createContext<ReturnType<typeof useComparisonState> | null>(null);
export function ComparisonProvider({ children }: { children: ReactNode }) { return <ComparisonContext.Provider value={useComparisonState()}>{children}</ComparisonContext.Provider>; }
export function useComparison() { const value = useContext(ComparisonContext); if (!value) throw new Error('Missing comparison provider'); return value; }
