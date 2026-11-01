import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const runFile = promisify(execFile);
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ROOT_FILES = new Set([
  'README.md', 'README.en.md', 'PRODUCTS.md', 'package.json', '.gitignore',
  '.env.example', 'LICENSE', 'LICENSE.md', 'SECURITY.md',
]);
const DIRECTORIES = new Set(['src', 'bin', 'catalog', 'docs', 'examples', 'skills', 'scripts', 'test', '.github']);
const CATALOG_KEYS = new Set(['schema_version', 'generated_at', 'source', 'products']);
const SOURCE_KEYS = new Set(['catalog_url', 'site_url', 'verified_at', 'record_count', 'verification_status']);
const PRODUCT_KEYS = new Set(['id', 'slug', 'name', 'summary', 'category', 'provider', 'action', 'kind', 'url', 'docs_url', 'mcp']);
const MCP_KEYS = new Set(['name', 'enabled']);
const PUBLIC_HOSTS = new Set(['xboss.biz', 'xdata.kr', 'developer.xdata.kr', 'console.xdata.kr', 'api.xdata.kr']);
const PLACEHOLDER = /^(?:<[^<>\r\n]+>|YOUR_[A-Z0-9_]+|REPLACE_[A-Z0-9_]+|CHANGE_ME|example|placeholder)?$/i;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function inside(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function allowedFile(file) {
  if (ROOT_FILES.has(file)) return true;
  if (file === '.github/workflows/check.yml') return true;
  if (file === 'catalog/public-products.json') return true;
  if (/^(?:src|bin|scripts)\/[a-zA-Z0-9_-]+\.mjs$/.test(file)) return true;
  if (/^test\/[a-zA-Z0-9_-]+\.test\.mjs$/.test(file)) return true;
  if (/^(?:docs|examples|skills)\/(?!.*(?:^|\/)\.)[^\\]+\.(?:md|mjs|json|svg)$/.test(file)) return true;
  return false;
}

function issue(issues, code, file, line, message) {
  issues.push({ code, file, ...(line ? { line } : {}), message });
}

function lineAt(text, index) {
  return text.slice(0, index).split('\n').length;
}

function scanContent(file, text, issues, root) {
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/.test(line)) {
      issue(issues, 'PRIVATE_KEY', file, index + 1, 'A private-key marker must not be distributed.');
    }
    if (/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[A-Z0-9]{16})\b/.test(line)) {
      issue(issues, 'CREDENTIAL_LITERAL', file, index + 1, 'A credential-shaped literal requires removal or review.');
    }
    if (/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/.test(line)) {
      issue(issues, 'TOKEN_LITERAL', file, index + 1, 'A signed-token-shaped literal must not be distributed.');
    }
    if (/\b(?:Basic|Bearer)\s+[A-Za-z0-9+/_=-]{16,}/.test(line)) {
      issue(issues, 'AUTH_LITERAL', file, index + 1, 'An authorization literal must use a placeholder or runtime input.');
    }
    if (/\b(?:client_secret|api_key|access_token|refresh_token|password)\s*["']?\s*[:=]\s*["']([A-Za-z0-9+/_=.-]{16,})["']/i.test(line)) {
      const value = line.match(/\b(?:client_secret|api_key|access_token|refresh_token|password)\s*["']?\s*[:=]\s*["']([A-Za-z0-9+/_=.-]{16,})["']/i)?.[1];
      if (value && !PLACEHOLDER.test(value)) issue(issues, 'SECRET_ASSIGNMENT', file, index + 1, 'A secret assignment must use a placeholder or runtime input.');
    }
    if (/(?:\\\\|\/\/)(?:power|Power)[\\/]XDATA_NEW\b|[A-Z]:[\\/](?:Users|XDATA)\b|xdata_local_pipeline[\\/]|@xdata\/fe-api-client|XBOSS-Corp\/(?:xdata-backend|xdata-frontend)/.test(line)) {
      issue(issues, 'PRIVATE_REFERENCE', file, index + 1, 'A private workspace or internal package reference must not be distributed.');
    }
  }

  if (/\.(?:mjs|json|md|svg)$/.test(file)) {
    const plain = text.replace(/[*_`]/g, '');
    const quotaPatterns = [
      /(?:무료|라이트|free|light)[^\n]{0,45}(?:하루|매일|일일|매월|월간|daily|monthly)[^\n]{0,15}\d+\s*(?:개|회|건|사용\s*)?(?:토큰|tokens?|calls?|requests?)/gi,
      /(?:하루|매일|일일|매월|월간)\s*\d+\s*(?:개|회|건|사용\s*)?(?:무료\s*)?(?:토큰|tokens?)/gi,
      /\b\d+\s+(?:free\s+)?tokens?\s*(?:\/|per\s+)(?:day|month)\b/gi,
    ];
    for (const pattern of quotaPatterns) {
      for (const match of plain.matchAll(pattern)) issue(issues, 'PUBLIC_FREE_QUANTITY', file, lineAt(plain, match.index), 'Promotional assets must not fix a numeric free allowance.');
    }
  }

  if (/\.mjs$/.test(file)) {
    const imports = /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s*)['"]([^'"\r\n]+)['"]/g;
    for (const match of text.matchAll(imports)) {
      const specifier = match[1];
      if (specifier.startsWith('node:')) continue;
      if (specifier.startsWith('./') || specifier.startsWith('../')) {
        const target = path.resolve(root, path.dirname(file), specifier);
        if (inside(root, target)) continue;
      }
      issue(issues, 'IMPORT_BOUNDARY', file, lineAt(text, match.index), 'Imports must be Node built-ins or relative paths inside this connector.');
    }
  }
  if (file === '.github/workflows/check.yml') {
    if (/permissions:\s*write-all|(?:contents|packages|actions|id-token):\s*write\b/.test(text) || /\bnpm\s+publish\b|\bgh\s+release\s+create\b|\bgit\s+push\b/.test(text)) {
      issue(issues, 'WORKFLOW_PUBLISH', file, null, 'The verification workflow must not publish or request write permissions.');
    }
  }
  if (file === '.env.example') {
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const entry = /^([A-Z][A-Z0-9_]*)=(.*)$/.exec(trimmed);
      const value = entry?.[2].replace(/^(["'])(.*)\1$/, '$2');
      const publicEnvironment = entry?.[1] === 'XBOSS_ENV_SCOPE' && ['real_test', 'production'].includes(value);
      if (!entry || (!publicEnvironment && !PLACEHOLDER.test(value))) {
        issue(issues, 'ENV_EXAMPLE_VALUE', file, index + 1, 'Secret examples must use placeholders; public environment values must be explicitly allowed.');
      }
    });
  }
}

function checkKeys(object, allowed, file, description, issues) {
  if (!isObject(object)) {
    issue(issues, 'CATALOG_SCHEMA', file, null, `${description} must be an object.`);
    return false;
  }
  if (Object.keys(object).some(key => !allowed.has(key))) {
    issue(issues, 'CATALOG_EXTRA_FIELD', file, null, `${description} contains a field outside the public export schema.`);
  }
  return true;
}

function publicUrl(value, nullable = false) {
  if (nullable && value === null) return true;
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && PUBLIC_HOSTS.has(url.hostname) && !url.username && !url.password && !url.port &&
      ![...url.searchParams.keys()].some(key => /secret|token|password|authorization/i.test(key));
  } catch {
    return false;
  }
}

function catalogLinks(text) {
  return [...text.matchAll(/\[([^\]\r\n]+)\]\((?:\.\/)?docs\/products\/([^\s)]+)\.md\)/g)].map(match => {
    let slug = match[2];
    try { slug = decodeURIComponent(slug); } catch { /* Invalid encoding cannot match a catalog slug. */ }
    return { name: match[1].replace(/\\([\\`*{}\[\]()#+.!_|>-])/g, '$1'), slug };
  });
}

