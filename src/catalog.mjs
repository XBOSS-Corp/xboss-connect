import { readFile } from 'node:fs/promises';

export async function loadCatalog(url = new URL('../catalog/public-products.json', import.meta.url)) {
  const data = JSON.parse(await readFile(url, 'utf8'));
  if (data.schema_version !== 1 || !Array.isArray(data.products) || !data.products.length) {
    throw new Error('상품 목록을 읽을 수 없습니다. 최신 배포본을 받아 주세요.');
  }
  return data;
}

const normalize = (value) => String(value).normalize('NFKC').toLocaleLowerCase('ko').replace(/\s+/g, ' ').trim();

function publicSearchTerms(product) {
  // The official product page lists advertising cost as an output and a use case.
  // https://xboss.biz/service-products/naver-searchad-performance
  return product.slug === 'naver-searchad-performance' && product.provider === 'naver_searchad'
    && product.action === 'naver_searchad.performance.report' ? '광고비' : '';
}

export function searchProductPage(products, query, { limit = 20, includeSteps = false } = {}) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 500) throw new Error('검색 개수는 1~500 사이여야 합니다.');
  const terms = normalize(query).split(' ').filter(Boolean);
  const matches = products.filter((p) => includeSteps || p.kind === 'product').map((p) => {
    const name = normalize(p.name);
    const text = normalize([p.name, p.summary, p.category, p.provider, p.action, p.slug, publicSearchTerms(p)].join(' '));
    if (!terms.every((term) => text.includes(term))) return null;
    return { product: p, score: terms.reduce((score, term) => score + (name.includes(term) ? 10 : 1), 0) };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'ko'));
  return { products: matches.slice(0, limit).map((row) => row.product), total: matches.length };
}

export function searchProducts(products, query, options) {
  return searchProductPage(products, query, options).products;
}

export function findProduct(products, reference) {
  const matches = products.filter((p) => p.slug === reference || p.id === reference || p.name === reference);
  if (matches.length > 1) throw new Error('같은 이름의 상품이 있습니다. 상품 slug로 선택하세요.');
  if (!matches.length) throw new Error('상품을 찾지 못했습니다. search로 상품을 먼저 찾아 주세요.');
  return matches[0];
}

function attributedProductUrl(target, product, source) {
  if (source !== 'github' && source !== 'xboss-connect') throw new Error('지원하지 않는 유입 경로입니다.');
  target.searchParams.set('utm_source', source);
  target.searchParams.set('utm_medium', source === 'github' ? 'repository' : 'connector');
  target.searchParams.set('utm_campaign', 'xboss_connect');
  target.searchParams.set('utm_content', product.slug);
  return target.href;
}

export function productStartUrl(product, { source = 'xboss-connect' } = {}) {
  const target = new URL('/auth/signup', 'https://xboss.biz');
  target.searchParams.set('returnTo', 'https://console.xdata.kr/products?' + new URLSearchParams({ product: product.slug }));
  return attributedProductUrl(target, product, source);
}

export function productInfoUrl(product, { source = 'xboss-connect' } = {}) {
  let target;
  let pathname;
  try { target = new URL(product.url); pathname = decodeURIComponent(target.pathname); } catch {
    throw new Error('공식 상품 안내 주소를 확인할 수 없습니다.');
  }
  if (target.protocol !== 'https:' || !['xboss.biz', 'xdata.kr'].includes(target.hostname)
    || target.username || target.password || target.port || pathname !== '/service-products/' + product.slug) {
    throw new Error('공식 HTTPS 상품 안내 주소만 사용할 수 있습니다.');
  }
  return attributedProductUrl(target, product, source);
}

export function productDocumentPath(product) {
  return 'docs/products/' + product.slug + '.md';
}
