import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import { loadCatalog, searchProducts, searchProductPage, findProduct, productStartUrl, productInfoUrl, productDocumentPath } from '../src/catalog.mjs';
import { parsePublicIndex, projectPublicCatalog, syncCatalog } from '../scripts/sync-catalog.mjs';

const products = [
  { id: '1', slug: 'naver-report', name: '네이버 광고 성과 조회', summary: '광고 실적을 확인합니다.', category: '마케팅', provider: 'naver', action: 'naver.report', kind: 'product' },
  { id: '2', slug: 'tax-report', name: '세금 자료 조회', summary: '사업자 자료를 확인합니다.', category: '세무', provider: 'tax', action: 'tax.report', kind: 'product' },
  { id: '3', slug: 'tax-login', name: '세금 자료 로그인', summary: '자료 조회 준비 단계입니다.', category: '세무', provider: 'tax', action: 'tax.login', kind: 'step' },
];

function row(id = 1, slug = 'naver-report') {
  return { id, website_slug: slug, current_version_summary: { provider: 'naver', action: 'naver.report' },
    mcp_tool_name: 'actual_server_name', mcp_tool_enabled: true };
}

function indexText(entries = [['naver-report', '네이버 광고 성과 조회']]) {
  return ['# XBOSS', '### 마케팅 (1개)', ...entries.map(([slug, name]) =>
    `- [${name}](https://xboss.biz/service-products/${slug}): 무료로 시작할 수 있습니다.`)].join('\n');
}

function json(value) {
  return new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
}

async function tempDirectory(t) {
  const prefix = resolve(fileURLToPath(new URL('.', import.meta.url)), '.tmp-catalog-');
  const path = await mkdtemp(prefix);
  t.after(async () => {
    assert.ok(resolve(path).startsWith(prefix));
    await rm(path, { recursive: true, force: true });
  });
  return path;
}

test('search uses all query terms and excludes screen steps unless requested', () => {
  assert.deepEqual(searchProducts(products, '네이버 성과').map((p) => p.id), ['1']);
  assert.deepEqual(searchProducts(products, '세금').map((p) => p.id), ['2']);
  assert.deepEqual(searchProducts(products, '로그인'), []);
  assert.equal(searchProducts(products, '로그인', { includeSteps: true })[0].id, '3');
  assert.deepEqual(searchProducts(products, '네이버 세금'), []);
});

test('search normalizes decomposed Korean and full-width ASCII without mutating product names', () => {
  const query = '네이버'.normalize('NFD');
  assert.equal(searchProducts(products, query)[0].name, '네이버 광고 성과 조회');
  assert.equal(searchProducts(products, 'ＮＡＶＥＲ')[0].id, '1');
  assert.equal(products[0].name, '네이버 광고 성과 조회');
});

test('search limits and name ambiguities produce explicit errors', () => {
  assert.throws(() => searchProducts(products, '', { limit: 0 }));
  assert.throws(() => searchProducts(products, '', { limit: 501 }));
  assert.throws(() => searchProducts(products, '', { limit: 1.5 }));
  const duplicateName = [...products, { ...products[0], id: '4', slug: 'other-report' }];
  assert.throws(() => findProduct(duplicateName, products[0].name), /slug/);
  assert.equal(findProduct(duplicateName, 'naver-report').id, '1');
  assert.equal(findProduct(products, '2').slug, 'tax-report');
  assert.throws(() => findProduct(products, 'not-present'));
});

test('product links preserve a Korean public slug with one encoding layer', () => {
  const product = { ...products[0], slug: '급여명세서-생성' };
  const start = new URL(productStartUrl(product));
  assert.equal(start.origin, 'https://xboss.biz');
  assert.ok(start.searchParams.get('returnTo').startsWith('https://console.xdata.kr/products?'));
  const returnTo = new URL(start.searchParams.get('returnTo'), 'https://console.xdata.kr');
  assert.equal(returnTo.pathname, '/products');
  assert.equal(returnTo.searchParams.get('product'), product.slug);
  assert.equal(productDocumentPath(product), 'docs/products/급여명세서-생성.md');
});

test('catalog loading rejects empty or incompatible schema files', async (t) => {
  const dir = await tempDirectory(t);
  const path = join(dir, 'catalog.json');
  await writeFile(path, JSON.stringify({ schema_version: 1, products }));
  assert.equal((await loadCatalog(path)).products.length, 3);
  for (const body of [{ schema_version: 2, products }, { schema_version: 1, products: [] }]) {
    await writeFile(path, JSON.stringify(body));
    await assert.rejects(loadCatalog(path));
  }
});