function verifyCatalog(files, issues, warnings) {
  const file = 'catalog/public-products.json';
  let catalog;
  try { catalog = JSON.parse(files.get(file) ?? ''); } catch {
    issue(issues, 'CATALOG_JSON', file, null, 'A valid public catalog is required.');
    return { records: 0, products: 0, steps: 0 };
  }
  if (!checkKeys(catalog, CATALOG_KEYS, file, 'Catalog', issues)) return { records: 0, products: 0, steps: 0 };
  if (catalog.schema_version !== 1 || !Number.isFinite(Date.parse(catalog.generated_at))) issue(issues, 'CATALOG_SCHEMA', file, null, 'Catalog version or generation timestamp is invalid.');
  if (checkKeys(catalog.source, SOURCE_KEYS, file, 'Catalog source', issues)) {
    if (!publicUrl(catalog.source.catalog_url) || !publicUrl(catalog.source.site_url)) issue(issues, 'CATALOG_SOURCE', file, null, 'Catalog source must use approved public HTTPS origins.');
    if (!Number.isFinite(Date.parse(catalog.source.verified_at))) issue(issues, 'CATALOG_SOURCE', file, null, 'Catalog verification timestamp is missing or invalid.');
    if (catalog.source.verification_status !== undefined && !['live', 'unverified'].includes(catalog.source.verification_status)) issue(issues, 'CATALOG_SOURCE', file, null, 'Catalog verification status is invalid.');
    if (catalog.source.verification_status !== 'live') warnings.push({ code: 'CATALOG_LIVE_NOT_ATTESTED', file, message: 'This check does not establish current live catalog parity.' });
  }
  if (!Array.isArray(catalog.products) || catalog.products.length === 0) {
    issue(issues, 'CATALOG_EMPTY', file, null, 'The public catalog must contain records.');
    return { records: 0, products: 0, steps: 0 };
  }
  if (catalog.source?.record_count !== catalog.products.length) issue(issues, 'CATALOG_COUNT', file, null, 'Source record count differs from the catalog array.');
  const ids = new Set();
  const slugs = new Set();
  let productCount = 0;
  let stepCount = 0;
  for (const product of catalog.products) {
    if (!checkKeys(product, PRODUCT_KEYS, file, 'Catalog record', issues)) continue;
    const validId = typeof product.id === 'string' && product.id.length > 0;
    const validSlug = typeof product.slug === 'string' && /^[a-z0-9가-힣]+(?:-[a-z0-9가-힣]+)*$/.test(product.slug) && product.slug.length <= 128;
    if (!validId || !validSlug || typeof product.name !== 'string' || !product.name.trim()) issue(issues, 'CATALOG_IDENTITY', file, null, 'A record has an invalid public identity.');
    if (ids.has(product.id) || slugs.has(product.slug)) issue(issues, 'CATALOG_DUPLICATE', file, null, 'Catalog IDs and slugs must be unique.');
    ids.add(product.id);
    slugs.add(product.slug);
    if (product.kind === 'product') productCount += 1;
    else if (product.kind === 'step') stepCount += 1;
    else issue(issues, 'CATALOG_KIND', file, null, 'Catalog kind must distinguish products and steps.');
    for (const field of ['summary', 'category', 'provider', 'action']) if (typeof product[field] !== 'string') issue(issues, 'CATALOG_SCHEMA', file, null, 'A public text field is missing or invalid.');
    if (!publicUrl(product.url) || !publicUrl(product.docs_url, true)) issue(issues, 'CATALOG_LINK', file, null, 'A record link is outside approved public origins.');
    if (checkKeys(product.mcp, MCP_KEYS, file, 'MCP facts', issues)) {
      if (!(product.mcp.name === null || (typeof product.mcp.name === 'string' && product.mcp.name.length > 0)) ||
          ![true, false, null].includes(product.mcp.enabled) || (product.mcp.enabled === true && !product.mcp.name)) issue(issues, 'CATALOG_MCP', file, null, 'MCP availability must use explicit public facts.');
    }
    if (validSlug) {
      const detailFile = `docs/products/${product.slug}.md`;
      const detail = files.get(detailFile);
      if (!detail) issue(issues, 'PRODUCT_DETAIL_MISSING', detailFile, null, 'A catalog record has no product document.');
      else if (!detail.split(/\r?\n/).some(line => line === `# ${product.name}`)) issue(issues, 'PRODUCT_NAME_DRIFT', detailFile, null, 'The document heading must equal the official product name.');
    }
  }
  for (const indexFile of ['README.md', 'PRODUCTS.md']) {
    const links = catalogLinks(files.get(indexFile) ?? '');
    const linked = new Map();
    for (const link of links) {
      if (!slugs.has(link.slug)) issue(issues, 'INDEX_UNKNOWN_PRODUCT', indexFile, null, 'An index links a product outside the public catalog.');
      const names = linked.get(link.slug) ?? new Set();
      names.add(link.name);
      linked.set(link.slug, names);
    }
    for (const product of catalog.products) {
      if (!isObject(product)) continue;
      if (!linked.has(product.slug)) issue(issues, 'INDEX_PRODUCT_MISSING', indexFile, null, 'An index omits a catalog record.');
      else if (!linked.get(product.slug).has(product.name)) issue(issues, 'INDEX_NAME_DRIFT', indexFile, null, 'An index lacks the official product name for a catalog record.');
    }
  }
  for (const fileName of files.keys()) {
    const match = /^docs\/products\/(.+)\.md$/.exec(fileName);
    if (match && !slugs.has(match[1])) issue(issues, 'ORPHAN_PRODUCT_DOC', fileName, null, 'A product document has no corresponding public catalog record.');
  }
  return { records: catalog.products.length, products: productCount, steps: stepCount };
}

