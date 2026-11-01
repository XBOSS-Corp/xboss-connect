import { writeFile, rename } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://api.xdata.kr/v1/public/catalog/products';
const SITE = 'https://xboss.biz';

async function readPublic(url, json = true, fetchImpl = fetch) {
  const response = await fetchImpl(url, { headers: { 'X-Env-Scope': 'production', Accept: json ? 'application/json' : 'text/plain' }, redirect: 'error', signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error('공개 정보 조회 실패: HTTP ' + response.status);
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > 8 * 1024 * 1024) throw new Error('공개 응답 크기가 예상 범위를 넘었습니다.');
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  return json ? JSON.parse(text) : text;
}

export function parsePublicIndex(text) {
  const entries = new Map();
  let category = '';
  let kind = 'product';
  for (const line of text.split(/\r?\n/)) {
    const heading = /^### ([^(]+)\s*\(/.exec(line);
    if (heading) { category = heading[1].trim(); kind = 'product'; }
    if (/^#### 화면 단계/.test(line)) kind = 'step';
    const item = /^- \[([^\]]+)\]\((https:\/\/(?:xboss\.biz|xdata\.kr)\/service-products\/[^)]+)\)(?::\s*(.*))?$/.exec(line);
    if (!item) continue;
    if (!category) throw new Error('상품 분류를 확인할 수 없습니다.');
    const url = new URL(item[2]);
    const slug = decodeURIComponent(url.pathname.slice('/service-products/'.length));
    if (entries.has(slug)) throw new Error('공개 목차에 중복 상품이 있습니다.');
    entries.set(slug, { name: item[1], summary: item[3] || '', category, kind });
  }
  if (!entries.size) throw new Error('공개 목차가 비어 있습니다.');
  return entries;
}

export function projectPublicCatalog(rows, index, now = new Date()) {
  const ids = new Set();
  const slugs = new Set();
  const products = rows.map((row) => {
    const slug = row.website_slug;
    if (typeof slug !== 'string' || !/^[a-z0-9가-힣]+(?:-[a-z0-9가-힣]+)*$/.test(slug) || slug.length > 128) throw new Error('공개 상품 주소가 올바르지 않습니다.');
    const id = String(row.id);
    if (!/^\d+$/.test(id) || ids.has(id) || slugs.has(slug)) throw new Error('상품 식별자가 없거나 중복됩니다.');
    ids.add(id); slugs.add(slug);
    const page = index.get(slug);
    if (!page) throw new Error('공개 API와 사이트 상품 집합이 다릅니다: ' + slug);
    const version = row.current_version_summary ?? row.current_version;
    if (typeof version?.provider !== 'string' || !version.provider.trim() || typeof version?.action !== 'string' || !version.action.trim()) throw new Error('상품의 공개 실행 계약이 없습니다: ' + slug);
    if (/(?:무료|데모|체험).{0,30}\d+\s*(?:토큰|회|건|일|개월)/.test(page.summary)) throw new Error('공개 설명의 무료 제공량 문구를 검토해야 합니다: ' + slug);
    return {
      id, slug, name: page.name, summary: page.summary, category: page.category,
      provider: version.provider, action: version.action, kind: page.kind,
      url: SITE + '/service-products/' + encodeURIComponent(slug),
      docs_url: null,
      mcp: { name: typeof row.mcp_tool_name === 'string' ? row.mcp_tool_name : null, enabled: typeof row.mcp_tool_enabled === 'boolean' ? row.mcp_tool_enabled : null },
    };
  });
  if (slugs.size !== index.size) throw new Error('공개 사이트에만 있는 상품이 있습니다. 최신 목록을 다시 확인하세요.');
  products.sort((a, b) => a.category.localeCompare(b.category, 'ko') || a.name.localeCompare(b.name, 'ko') || a.id.localeCompare(b.id));
  const stamp = now.toISOString();
  return { schema_version: 1, generated_at: stamp, source: { catalog_url: API, site_url: SITE, verified_at: stamp, verification_status: 'live', record_count: products.length }, products };
}

export async function syncCatalog({ fetchImpl = fetch, destination = new URL('../catalog/public-products.json', import.meta.url) } = {}) {
  const rows = [];
  const cursors = new Set();
  let cursor;
  for (let page = 0; page < 100; page++) {
    const url = new URL(API); url.searchParams.set('limit', '100');
    if (cursor) url.searchParams.set('cursor', cursor);
    const envelope = await readPublic(url.href, true, fetchImpl);
    if (!envelope || !Array.isArray(envelope.items) || typeof envelope.has_more !== 'boolean' || (envelope.next_cursor != null && typeof envelope.next_cursor !== 'string')) throw new Error('공개 상품 응답 형식이 올바르지 않습니다.');
    rows.push(...envelope.items);
    if (!envelope.has_more) break;
    if (!envelope.items.length || !envelope.next_cursor || cursors.has(envelope.next_cursor)) throw new Error('상품 페이지가 누락되거나 반복됩니다.');
    cursor = envelope.next_cursor; cursors.add(cursor);
    if (page === 99) throw new Error('상품 페이지 수가 예상 범위를 넘었습니다.');
  }
  const index = parsePublicIndex(await readPublic(SITE + '/llms.txt', false, fetchImpl));
  const data = projectPublicCatalog(rows, index);
  const path = destination instanceof URL ? fileURLToPath(destination) : destination;
  const temporary = path + '.tmp';
  await writeFile(temporary, JSON.stringify(data, null, 2) + '\n', { encoding: 'utf8', mode: 0o644 });
  await rename(temporary, path);
  return data;
}

if (process.argv[1] && relative(fileURLToPath(import.meta.url), resolve(process.argv[1])) === '') {
  syncCatalog().then((data) => console.log(JSON.stringify({ products: data.products.filter((p) => p.kind === 'product').length, steps: data.products.filter((p) => p.kind === 'step').length, source: data.source }))).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
