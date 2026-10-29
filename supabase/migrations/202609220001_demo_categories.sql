begin;
create schema if not exists grceri;
grant usage on schema grceri to anon, authenticated, service_role;
create table if not exists grceri.demo_categories (
  id text primary key,
  parent_id text references grceri.demo_categories(id),
  name text not null,
  position integer not null check (position >= 0),
  child_key text check (child_key in ('categories', 'category', 'sub')),
  icon_class text,
  updated_at timestamptz not null default now()
);
create index if not exists demo_categories_parent_idx on grceri.demo_categories(parent_id);
create index if not exists demo_products_category_idx on grceri.demo_products ((payload->>'cat_id'));
alter table grceri.demo_categories enable row level security;
revoke all on grceri.demo_categories from anon, authenticated;
grant select on grceri.demo_categories to anon, authenticated;
grant all on grceri.demo_categories to service_role;
drop policy if exists "Read temporary categories" on grceri.demo_categories;
create policy "Read temporary categories" on grceri.demo_categories
  for select to anon, authenticated using (true);
comment on table grceri.demo_categories is 'Public demo taxonomy; parent links and order preserve the frontend navigation tree.';
commit;
