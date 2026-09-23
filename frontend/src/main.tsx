import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CatalogProvider, ComparisonProvider } from '@/lib/state';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Layout } from '@/components/layout';
import { HomePage } from '@/pages/home';
import { CatalogPage, CategoriesPage } from '@/pages/catalog';
import { ComparePage, ExternalPage, NotFoundPage, ProductPage, SolutionsPage } from '@/pages/details';
import './styles.css';

function PageTitle() {
  const { pathname } = useLocation();
  useEffect(() => { document.title = 'Grceri — Find your favorite groceries'; }, [pathname]);
  return null;
}
function App() {
  return <BrowserRouter><CatalogProvider><ComparisonProvider><TooltipProvider><PageTitle /><Routes><Route element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="groceries" element={<CategoriesPage />} />
    <Route path="groceries/all" element={<CatalogPage />} />
    <Route path="groceries/search" element={<CatalogPage />} />
    <Route path="groceries/compare" element={<ComparePage />} />
    <Route path="groceries/*" element={<CatalogPage />} />
    <Route path="grocery/:cat/:product" element={<ProductPage />} />
    <Route path="grocery/:cat/:product/*" element={<Navigate to="/groceries/all" replace />} />
    <Route path="solutions" element={<Navigate to="/solutions/parents" replace />} />
    <Route path="solutions/:audience" element={<SolutionsPage />} />
    {['login', 'register', 'sign-up', 'forgot-password', 'reset-password', 'callback', 'user', 'pricing', 'membership', 'checkout', 'payment', 'cart', 'lists', 'watchlists'].map(path => <Route key={path} path={`${path}/*`} element={<Navigate to="/groceries/all" replace />} />)}
    {['blog', 'policies', 'mobile-app'].map(path => <Route key={path} path={`${path}/*`} element={<ExternalPage />} />)}
    <Route path="*" element={<NotFoundPage />} />
  </Route></Routes></TooltipProvider></ComparisonProvider></CatalogProvider></BrowserRouter>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