function verifyPackage(text, issues, warnings) {
  try {
    const metadata = JSON.parse(text ?? '');
    if (!isObject(metadata)) throw new Error('Invalid package');
    for (const group of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
      if (metadata[group] && Object.keys(metadata[group]).length > 0) issue(issues, 'PACKAGE_DEPENDENCY', 'package.json', null, 'This connector must remain dependency-free.');
    }
    if (metadata.workspaces) issue(issues, 'PACKAGE_WORKSPACE', 'package.json', null, 'A public connector must not include private workspace packages.');
    for (const hook of ['preinstall', 'install', 'postinstall']) if (metadata.scripts?.[hook]) issue(issues, 'INSTALL_HOOK', 'package.json', null, 'Installation must not execute hidden lifecycle hooks.');
    if (!metadata.license || metadata.license === 'UNLICENSED') warnings.push({ code: 'LICENSE_NOT_FINALIZED', file: 'package.json', message: 'Distribution rights require a separately confirmed license decision.' });
  } catch {
    issue(issues, 'PACKAGE_JSON', 'package.json', null, 'A valid package manifest is required.');
  }
}

async function scanHistory(root, issues) {
  const git = async args => (await runFile('git', ['-C', root, '-c', 'core.quotepath=false', ...args], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, timeout: 30000 })).stdout;
  try {
    const actualRoot = path.resolve((await git(['rev-parse', '--show-toplevel'])).trim());
    if (path.relative(root, actualRoot) !== '') {
      issue(issues, 'HISTORY_ROOT', '.git', null, 'History inspection requires an independent connector repository.');
      return { checked: false, commits: 0, blobs: 0 };
    }
    const commits = (await git(['rev-list', '--all'])).trim().split(/\r?\n/).filter(Boolean);
    const visited = new Set();
    for (const commit of commits) {
      const entries = (await git(['ls-tree', '-rz', commit])).split('\0').filter(Boolean);
      for (const entry of entries) {
        const match = /^(\d+) blob ([0-9a-f]+)\t([\s\S]+)$/.exec(entry);
        if (!match) { issue(issues, 'HISTORY_ENTRY', '.git', null, 'A history entry is not a regular source file.'); continue; }
        const [, mode, blob, file] = match;
        if (mode === '120000') { issue(issues, 'HISTORY_SYMLINK', file, null, 'A historical symbolic link must not be published.'); continue; }
        if (!allowedFile(file)) issue(issues, 'HISTORY_FILE', file, null, 'History contains a file outside the public allowlist.');
        if (visited.has(blob)) continue;
        visited.add(blob);
        const content = await git(['cat-file', 'blob', blob]);
        if (Buffer.byteLength(content) > MAX_FILE_BYTES) issue(issues, 'HISTORY_SIZE', file, null, 'A historical file exceeds the reviewable size limit.');
        else scanContent(file, content, issues, root);
      }
    }
    return { checked: true, commits: commits.length, blobs: visited.size };
  } catch {
    issue(issues, 'HISTORY_UNAVAILABLE', '.git', null, 'Git history could not be checked; no completion claim was made.');
    return { checked: false, commits: 0, blobs: 0 };
  }
}

