import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { verifyPublicTree } from '../scripts/verify-public.mjs';

const makeProduct = (id, slug, name, kind = 'product') => ({
  id, slug, name, summary: '업무 결과를 확인합니다.', category: '업무', provider: 'sample', action: 'sample.read',
  kind, url: `https://xboss.biz/service-products/${slug}`, docs_url: 'https://developer.xdata.kr/',
  mcp: { name: null, enabled: false },
});

async function fixture(t, change = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'xboss-public-boundary-'));
  t.after(async () => {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('xboss-public-boundary-'));
    await rm(root, { recursive: true, force: true });
  });
  const products = [makeProduct('1', 'sample-product', '예시 업무 조회'), makeProduct('2', '연결-확인', '연결 확인', 'step')];
  const catalog = {
    schema_version: 1, generated_at: '2026-11-01T00:00:00.000Z',
    source: { catalog_url: 'https://api.xdata.kr/v1/public/catalog/products', site_url: 'https://xboss.biz', verified_at: '2026-11-01T00:00:00.000Z', record_count: products.length, verification_status: 'live' },
    products,
  };
  const index = '# XBOSS Connect\n\n무료로 시작할 수 있습니다.\n\n' + products.map(item => `- [${item.name}](docs/products/${item.slug}.md)`).join('\n') + '\n';
  const files = {
    'README.md': index, 'PRODUCTS.md': index,
    'package.json': JSON.stringify({ name: 'xboss-connect-test', private: true, type: 'module', license: 'UNLICENSED' }),
    'catalog/public-products.json': JSON.stringify(catalog),
    'src/client.mjs': "import { readFile } from 'node:fs/promises';\nexport const label = '관리자에게 연결 상태를 문의하세요.';\n",
    '.env.example': 'XBOSS_CLIENT_ID=YOUR_CLIENT_ID\nXBOSS_CLIENT_SECRET=YOUR_CLIENT_SECRET\nXBOSS_ENV_SCOPE=real_test\n',
    ...Object.fromEntries(products.map(item => [`docs/products/${item.slug}.md`, `# ${item.name}\n\n${item.summary}\n`])),
    ...change,
  };
  for (const [file, content] of Object.entries(files)) {
    if (content === null) continue;
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), content);
  }
  return { root, catalog, files };
}

test('public text, Korean slugs, and screen-step coverage pass without mistaking ordinary admin wording', async t => {
  const { root } = await fixture(t);
  const result = await verifyPublicTree(root);
  assert.equal(result.ok, true, JSON.stringify(result.issues));
  assert.deepEqual(result.catalog, { records: 2, products: 1, steps: 1 });
  assert.equal(result.history.checked, false);
  assert.ok(result.warnings.some(item => item.code === 'LICENSE_NOT_FINALIZED'));
});

test('unexpected and hidden files cannot enter a release', async t => {
  const { root } = await fixture(t, { '.env': 'PRIVATE=example', 'src/internal.py': 'example', 'dist/bundle.mjs': 'example' });
  const result = await verifyPublicTree(root);
  assert.equal(result.ok, false);
  assert.ok(result.issues.some(item => item.file === '.env' && item.code === 'UNAPPROVED_FILE'));
  assert.ok(result.issues.some(item => item.file === 'src/internal.py'));
  assert.ok(result.issues.some(item => item.file === 'dist' && item.code === 'UNAPPROVED_DIRECTORY'));
});

test('imports cannot cross the connector root or pull internal packages', async t => {
  const privatePackage = '@' + 'xdata/' + 'fe-api-client';
  const statement = 'im' + 'port';
  const from = 'fr' + 'om';
  const { root } = await fixture(t, { 'src/client.mjs': `${statement} thing ${from} '${privatePackage}';\n${statement} unsafe ${from} '../../outside.mjs';\n` });
  const result = await verifyPublicTree(root);
  assert.ok(result.issues.some(item => item.code === 'PRIVATE_REFERENCE'));
  assert.ok(result.issues.filter(item => item.code === 'IMPORT_BOUNDARY').length >= 2);
});