test('public index keeps exact names and separates screen steps across categories', () => {
  const text = [
    '### 세무 (1개)', '- [세금 자료 조회](https://xboss.biz/service-products/tax-report): 자료를 조회합니다.',
    '#### 화면 단계 (1개)', '- [세금 자료 로그인](https://xdata.kr/service-products/tax-login): 준비 단계입니다.',
    '### 마케팅 (1개)', '- [네이버 광고 성과 조회](https://xboss.biz/service-products/naver-report): 광고 실적입니다.',
  ].join('\r\n');
  const index = parsePublicIndex(text);
  assert.equal(index.size, 3);
  assert.equal(index.get('tax-login').kind, 'step');
  assert.equal(index.get('naver-report').kind, 'product');
  assert.equal(index.get('naver-report').category, '마케팅');
  assert.equal(index.get('naver-report').name, products[0].name);
  assert.throws(() => parsePublicIndex(text + '\n- [중복](https://xboss.biz/service-products/naver-report): 중복'), /중복/);
  assert.throws(() => parsePublicIndex('# empty'));
});

test('public projection retains only approved fields and actual MCP identifiers', () => {
  const input = { ...row(), internal_source: 'DO_NOT_EXPORT', client_secret: 'DO_NOT_EXPORT',
    metadata: { private_implementation: 'DO_NOT_EXPORT' } };
  const data = projectPublicCatalog([input], parsePublicIndex(indexText()), new Date('2026-11-01T00:00:00Z'));
  assert.equal(JSON.stringify(data).includes('DO_NOT_EXPORT'), false);
  assert.equal(data.products[0].mcp.name, 'actual_server_name');
  assert.equal(data.products[0].mcp.enabled, true);
  const unknown = projectPublicCatalog([{ ...row(), mcp_tool_name: undefined, mcp_tool_enabled: undefined }], parsePublicIndex(indexText()));
  assert.deepEqual(unknown.products[0].mcp, { name: null, enabled: null });
});

test('public projection rejects duplicate IDs, duplicate slugs, and missing members on either side', () => {
  const two = parsePublicIndex(indexText([['naver-report', '첫 상품'], ['second-report', '둘째 상품']]));
  assert.throws(() => projectPublicCatalog([row(1), row(1, 'second-report')], two), /중복/);
  assert.throws(() => projectPublicCatalog([row(1), row(2)], two), /중복/);
  assert.throws(() => projectPublicCatalog([row(1)], two), /상품/);
  assert.throws(() => projectPublicCatalog([row(1), row(2, 'second-report')], parsePublicIndex(indexText())), /집합/);
  assert.throws(() => projectPublicCatalog([row(1, '../private')], two), /주소/);
});

test('execution fields must be strings, preventing nested response data from entering public artifacts', () => {
  const index = parsePublicIndex(indexText());
  for (const field of ['provider', 'action']) {
    const input = row();
    input.current_version_summary[field] = { unexpected: 'DO_NOT_EXPORT' };
    assert.throws(() => projectPublicCatalog([input], index));
  }
});

test('public projection blocks quantified free allowance copy', () => {
  const index = parsePublicIndex(indexText().replace('무료로 시작할 수 있습니다.', '무료로 10회 이용할 수 있습니다.'));
  assert.throws(() => projectPublicCatalog([row()], index), /무료 제공량/);
});

test('sync reads every cursor page without authentication and publishes the complete approved set', async (t) => {
  const dir = await tempDirectory(t);
  const destination = join(dir, 'catalog.json');
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push(url);
    assert.equal(options.headers.Authorization, undefined);
    assert.equal(options.redirect, 'error');
    if (url.endsWith('/llms.txt')) return new Response(indexText([['naver-report', '첫 상품'], ['second-report', '둘째 상품']]));
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get('limit'), '100');
    if (!parsed.searchParams.has('cursor')) return json({ items: [row(1)], has_more: true, next_cursor: 'page/2+' });
    assert.equal(parsed.searchParams.get('cursor'), 'page/2+');
    return json({ items: [row(2, 'second-report')], has_more: false, next_cursor: null });
  };
  const data = await syncCatalog({ fetchImpl, destination });
  assert.equal(data.products.length, 2);
  assert.equal(calls.length, 3);
  assert.equal(JSON.parse(await readFile(destination, 'utf8')).products.length, 2);
});

test('sync rejects cursor loops and preserves the previous catalog on failure', async (t) => {
  const dir = await tempDirectory(t);
  const destination = join(dir, 'catalog.json');
  await writeFile(destination, 'previous-catalog');
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return json({ items: [row(calls)], has_more: true, next_cursor: 'loop' });
  };
  await assert.rejects(syncCatalog({ fetchImpl, destination }), /반복/);
  assert.equal(calls, 2);
  assert.equal(await readFile(destination, 'utf8'), 'previous-catalog');
});

test('sync requires an explicit pagination completion flag', async (t) => {
  const dir = await tempDirectory(t);
  const destination = join(dir, 'catalog.json');
  for (const badFlag of [undefined, 'false', 0]) {
    const fetchImpl = async (url) => url.endsWith('/llms.txt')
      ? new Response(indexText()) : json({ items: [row()], has_more: badFlag, next_cursor: null });
    await assert.rejects(syncCatalog({ fetchImpl, destination }));
  }
});


