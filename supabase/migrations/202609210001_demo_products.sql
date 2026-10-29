-- Isolated, disposable catalog for frontend previews. Does not modify legacy tables.
begin;
create schema if not exists grceri;
grant usage on schema grceri to anon, authenticated, service_role;
create table if not exists grceri.demo_products (
  id text primary key,
  source text not null,
  source_id text not null,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz not null default now(),
  unique (source, source_id)
);
alter table grceri.demo_products enable row level security;
revoke all on grceri.demo_products from anon, authenticated;
grant select on grceri.demo_products to anon, authenticated;
grant all on grceri.demo_products to service_role;
drop policy if exists "Read temporary catalog" on grceri.demo_products;
create policy "Read temporary catalog" on grceri.demo_products
  for select to anon, authenticated using (true);
comment on table grceri.demo_products is 'Temporary public product data for UI previews; no personal data.';
commit;