test('Claude bundle allows only its reviewed files and keeps credential scanning active', async t => {
  const { root } = await fixture(t, {
    '.claude-plugin/marketplace.json': JSON.stringify({ name: 'xboss', owner: { name: '엑스보스' }, plugins: [] }),
    'platforms/claude/.claude-plugin/plugin.json': JSON.stringify({ name: 'xboss-connect' }),
    'platforms/claude/.mcp.json': JSON.stringify({ mcpServers: { xboss: { type: 'http', url: 'https://api.xdata.kr/mcp' } } }),
    'platforms/claude/skills/xboss-start/SKILL.md': '# 한국어 시작 안내\n',
  });
  assert.equal((await verifyPublicTree(root)).ok, true);
  await writeFile(path.join(root, 'platforms/claude/.mcp.json'), JSON.stringify({ password: 'x'.repeat(24) }));
  await writeFile(path.join(root, 'platforms/claude/.claude-plugin/private.json'), '{}');
  await writeFile(path.join(root, '.claude-plugin/private.json'), '{}');
  await mkdir(path.join(root, 'platforms/unreviewed'));
  await writeFile(path.join(root, 'platforms/unreviewed/index.md'), '# 검토되지 않은 파일');
  const result = await verifyPublicTree(root);
  assert.ok(result.issues.some(item => item.code === 'SECRET_ASSIGNMENT' && item.file.endsWith('/.mcp.json')));
  assert.ok(result.issues.some(item => item.code === 'UNAPPROVED_FILE' && item.file.endsWith('/private.json')));
  assert.ok(result.issues.some(item => item.code === 'UNAPPROVED_DIRECTORY' && item.file === 'platforms/unreviewed'));
});

test('secret findings identify only the location and type, never the credential value', async t => {
  const credential = 'gh' + 'p_' + 'z'.repeat(32);
  const basicValue = 'a'.repeat(28);
  const { root } = await fixture(t, { 'src/client.mjs': `export const token = '${credential}';\nexport const auth = 'Basic ${basicValue}';\n` });
  const result = await verifyPublicTree(root);
  assert.ok(result.issues.some(item => item.code === 'CREDENTIAL_LITERAL'));
  assert.ok(result.issues.some(item => item.code === 'AUTH_LITERAL'));
  assert.equal(JSON.stringify(result).includes(credential), false);
  assert.equal(JSON.stringify(result).includes(basicValue), false);
});

test('environment examples accept placeholders but reject real-looking values', async t => {
  const secret = 'x'.repeat(24);
  const { root } = await fixture(t, { '.env.example': `XBOSS_CLIENT_SECRET=${secret}\n` });
  const result = await verifyPublicTree(root);
  assert.ok(result.issues.some(item => item.code === 'ENV_EXAMPLE_VALUE'));
  assert.equal(JSON.stringify(result).includes(secret), false);
});

test('specific promotional free allowances are rejected without rejecting free-start copy', async t => {
  const { root, files } = await fixture(t);
  await writeFile(path.join(root, 'README.md'), files['README.md'] + '\n무료로 ' + '매일 ' + String(9) + ' 토큰을 제공합니다.\n');
  const result = await verifyPublicTree(root);
  assert.ok(result.issues.some(item => item.code === 'PUBLIC_FREE_QUANTITY'));
});

test('every catalog record must appear under its exact name in both indexes', async t => {
  const { root, files } = await fixture(t);
  await writeFile(path.join(root, 'README.md'), files['README.md'].replace('- [연결 확인](docs/products/연결-확인.md)', ''));
  await writeFile(path.join(root, 'PRODUCTS.md'), files['PRODUCTS.md'].replace('[예시 업무 조회]', '[다른 이름]'));
  const result = await verifyPublicTree(root);
  assert.ok(result.issues.some(item => item.code === 'INDEX_PRODUCT_MISSING' && item.file === 'README.md'));
  assert.ok(result.issues.some(item => item.code === 'INDEX_NAME_DRIFT' && item.file === 'PRODUCTS.md'));
});

test('missing, renamed, and orphaned product documents are detected', async t => {
  const { root } = await fixture(t, {
    'docs/products/sample-product.md': '# 다른 상품\n',
    'docs/products/연결-확인.md': null,
    'docs/products/removed-product.md': '# 내려간 상품\n',
  });
  const result = await verifyPublicTree(root);
  for (const code of ['PRODUCT_NAME_DRIFT', 'PRODUCT_DETAIL_MISSING', 'ORPHAN_PRODUCT_DOC']) assert.ok(result.issues.some(item => item.code === code));
});

