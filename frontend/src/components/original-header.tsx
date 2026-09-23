import { DropdownMenu as DropdownPrimitive } from 'radix-ui';
import { useRef, useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from './ui/dropdown-menu';
import { SearchForm } from './shared';
import { useCatalog } from '@/lib/state';
import { children, PERSONAL_SITE, type CategoryEntry } from '@/lib/catalog';

export function HoverMenu({ label, children: content, arrow = false }: { label: string; children: ReactNode; arrow?: boolean }) {
  const [open, setOpen] = useState(false); const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined); const { pathname } = useLocation();
  const enter = () => { clearTimeout(timer.current); setOpen(true); };
  const leave = () => { timer.current = setTimeout(() => setOpen(false), 180); };
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <DropdownMenu modal={false} open={open} onOpenChange={setOpen}><DropdownMenuTrigger asChild><Button variant="ghost" className="original-menu" onPointerEnter={e => { if(e.pointerType==='mouse') enter(); }} onPointerLeave={e => { if(e.pointerType==='mouse') leave(); }} onPointerDown={e => { if(e.pointerType==='mouse') { e.preventDefault(); enter(); } }}>{label}{arrow && <ChevronDown className="size-3" />}</Button></DropdownMenuTrigger><DropdownMenuContent align="start" sideOffset={0} className="restored-dropdown header-dropdown w-64" onPointerEnter={enter} onPointerLeave={leave}><DropdownPrimitive.Arrow className="fill-[#f0f0f0]" width={12} height={7} /><div className="max-h-[75vh] overflow-y-auto">{content}</div></DropdownMenuContent></DropdownMenu>;
}

function CategoryMenu({ entry }: { entry: CategoryEntry }) {
  const { entries } = useCatalog();
  const nested = children(entry.node).map(node => entries.find(e => String(e.node.id) === String(node.id))!).filter(Boolean);
  if (!nested.length) return <DropdownMenuItem asChild><Link to={entry.path}>{entry.node.name}</Link></DropdownMenuItem>;
  return <DropdownMenuSub><DropdownMenuSubTrigger>{entry.node.name}</DropdownMenuSubTrigger><DropdownMenuSubContent className="restored-dropdown max-h-[70vh] w-64 overflow-y-auto"><DropdownMenuItem asChild><Link to={entry.path}>All {entry.node.name}</Link></DropdownMenuItem>{nested.map(e => <CategoryMenu key={e.node.id} entry={e} />)}</DropdownMenuSubContent></DropdownMenuSub>;
}
export function OriginalHeader() {
  const home = useLocation().pathname === '/'; const { entries } = useCatalog();
  return <header className={`original-header ${home ? 'original-header-home' : ''}`}><div className="original-header-inner">
    <Link to="/" aria-label="Grceri home"><img src="/assets/svg/logo.svg" alt="Grceri" className="original-logo" /></Link>
    <nav aria-label="Categories"><HoverMenu label="Categories" arrow><DropdownMenuItem asChild><Link to="/groceries">All categories</Link></DropdownMenuItem>{entries.filter(e => !e.parents.length).map(e => <CategoryMenu key={e.node.id} entry={e} />)}</HoverMenu></nav>
    <div className="original-header-search">{!home && <SearchForm />}</div>
    <nav aria-label="Resources and solutions" className="original-header-right">
      <HoverMenu label="Solutions">{['Parents','Cooks','Hosts','Students'].map(name => <DropdownMenuItem asChild key={name}><Link to={`/solutions/${name.toLowerCase()}`}>For {name}</Link></DropdownMenuItem>)}</HoverMenu>
      <HoverMenu label="Resources">{['Blog','Help Center'].map(name => <DropdownMenuItem asChild key={name}><a href={PERSONAL_SITE}>{name}</a></DropdownMenuItem>)}</HoverMenu>
    </nav>
  </div></header>;
}
