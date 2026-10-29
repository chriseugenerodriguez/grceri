import type { Product, Tree } from './catalog';
export function loadPersonalCatalog(signal: AbortSignal, fetcher?: typeof fetch): Promise<[Product[], Tree]>;
