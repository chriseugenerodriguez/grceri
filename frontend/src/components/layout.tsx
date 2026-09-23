import { OriginalFooter } from './original-surfaces';
import { OriginalHeader } from './original-header';
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { PERSONAL_SITE } from '@/lib/catalog';

export function Layout() {
  const { pathname, search } = useLocation();
  const query = new URLSearchParams(search).get('q');
  const page = new URLSearchParams(search).get('page');
  useEffect(() => { window.scrollTo(0, 0); }, [pathname, query, page]);
  return <>
    <a href="#main" className="sr-only z-50 bg-white p-4 focus:not-sr-only focus:fixed">Skip to content</a>
    <OriginalHeader />
    <main id="main" tabIndex={-1} className="min-h-[65vh] outline-none"><Outlet /></main>
    <OriginalFooter />
  </>;
}
