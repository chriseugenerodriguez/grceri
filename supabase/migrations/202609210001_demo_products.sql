-- Isolated, disposable catalog for frontend previews. Does not modify legacy tables.
begin;
create table if not exists public.demo_products (
  id text primary key,
  source text not null,
  source_id text not null,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz not null default now(),
  unique (source, source_id)
);
alter table public.demo_products enable row level security;
revoke all on public.demo_products from anon, authenticated;
grant select on public.demo_products to anon, authenticated;
grant all on public.demo_products to service_role;
drop policy if exists "Read temporary catalog" on public.demo_products;
create policy "Read temporary catalog" on public.demo_products
  for select to anon, authenticated using (true);
comment on table public.demo_products is 'Temporary public product data for UI previews; no personal data.';
commit;