export async function verifyPublicTree(directory = PROJECT_ROOT, options = {}) {
  const root = path.resolve(directory);
  const issues = [];
  const warnings = [];
  const files = new Map();
  async function walk() {
    const pending = [''];
    while (pending.length > 0) {
      const batch = pending.splice(0, 8);
      const results = await Promise.allSettled(batch.map(async relative => {
        if (relative === '.git') return;
        const absolute = path.join(root, relative);
        const stat = await lstat(absolute);
        if (stat.isSymbolicLink()) { issue(issues, 'SYMLINK', relative || '.', null, 'Symbolic links and junctions must not be distributed.'); return; }
        if (stat.isDirectory()) {
          if (relative && (!DIRECTORIES.has(relative.split('/')[0]) || relative.split('/').some(part => part.startsWith('.') && part !== '.github'))) {
            issue(issues, 'UNAPPROVED_DIRECTORY', relative, null, 'A directory is outside the public allowlist.');
            return;
          }
          const entries = await readdir(absolute, { withFileTypes: true });
          pending.push(...entries.map(entry => relative ? relative + '/' + entry.name : entry.name));
          return;
        }
        if (!stat.isFile()) { issue(issues, 'SPECIAL_FILE', relative || '.', null, 'Only regular files may be distributed.'); return; }
        if (!allowedFile(relative)) { issue(issues, 'UNAPPROVED_FILE', relative, null, 'A file is outside the public allowlist.'); return; }
        if (stat.size > MAX_FILE_BYTES) { issue(issues, 'FILE_SIZE', relative, null, 'A file exceeds the reviewable size limit.'); return; }
        const bytes = await readFile(absolute);
        if (bytes.length === 0) { issue(issues, 'EMPTY_FILE', relative, null, 'Empty files must not enter the public release.'); return; }
        if (bytes.includes(0)) { issue(issues, 'BINARY_FILE', relative, null, 'Unexpected binary content requires separate review.'); return; }
        const content = bytes.toString('utf8');
        if (!Buffer.from(content, 'utf8').equals(bytes)) { issue(issues, 'INVALID_UTF8', relative, null, 'Public text files must contain valid UTF-8.'); return; }
        files.set(relative, content);
        scanContent(relative, content, issues, root);
      }));
      for (let index = 0; index < results.length; index += 1) {
        if (results[index].status === 'rejected') issue(issues, 'READ_FAILED', batch[index] || '.', null, 'A release path could not be completely read.');
      }
    }
  }
  try { await walk(); } catch {
    issue(issues, 'READ_FAILED', '.', null, 'The complete release tree could not be read.');
  }
  for (const required of ['README.md', 'PRODUCTS.md', 'package.json', 'catalog/public-products.json']) if (!files.has(required)) issue(issues, 'REQUIRED_FILE', required, null, 'A required release file is missing.');
  verifyPackage(files.get('package.json'), issues, warnings);
  const catalog = verifyCatalog(files, issues, warnings);
  if (options.release) {
    for (const warning of warnings) issue(issues, `RELEASE_${warning.code}`, warning.file, null, warning.message);
    if (!files.has('LICENSE') && !files.has('LICENSE.md')) issue(issues, 'RELEASE_LICENSE_FILE', 'LICENSE', null, 'A release requires the confirmed license text.');
  }
  const history = options.history ? await scanHistory(root, issues) : { checked: false, commits: 0, blobs: 0 };
  return { ok: issues.length === 0, files: files.size, catalog, history, issues, warnings };
}

if (process.argv[1] && path.relative(path.resolve(process.argv[1]), fileURLToPath(import.meta.url)) === '') {
  const args = process.argv.slice(2);
  let directory = PROJECT_ROOT;
  let history = false;
  let release = false;
  let rootSeen = false;
  let valid = true;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--history') history = true;
    else if (arg === '--release') release = true;
    else if (arg === '--root' && !rootSeen && args[index + 1] && !args[index + 1].startsWith('--')) {
      directory = path.resolve(args[++index]);
      rootSeen = true;
    } else valid = false;
  }
  if (!valid) {
    console.error('Usage: node scripts/verify-public.mjs [--root directory] [--history] [--release]');
    process.exitCode = 2;
  } else {
    const result = await verifyPublicTree(directory, { history, release });
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.ok ? 0 : 1;
  }
}
