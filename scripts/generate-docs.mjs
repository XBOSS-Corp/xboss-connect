import { readFile, writeFile, mkdir, readdir, lstat, unlink } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog, productStartUrl, productInfoUrl, productDocumentPath } from '../src/catalog.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const MARKER = '<!-- Generated from catalog/public-products.json. -->';
const tick = String.fromCharCode(96);
const inline = (s) => tick + s + tick;
const code = (s) => tick.repeat(3) + 'sh\n' + s + '\n' + tick.repeat(3);
const md = (s) => String(s).replace(/\\/g, '\\\\').replace(/([[\]|])/g, '\\$1').replace(/[\r\n]+/g, ' ');
const detailLink = (p) => '[' + md(p.name) + '](' + encodeURI(productDocumentPath(p)) + ')';

function indexMarkdown(products) {
  const output = [];
  for (const [category, records] of Map.groupBy(products, (p) => p.category)) {
    output.push('### ' + md(category), '');
    for (const p of records.filter((p) => p.kind === 'product')) output.push('- ' + detailLink(p) + ' — ' + md(p.summary));
    const steps = records.filter((p) => p.kind === 'step');
    if (steps.length) {
      output.push('', '#### 화면 단계', '', '아래 항목은 업무 과정의 중간 단계입니다.', '');
      for (const p of steps) output.push('- ' + detailLink(p) + ' — ' + md(p.summary));
    }
    output.push('');
  }
  return output.join('\n');
}
async function ensureDirectory(path) {
  try {
    const info = await lstat(path);
    if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('문서 경로는 실제 디렉터리여야 합니다.');
  } catch (error) { if (error.code !== 'ENOENT') throw error; await mkdir(path); }
}
async function write(path, lines) {
  const destination = join(ROOT, path);
  try {
    const info = await lstat(destination);
    if (!info.isFile() || info.isSymbolicLink()) throw new Error('일반 문서 파일만 갱신할 수 있습니다.');
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  await writeFile(destination, (Array.isArray(lines) ? lines.join('\n') : lines).trimEnd() + '\n', 'utf8');
}
export async function generateDocs() {
  const catalog = await loadCatalog();
  const products = catalog.products;
  const count = products.filter((p) => p.kind === 'product').length;
  const steps = products.length - count;
  const updated = catalog.source.verified_at.slice(0, 10);
  for (const p of products) {
    if (!/^[a-z0-9가-힣]+(?:-[a-z0-9가-힣]+)*$/.test(p.slug) || p.slug.length > 128) throw new Error('문서 경로로 사용할 수 없는 상품 주소입니다.');
  }
  const preferred = ['증명서-자동-신청-내려받기', 'payroll-pack-premium-summary-v1-generate', 'shinhan-easy-accounts-transaction-history-search', 'naver-searchad-performance', 'payslip-xlsx', 'company-info-pack-brief-v1-generate'];
  const featured = preferred.map((slug) => products.find((p) => p.slug === slug && p.kind === 'product'));
  if (featured.some((p) => !p)) throw new Error('대표 상품의 공개 목록이 변경되었습니다. 현재 상품을 확인하세요.');
  const index = indexMarkdown(products);
  const examples = featured.map((p) => '| ' + md(p.category) + ' | ' + detailLink(p) + ' |').join('\n');
  const startCommands = [
    'node bin/xboss.mjs search "급여명세서"',
    'node bin/xboss.mjs doctor --anonymous',
    'node bin/xboss.mjs schema payslip-xlsx --anonymous',
    'node bin/xboss.mjs schema payslip-xlsx --anonymous --template',
  ].join('\n');
  const intro = [
    MARKER, '# XBOSS Connect', '',
    '![XBOSS Connect — 찾던 업무 데이터, 지금 쓰는 AI와 코드에서.](docs/assets/banner.svg)', '',
    '**찾던 업무 데이터, 지금 쓰는 AI와 코드에서.**', '',
    '홈택스·4대보험·은행 조회·마케팅 데이터를 찾고, 필요한 업무를 연결하세요.',
    'XBOSS의 **업무 상품 ' + count + '개**를 한곳에서 탐색할 수 있습니다.', '',
    '**무료로 시작할 수 있습니다.** 상품별 준비 사항과 이용 조건은 시작 과정에서 확인하세요.', '',
    '[상품 찾기](#전체-상품) · [AI에 연결](docs/ai-connect.md) · [코드로 시작](docs/quickstart.md) · [English](README.en.md)', '',
    '## 이런 업무부터 찾아보세요', '',
    '| 분야 | 실제 상품 |', '| --- | --- |', examples, '',
    '## 가장 편한 방법으로 시작하세요', '',
    '- **브라우저에서:** 아래에서 상품을 고르고 상품별 시작 링크를 여세요.',
    '- **AI에서:** [연결 안내](docs/ai-connect.md)에 따라 공식 MCP를 연결하세요. 현재 도구 목록으로 지원 업무와 입력을 확인할 수 있습니다.',
    '- **코드에서:** 이 저장소의 ZIP을 내려받아 압축을 풀고, 해당 폴더에서 아래 명령을 실행하세요. Node.js 22 이상이 필요합니다.', '',
    code(startCommands), '',
    '검색과 공개 연결 확인은 계정 없이 사용할 수 있습니다.',
    '선택한 상품의 입력은 ' + inline('schema') + '로 확인하세요. ' + inline('--template') + '의 ' + inline('null') + '은 실행 전에 실제 값으로 채웁니다.',
    '실제 업무는 [시작 안내](docs/quickstart.md)에 따라 연결 정보를 설정한 뒤 실행하세요.', '',
    '## 연결 방식', '',
    '| 사용 목적 | 제공 방식 |', '| --- | --- |',
    '| AI에게 업무 요청 | 공식 MCP 연결 안내, 현재 도구 목록과 입력 스키마 조회 |',
    '| 프로그램에서 업무 실행 | REST 작업 제출·상태 조회·결과 조회 |',
    '| 상품 찾기 | 전체 상품 문서, 로컬 검색 CLI, [공개 JSON 목록](catalog/public-products.json) |', '',
    '기관 연결과 업무 처리는 XBOSS 서비스에서 수행합니다.',
    '이 저장소는 공개 API 호출 코드와 사용 안내를 제공합니다.', '',
    '## 전체 상품', '',
    updated + ' 공식 공개 목록 확인: **업무 상품 ' + count + '개 · 화면 단계 ' + steps + '개**.',
    '상품명은 모두 아래에 텍스트로 수록했습니다. 브라우저 찾기와 저장소 검색으로도 찾을 수 있습니다.', '',
    index, '## 도움말', '',
    '[시작 안내](docs/quickstart.md) · [연결 문제 해결](docs/troubleshooting.md) · [공식 개발 문서](https://developer.xdata.kr) · [서비스 문의](https://xboss.biz/service-inquiry)', '',
    '상품별 지원 범위와 이용 조건은 [XBOSS 공식 안내](https://xboss.biz/service-products)에서 확인하세요.', '',
    '이 저장소의 코드는 [MIT 라이선스](LICENSE)로 제공합니다. XBOSS 서비스 이용에는 서비스의 이용 조건이 적용됩니다.'
  ];
  await write('README.md', intro);
  await write('PRODUCTS.md', [
    MARKER, '# XBOSS 전체 상품', '', '**필요한 업무를 찾고, 해당 상품에서 바로 시작하세요.**', '',
    updated + ' 확인: 업무 상품 ' + count + '개와 화면 단계 ' + steps + '개입니다.',
    '화면 단계는 독립 업무 상품 수와 구분했습니다.', '',
    '[무료로 시작하기](https://xboss.biz/auth/signup) · [AI 연결](docs/ai-connect.md) · [코드 시작](docs/quickstart.md)', '', index
  ]);
  await write('README.en.md', [
    MARKER, '# XBOSS Connect', '', '**Korean business data, connected to your AI and code.**', '',
    'Explore ' + count + ' business products across Korean tax, social insurance, supported bank inquiries, payroll, and marketing data.', '',
    '**Start for free.** Product requirements and usage terms are shown when you get started.', '',
    '[Browse every product](PRODUCTS.md) · [Connect your AI](docs/ai-connect.md) · [Use the API](docs/quickstart.md) · [한국어](README.md)', '',
    'Download this repository as a ZIP, extract it, and open a terminal in its folder. Requires Node.js 22 or newer.', '',
    code(startCommands), '',
    'Local product search and public connection checks do not require an account.',
    'Use ' + inline('schema') + ' to inspect one product. ' + inline('--template') + ' prints required fields with ' + inline('null') + ' placeholders to fill before execution.',
    'For an actual job, follow the [connection guide](docs/quickstart.md), inspect the tool schema, and supply the required inputs.', '',
    'This repository contains clients for XBOSS public APIs, examples, and documentation. Institution connections and job processing run on the XBOSS service.', '',
    'The [catalog](catalog/public-products.json) contains ' + count + ' business products and ' + steps + ' intermediate workflow steps, verified against official public sources on ' + updated + '. Product names are preserved in Korean.', '',
    '[Official site](https://xboss.biz) · [Developer documentation](https://developer.xdata.kr) · [Help](https://xboss.biz/service-inquiry)', '',
    'Repository code is available under the [MIT License](LICENSE). Use of the hosted XBOSS service is subject to its own terms.'
  ]);
  await ensureDirectory(join(ROOT, 'docs/products'));
  await ensureDirectory(join(ROOT, 'docs/assets'));
  const expected = new Set(products.map((p) => p.slug + '.md'));
  for (const entry of await readdir(join(ROOT, 'docs/products'), { withFileTypes: true })) {
    if (expected.has(entry.name)) continue;
    if (!entry.isFile() || !entry.name.endsWith('.md')) throw new Error('상품 문서 폴더에 알 수 없는 파일이 있습니다.');
    const old = await readFile(join(ROOT, 'docs/products', entry.name), 'utf8');
    if (!old.startsWith(MARKER + '\n')) throw new Error('자동 생성하지 않은 문서는 지울 수 없습니다.');
    await unlink(join(ROOT, 'docs/products', entry.name));
  }
  for (const p of products) {
    const connection = p.mcp.enabled && p.mcp.name
      ? 'MCP 도구명: ' + inline(p.mcp.name) + '. 실제 연결 후 도구 목록에서 현재 입력 스키마와 이용 가능 여부를 확인하세요.'
      : 'AI에서 이용 가능한 업무는 실제 연결 후 도구 목록에서 확인하세요.';
    await write(productDocumentPath(p), [
      MARKER, '# ' + md(p.name), '', md(p.summary), '', '**분야:** ' + md(p.category), '',
      ...(p.kind === 'step' ? ['이 항목은 업무 과정의 중간 화면 단계입니다. 전체 업무 흐름은 공식 상품 안내를 확인하세요.', ''] : []),
      '[이 상품으로 시작하기](' + productStartUrl(p, { source: 'github' }) + ') · [공식 상품 안내](' + productInfoUrl(p, { source: 'github' }) + ')', '',
      'XBOSS는 무료로 시작할 수 있습니다. 이 상품의 준비 사항과 이용 조건은 시작 과정에서 확인하세요.', '',
      '## AI와 코드에서 사용하기', '',
      '[AI 연결 안내](../ai-connect.md) · [코드 시작 안내](../quickstart.md)', '',
      connection, '',
      'REST 실행 식별자: provider ' + inline(p.provider) + ', action ' + inline(p.action) + '.',
      '공식 상품 안내에서 필요한 기관 연결과 입력값을 확인한 뒤 실행하세요.', '',
      code('node bin/xboss.mjs show "' + p.slug + '"'), '',
      '[같은 분야의 상품 찾기](../../PRODUCTS.md) · [연결 문제 해결](../troubleshooting.md)'
    ]);
  }
  await write('docs/assets/banner.svg', [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="400" viewBox="0 0 1280 400" role="img" aria-label="XBOSS Connect. 찾던 업무 데이터, 지금 쓰는 AI와 코드에서.">',
    '<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0b182b"/><stop offset="1" stop-color="#162d44"/></linearGradient></defs>',
    '<rect width="1280" height="400" rx="24" fill="url(#bg)"/><circle cx="1175" cy="65" r="240" fill="#284c61" opacity=".3"/><circle cx="1115" cy="330" r="160" fill="#315369" opacity=".25"/>',
    '<rect x="64" y="54" width="42" height="6" rx="3" fill="#a2edda"/>',
    '<text x="64" y="112" font-family="Arial,sans-serif" font-size="27" font-weight="700" fill="#a2edda">XBOSS CONNECT</text>',
    '<text x="64" y="192" font-family="Arial,Malgun Gothic,sans-serif" font-size="48" font-weight="700" fill="#fff">찾던 업무 데이터,</text>',
    '<text x="64" y="257" font-family="Arial,Malgun Gothic,sans-serif" font-size="48" font-weight="700" fill="#fff">지금 쓰는 AI와 코드에서.</text>',
    '<text x="66" y="329" font-family="Arial,Malgun Gothic,sans-serif" font-size="23" fill="#b4c7da">홈택스 · 4대보험 · 은행 조회 · 마케팅</text>',
    '<rect x="958" y="257" width="226" height="65" rx="16" fill="#a2edda"/><text x="1071" y="299" text-anchor="middle" font-family="Arial,Malgun Gothic,sans-serif" font-size="24" font-weight="700" fill="#0b182b">무료로 시작하세요</text>',
    '</svg>'
  ]);
  return { products: count, steps, documents: products.length };
}
if (process.argv[1] && relative(fileURLToPath(import.meta.url), resolve(process.argv[1])) === '') {
  generateDocs().then((result) => console.log(JSON.stringify(result))).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