test('catalog exports reject undeclared fields, duplicate identity, and invented MCP availability', async t => {
  const { root, catalog } = await fixture(t);
  catalog.products[0].internal_debug = 'not-public';
  catalog.products[0].mcp.enabled = true;
  catalog.products[1].id = catalog.products[0].id;
  await writeFile(path.join(root, 'catalog/public-products.json'), JSON.stringify(catalog));
  const result = await verifyPublicTree(root);
  for (const code of ['CATALOG_EXTRA_FIELD', 'CATALOG_DUPLICATE', 'CATALOG_MCP']) assert.ok(result.issues.some(item => item.code === code));
});

test('catalog URLs cannot carry credentials or leave approved origins', async t => {
  const { root, catalog } = await fixture(t);
  catalog.products[0].url = 'https://invalid.example/product';
  catalog.products[1].docs_url = 'https://developer.xdata.kr/?access_token=placeholder';
  await writeFile(path.join(root, 'catalog/public-products.json'), JSON.stringify(catalog));
  const result = await verifyPublicTree(root);
  assert.equal(result.issues.filter(item => item.code === 'CATALOG_LINK').length, 2);
});

test('symlinks are rejected before reading their target', async t => {
  const { root } = await fixture(t);
  try {
    await symlink(path.join(root, 'README.md'), path.join(root, 'docs', 'linked.md'));
  } catch (error) {
    if (!['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) throw error;
    try {
      await symlink(root, path.join(root, 'docs', 'linked-directory'), 'junction');
    } catch (junctionError) {
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes(junctionError.code)) { t.skip('The current OS does not permit symlink or junction creation.'); return; }
      throw junctionError;
    }
  }
  const result = await verifyPublicTree(root);
  assert.ok(result.issues.some(item => item.code === 'SYMLINK'));
});

test('lifecycle hooks and dependencies cannot silently change a download installation', async t => {
  const { root } = await fixture(t, { 'package.json': JSON.stringify({ name: 'test', dependencies: { dependency: '1.0.0' }, scripts: { postinstall: 'node setup.mjs' } }) });
  const result = await verifyPublicTree(root);
  assert.ok(result.issues.some(item => item.code === 'INSTALL_HOOK'));
  assert.ok(result.issues.some(item => item.code === 'PACKAGE_DEPENDENCY'));
});

test('release mode rejects unverified catalog and unfinished distribution rights', async t => {
  const { root, catalog } = await fixture(t);
  catalog.source.verification_status = 'unverified';
  await writeFile(path.join(root, 'catalog/public-products.json'), JSON.stringify(catalog));
  const draft = await verifyPublicTree(root);
  assert.equal(draft.ok, true);
  const release = await verifyPublicTree(root, { release: true });
  assert.equal(release.ok, false);
  assert.ok(release.issues.some(item => item.code === 'RELEASE_CATALOG_LIVE_NOT_ATTESTED'));
  assert.ok(release.issues.some(item => item.code === 'RELEASE_LICENSE_NOT_FINALIZED'));
});

test('the CLI runs on the selected root and emits a structured result', async t => {
  const { root } = await fixture(t);
  const script = fileURLToPath(new URL('../scripts/verify-public.mjs', import.meta.url));
  const { stdout } = await promisify(execFile)(process.execPath, [script, '--root', root], { timeout: 30000 });
  const result = JSON.parse(stdout);
  assert.equal(result.ok, true);
  assert.equal(result.catalog.records, 2);
});

test('the verification workflow cannot publish automatically', async t => {
  const command = 'npm' + ' publish';
  const { root } = await fixture(t, { '.github/workflows/check.yml': 'name: check\npermissions: write-all\njobs:\n  check:\n    steps:\n      - run: ' + command + '\n' });
  const result = await verifyPublicTree(root);
  assert.ok(result.issues.some(item => item.code === 'WORKFLOW_PUBLISH'));
});

test('empty allowed source and test files cannot silently enter a release', async t => {
  const { root } = await fixture(t, { 'src/client.mjs': '', 'test/catalog.test.mjs': '' });
  const result = await verifyPublicTree(root);
  assert.equal(result.ok, false);
  assert.deepEqual(result.issues.filter(item => item.code === 'EMPTY_FILE').map(item => item.file).sort(), ['src/client.mjs', 'test/catalog.test.mjs']);
});