test('signup attribution stays outside returnTo and preserves the selected product', () => {
  const product = { ...products[0], slug: '급여명세서-생성' };
  for (const [source, medium] of [['github', 'repository'], ['xboss-connect', 'connector']]) {
    const start = new URL(productStartUrl(product, { source }));
    assert.equal(start.origin, 'https://xboss.biz');
    assert.equal(start.pathname, '/auth/signup');
    assert.equal(start.searchParams.get('utm_source'), source);
    assert.equal(start.searchParams.get('utm_medium'), medium);
    assert.equal(start.searchParams.get('utm_campaign'), 'xboss_connect');
    assert.equal(start.searchParams.get('utm_content'), product.slug);
    assert.deepEqual([...start.searchParams.keys()].sort(), ['returnTo', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_source']);
    const returnTo = new URL(start.searchParams.get('returnTo'));
    assert.equal(returnTo.origin, 'https://console.xdata.kr');
    assert.equal(returnTo.pathname, '/products');
    assert.deepEqual([...returnTo.searchParams], [['product', product.slug]]);
  }
  const defaultStart = new URL(productStartUrl(product));
  assert.equal(defaultStart.searchParams.get('utm_source'), 'xboss-connect');
  assert.equal(defaultStart.searchParams.get('utm_medium'), 'connector');
});

test('signup attribution accepts only the two supported public sources', () => {
  for (const source of ['', 'GitHub', 'newsletter', 'https://example.com', 'constructor', null, 123]) {
    assert.throws(() => productStartUrl(products[0], { source }), /유입 경로/);
  }
});


test('search totals include matches beyond the requested result limit', () => {
  const matching = Array.from({ length: 24 }, (_, index) => ({ ...products[0], id: String(index), slug: 'report-' + index }));
  const page = searchProductPage(matching, '광고', { limit: 3 });
  assert.equal(page.total, 24);
  assert.equal(page.products.length, 3);
  assert.deepEqual(searchProducts(matching, '광고', { limit: 3 }), page.products);
});

test('advertising cost discovery is limited to the verified public performance product', () => {
  const performance = { ...products[0], slug: 'naver-searchad-performance', provider: 'naver_searchad',
    action: 'naver_searchad.performance.report', name: '네이버 검색광고 성과 보고서 조회',
    summary: '캠페인이나 광고그룹의 노출, 클릭, 비용 같은 성과를 받아 옵니다.' };
  const candidates = [performance,
    { ...performance, id: 'different-slug', slug: 'another-product' },
    { ...performance, id: 'different-provider', provider: 'another_provider' },
    { ...performance, id: 'different-action', action: 'naver_searchad.bizmoney.read' },
    ...products,
  ];
  assert.deepEqual(searchProducts(candidates, '광고비 보고서'), [performance]);
  assert.deepEqual(searchProducts(candidates, '광고비 세금'), []);
});


test('official product links share attribution while preserving canonical URLs and Korean slugs', () => {
  const product = { ...products[0], slug: '급여명세서-생성',
    url: 'https://xboss.biz/service-products/' + encodeURIComponent('급여명세서-생성') + '?lang=ko#inputs' };
  const canonical = product.url;
  for (const [source, medium] of [['github', 'repository'], ['xboss-connect', 'connector']]) {
    const info = new URL(productInfoUrl(product, { source }));
    const start = new URL(productStartUrl(product, { source }));
    assert.equal(decodeURIComponent(info.pathname), '/service-products/' + product.slug);
    assert.equal(info.searchParams.get('lang'), 'ko');
    assert.equal(info.hash, '#inputs');
    assert.equal(info.searchParams.get('utm_medium'), medium);
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
      assert.equal(info.searchParams.get(key), start.searchParams.get(key));
      assert.equal(info.searchParams.getAll(key).length, 1);
    }
  }
  assert.equal(product.url, canonical);
});

test('official product attribution replaces stale duplicate campaign values', () => {
  const product = { ...products[0], url: 'https://xdata.kr/service-products/naver-report?utm_source=old&utm_source=older&utm_content=other' };
  const info = new URL(productInfoUrl(product, { source: 'github' }));
  assert.equal(info.origin, 'https://xdata.kr');
  assert.deepEqual(info.searchParams.getAll('utm_source'), ['github']);
  assert.equal(info.searchParams.get('utm_content'), 'naver-report');
});

test('product information attribution rejects nonofficial and mismatched addresses', () => {
  for (const url of ['http://xboss.biz/service-products/naver-report',
    'https://xboss.biz.example.invalid/service-products/naver-report',
    'https://example-user@xboss.biz/service-products/naver-report',
    'https://xboss.biz:444/service-products/naver-report',
    'https://console.xdata.kr/service-products/naver-report',
    'https://xboss.biz/auth/signup', 'https://xboss.biz/service-products/other',
    'https://xboss.biz/service-products/%ZZ', '/service-products/naver-report']) {
    assert.throws(() => productInfoUrl({ ...products[0], url }), /상품 안내 주소/);
  }
  assert.throws(() => productInfoUrl({ ...products[0], url: 'https://xboss.biz/service-products/naver-report' },
    { source: 'newsletter' }), /유입 경로/);
});
