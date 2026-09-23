// Optional: supply PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE when using an existing installation.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.DEMO_URL || 'http://127.0.0.1:4205';
const catalog = require('../../website/src/assets/json/products-demo.json');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE || undefined });
  try {
    const page = await browser.newPage();
    const errors = [];
    const writes = [];
    const externalIntegrations = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && message.text().startsWith('ERROR')) errors.push(message.text());
    });
    page.on('request', request => {
      if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url());
      if (!request.url().startsWith(base) && ['script', 'xhr', 'fetch'].includes(request.resourceType())) externalIntegrations.push(request.url());
    });
    // Keep smoke tests independent of obsolete product-image hosts.
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    const visit = async path => {
      await page.goto(base + path);
      await page.waitForTimeout(350);
      assert.deepEqual(errors, [], `Browser errors at ${path}`);
    };
    await visit('/');
    assert.equal(await page.getByRole('link', { name: 'Log In', exact: true }).count(), 0);
    await page.locator('input[name=query]').fill('frontier');
    await page.locator('input[name=query]').press('Enter');
    await page.waitForURL('**/groceries/search?q=frontier');
    await page.waitForSelector('demo-catalog article');
    assert.ok(await page.locator('demo-catalog article').count() > 0);
    for (const path of ['/login', '/sign-up/basic', '/forgot-password', '/callback', '/user/settings/billing',
      '/pricing/elite', '/checkout', '/cart', '/lists/create']) {
      await visit(path);
      assert.equal(new URL(page.url()).pathname, '/groceries/all');
      assert.equal(await page.locator('demo-catalog article').count(), Math.min(24, catalog.length));
      assert.ok((await page.locator('demo-catalog [role=status]').innerText()).includes(`${catalog.length} products`));
    }
    await visit('/groceries/search?q=no-such-product');
    assert.ok((await page.locator('body').innerText()).includes('No products found'));
    await visit('/groceries/all');
    const firstName = await page.locator('demo-catalog article h2').first().innerText();
    await page.getByRole('link', { name: 'Next page', exact: true }).click();
    await page.waitForURL('**page=2');
    assert.notEqual(await page.locator('demo-catalog article h2').first().innerText(), firstName);
    await page.reload();
    await page.waitForSelector('demo-catalog article');
    assert.ok((await page.locator('demo-catalog [role=status]').innerText()).includes('Showing 25'));
    await page.getByRole('link', { name: 'Previous page', exact: true }).click();
    await page.waitForURL('**page=1');
    assert.equal(await page.locator('demo-catalog article h2').first().innerText(), firstName);
    await visit('/groceries/search?q=breakfast%20oatmeal&page=99');
    assert.equal(await page.locator('demo-catalog article').count(), 5, 'Taxonomy search includes oats even without oatmeal in the title');
    assert.equal(await page.getByRole('link', { name: 'Next page', exact: true }).count(), 0);
    await visit('/groceries/condiments-sauces-spices');
    if (catalog.some(p => p.source_name === 'supermarketitaly')) {
      await visit('/groceries/search?q=pasta');
      assert.ok(await page.locator('demo-catalog article').count() > 0, 'Imported pasta must be searchable');
      await page.getByRole('link', { name: 'Next page', exact: true }).click();
      await page.waitForURL('**page=2');
      assert.equal(new URL(page.url()).searchParams.get('q'), 'pasta', 'Pagination must preserve the search query');
      await visit('/groceries/pasta');
      assert.ok(await page.locator('.search-results .item').count() > 0, 'Imported products must appear in categories');
      const pasta = catalog.filter(p => p.category === 'Pasta');
      await page.getByRole('combobox').click();
      await page.getByRole('option', { name: 'Price: Low to High', exact: true }).click();
      await page.getByLabel('Minimum price', { exact: true }).fill('6');
      await page.getByLabel('Maximum price', { exact: true }).fill('8');
      await page.getByRole('button', { name: 'Apply price range' }).click();
      const ranged = pasta.filter(p => p.price >= 6 && p.price <= 8);
      assert.equal(await page.locator('.search-results .item').count(), ranged.length, 'Custom prices must not round to preset buckets');
      const prices = (await page.locator('.search-results .price').allTextContents()).map(s => Number(s.replace(/[^0-9.]/g, '')));
      assert.deepEqual(prices, [...prices].sort((a, b) => a - b), 'Sort must persist after a price filter');
      await page.getByLabel('Minimum price', { exact: true }).fill('20');
      assert.equal(await page.getByRole('button', { name: 'Apply price range' }).isDisabled(), true, 'Reversed bounds must be rejected');
      await page.getByRole('button', { name: 'Clear price filter' }).click();
      assert.equal(await page.locator('.search-results .item').count(), pasta.length);
      await page.getByLabel('Maximum price', { exact: true }).fill('0');
      await page.getByRole('button', { name: 'Apply price range' }).click();
      assert.equal(await page.locator('.search-results .item').count(), pasta.filter(p => p.price === 0).length);
      await page.getByRole('button', { name: 'Clear price filter' }).click();
      const spaghettiCount = catalog.filter(p => String(p.cat_id) === '13261').length;
      if (spaghettiCount) {
        const option = page.locator('.category-list-item').filter({ hasText: /Spaghetti/ });
        assert.ok((await option.innerText()).includes(`(${spaghettiCount})`), 'Category count must include string IDs from Supabase');
        await option.locator('input').check();
        assert.equal(await page.locator('.search-results .item').count(), spaghettiCount, 'Category checkbox must filter products');
        await option.locator('input').uncheck();
        assert.equal(await page.locator('.search-results .item').count(), catalog.filter(p => p.category === 'Pasta').length, 'Clearing a category restores the complete list');
        await visit('/groceries/pasta/spaghetti');
        assert.equal(await page.locator('.search-results .item').count(), spaghettiCount, 'Nested category route must show matching products');
      }
      await page.locator('.search-results .item a').first().click();
      await page.waitForURL('**/grocery/**');
      await page.getByText('Add to Compare', { exact: true }).waitFor();
    }
    await visit('/groceries/compare');
    const productPath = '/grocery/chinese-five-spice/frontier-five-spice-powder-certified-organic-16-ounce-bag';
    await visit(productPath);
    await page.getByText('Add to Compare', { exact: true }).click();
    await page.getByText('Now Comparing', { exact: true }).waitFor();
    await visit('/groceries/compare');
    assert.ok((await page.locator('body').innerText()).includes('Frontier Five Spice'));
    await page.locator('.compare__page__container__content__item-close').click();
    await page.getByText('You have no items to compare').waitFor();
    // Corrupt old browser storage must not break the public catalog or product page.
    await page.evaluate(() => { localStorage.setItem('compare', 'broken-json'); localStorage.setItem('expires_at', '9999999999999'); });
    await visit(productPath);
    assert.equal(await page.getByText('Login to See').count(), 0);
    await visit('/solutions/parents');
    assert.equal(await page.locator('input[type=email]').count(), 0);
    await visit('/unknown-page');
    await page.setViewportSize({ width: 390, height: 844 });
    await visit('/groceries/all');
    assert.equal(await page.locator('demo-catalog article').count(), Math.min(24, catalog.length));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Mobile catalog must not overflow horizontally');
    assert.deepEqual(writes, []);
    assert.deepEqual(externalIntegrations, []);
    assert.deepEqual(errors, []);
    console.log('Browser smoke passed: redirects, search, categories, product details, comparison, corrupt storage, mobile catalog, and no legacy requests.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
