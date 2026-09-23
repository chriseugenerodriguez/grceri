import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

// Exercise the actual Angular service with HttpClient doubles, using website dependencies.
const require = createRequire(new URL('../../website/package.json', import.meta.url));
const ts = require('typescript');
const { of, throwError, firstValueFrom } = require('rxjs');
const source = readFileSync(new URL('../../website/src/app/core/services/product.service.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true
} }).outputText;
const exports = {};
vm.runInNewContext(compiled, { exports, require: name => {
  if (name === '@angular/core') return { Injectable: () => target => target };
  if (name.includes('environments/environment')) return { environment: { production: false } };
  return require(name);
} });
const Service = exports.ProductsService;

test('bundled fallback reads flat data and selects the requested product', async () => {
  const products = [
    { category: 'Spices', name: 'Black Pepper' },
    { category: 'Spices', name: 'White Pepper' }
  ];
  const service = new Service({ get: url => url.includes('demo-config')
    ? throwError(() => ({ status: 404 })) : of(products) });
  const result = await firstValueFrom(service.getProduct('spices', 'white-pepper'));
  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'White Pepper');
  assert.equal((await firstValueFrom(service.getProduct('spices', 'missing'))).length, 0);
});

test('loads all Supabase pages with public credentials and caches the result', async () => {
  const calls = [];
  const service = new Service({ get: (url, options) => {
    calls.push({ url, options });
    if (url.includes('demo-config')) return of({ url: 'https://demo.supabase.co', anonKey: 'sb_publishable_test' });
    return of(url.endsWith('offset=0') ? Array.from({ length: 100 }, (_, id) => ({ payload: { name: `Item ${id}` } })) : [{ payload: { name: 'Last' } }]);
  } });
  const result = await firstValueFrom(service.products());
  assert.equal(result.length, 101);
  assert.equal(result[100].name, 'Last');
  await firstValueFrom(service.products());
  assert.equal(calls.length, 3);
  assert.equal(calls[1].options.headers.apikey, 'sb_publishable_test');
  assert.equal(calls[1].options.headers.Authorization, undefined);
});

test('configured database errors are not disguised as local fixture data', async () => {
  const service = new Service({ get: url => url.includes('demo-config')
    ? of({ url: 'https://demo.supabase.co', anonKey: 'sb_publishable_test' })
    : throwError(() => new Error('database unavailable')) });
  await assert.rejects(firstValueFrom(service.products()), /database unavailable/);
});

test('static hosting HTML fallback is treated as an absent optional config', async () => {
  const service = new Service({ get: url => url.includes('demo-config')
    ? throwError(() => ({ status: 200, error: { text: '<!doctype html><html></html>' } }))
    : of([{ name: 'Milk' }]) });
  assert.equal((await firstValueFrom(service.products()))[0].name, 'Milk');
});

test('snapshot mode loads the bundled catalog without live database requests', async () => {
  const calls = [];
  const service = new Service({ get: url => {
    calls.push(url);
    return of(url.includes('demo-config') ? { mode: 'snapshot' } : [{ name: 'Saved product' }]);
  } });
  assert.equal((await firstValueFrom(service.products()))[0].name, 'Saved product');
  assert.deepEqual(calls, ['/assets/demo-config.json', '/assets/json/products-demo.json']);
});

test('category selection includes descendants and excludes unrelated products', async () => {
  const tree = { groceries: { categories: [{ id: 10, category: [{ id: 11, sub: [{ id: 12 }] }] }, { id: 20 }] } };
  const products = [{ name: 'Spice', cat_id: '12' }, { name: 'Other', cat_id: '20' }];
  const service = new Service({ get: url => url.includes('demo-config')
    ? throwError(() => ({ status: 404 })) : of(url.includes('category.json') ? tree : products) });
  assert.equal((await firstValueFrom(service.getProducts('10'))).length, 1);
  assert.equal((await firstValueFrom(service.getProducts('10')))[0].name, 'Spice');
  assert.equal((await firstValueFrom(service.getProducts('missing'))).length, 0);
});

function loadService(path, globals = {}) {
  const serviceExports = {};
  const output = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true }
  }).outputText;
  vm.runInNewContext(output, { ...globals, exports: serviceExports, require: name => {
    if (name === '@angular/core') return { Injectable: () => target => target, Inject: () => () => {}, PLATFORM_ID: 'platform' };
    if (name === '@angular/common') return { isPlatformBrowser: platform => platform === 'browser' };
    return require(name);
  } });
  return serviceExports;
}

test('authentication stays disabled without constructing an SDK or reading old tokens', async () => {
  const { AuthService } = loadService('../../website/src/app/core/services/auth.service.ts');
  const auth = new AuthService();
  assert.equal(auth.isAuthenticated(), false);
  assert.match((await firstValueFrom(auth.login('test@example.com', 'unused'))).description, /unavailable/);
  auth.signup('test@example.com', 'unused');
  auth.renewToken();
  assert.equal(auth.isAuthenticated(), false);
});

test('local comparison storage survives corrupt values and restricted storage', async () => {
  const { LocalStorage } = loadService('../../website/src/app/core/services/localstorage.service.ts', {
    window: { localStorage: { getItem: () => 'invalid-json', setItem: () => { throw new Error('blocked'); }, removeItem: () => { throw new Error('blocked'); } } }
  });
  const storage = new LocalStorage('browser');
  assert.equal((await firstValueFrom(storage.get('compare', []))).length, 0);
  storage.set('compare', [{ sem3_id: 'one' }]);
  assert.equal((await firstValueFrom(storage.get('compare')))[0].sem3_id, 'one');
  storage.remove('compare');
  assert.equal(await firstValueFrom(storage.get('compare')), null);
  assert.equal((await firstValueFrom(new LocalStorage('server').get('compare', []))).length, 0);
});
