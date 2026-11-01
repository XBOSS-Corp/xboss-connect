import { readFile, stat } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { XbossClient, readAllTools } from './client.mjs';
import { loadCatalog, searchProductPage, findProduct, productStartUrl, productInfoUrl } from './catalog.mjs';

export const HELP = `XBOSS Connect — 필요한 업무를 찾고 연결하세요.

  search "업무 표현" [--limit 20] [--steps] [--json]
  show <상품 slug> [--json]
  doctor [--anonymous]
  tools [--anonymous]
  schema <도구명 또는 상품 slug> [--anonymous] [--template]
  call <도구명> --input input.json --execute
  submit --provider PROVIDER --action ACTION --input input.json --idempotency-key UUID [--account-link-id LINK_ID] --execute
  status <작업 번호>
  wait <작업 번호>
  result <작업 번호>

환경변수: XBOSS_CLIENT_ID, XBOSS_CLIENT_SECRET, XBOSS_ENV_SCOPE
real_test도 실제 기관에 연결됩니다. 실행은 사용자가 명시한 명령에서만 합니다.
안내: https://developer.xdata.kr/common-guide/mcp-overview`;

async function readInput(path) {
  if (!path) throw new Error('--input 파일을 지정하세요.');
  let info;
  try { info = await stat(path); } catch {
    throw new Error('입력 파일을 찾거나 읽을 수 없습니다. 현재 폴더와 --input 파일 경로를 확인하세요.');
  }
  if (!info.isFile() || info.size > 1024 * 1024) throw new Error('입력은 1MB 이하 JSON 파일이어야 합니다.');
  let value;
  try { value = JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, '')); } catch { throw new Error('입력 파일의 JSON 형식을 확인하세요.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('입력 파일에는 JSON 객체를 넣으세요.');
  return value;
}

function inputTemplate(schema, depth = 0) {
  if (!schema || typeof schema !== 'object' || depth > 20 || schema.$ref
    || schema.oneOf || schema.anyOf || schema.allOf) return null;
  if (schema.type === 'object' || schema.properties) {
    const required = Array.isArray(schema.required) ? schema.required : [];
    return Object.fromEntries(required.filter((key) => typeof key === 'string')
      .map((key) => [key, inputTemplate(schema.properties?.[key], depth + 1)]));
  }
  if (schema.type === 'array') return [inputTemplate(schema.items, depth + 1)];
  return null;
}

async function selectedTool(tools, reference, readCatalog) {
  const exact = tools.find((tool) => tool.name === reference);
  if (exact) return exact;
  const catalog = await readCatalog();
  const product = catalog.products.find((item) => item.slug === reference);
  if (!product) throw new Error('현재 도구를 찾지 못했습니다. tools의 정확한 도구명 또는 search에서 찾은 상품 slug를 사용하세요.');
  const tool = product.mcp.enabled && tools.find((item) => item.name === product.mcp.name);
  if (!tool) throw new Error('이 상품의 MCP 도구가 현재 목록에 없습니다. 상품의 API·MCP 지원 여부와 내 계정 연결을 확인하세요.');
  return tool;
}

const options = { help: { type: 'boolean', short: 'h' }, anonymous: { type: 'boolean' }, template: { type: 'boolean' }, json: { type: 'boolean' }, steps: { type: 'boolean' }, execute: { type: 'boolean' }, limit: { type: 'string' }, input: { type: 'string' }, provider: { type: 'string' }, action: { type: 'string' }, 'idempotency-key': { type: 'string' }, 'account-link-id': { type: 'string' } };
const allowed = { search: ['limit', 'steps', 'json'], show: ['json'], doctor: ['anonymous'], tools: ['anonymous'], schema: ['anonymous', 'template'], call: ['input', 'execute'], submit: ['provider', 'action', 'input', 'idempotency-key', 'account-link-id', 'execute'], status: [], wait: [], result: [] };


export async function main(argv = process.argv.slice(2), { env = process.env, stdout = console.log, stderr = console.error, createClient = (config) => new XbossClient(config), readCatalog = loadCatalog } = {}) {
  const { values, positionals } = parseArgs({ args: argv, options, allowPositionals: true, strict: true });
  if (values.help || !positionals.length) { stdout(HELP); return; }
  const [command, ...args] = positionals;
  if (!Object.hasOwn(allowed, command)) throw new Error('알 수 없는 명령입니다. --help를 확인하세요.');
  for (const flag of Object.keys(values)) if (!allowed[command].includes(flag)) throw new Error(command + '에서는 --' + flag + ' 옵션을 사용할 수 없습니다.');
  const expected = ['search', 'show', 'schema', 'call', 'status', 'wait', 'result'].includes(command) ? 1 : 0;
  if (args.length !== expected) throw new Error(command + ' 명령의 인수를 확인하세요. --help에서 사용법을 볼 수 있습니다.');

  if (command === 'search' || command === 'show') {
    const catalog = await readCatalog();
    if (command === 'search') {
      const { products: found, total } = searchProductPage(catalog.products, args[0], { limit: values.limit ? Number(values.limit) : 20, includeSteps: Boolean(values.steps) });
      if (values.json) stdout(JSON.stringify(found, null, 2));
      else if (!found.length) stdout('일치하는 상품이 없습니다. 기관명이나 업무 표현을 바꿔 검색해 보세요.');
      else {
        stdout('검색 결과 ' + total + '개 중 ' + found.length + '개입니다.');
        for (const p of found) stdout(p.name + '\n  ' + p.summary + '\n  node bin/xboss.mjs show ' + p.slug + '\n');
        if (found.length < total) stdout('더 보려면 --limit ' + Math.min(total, 500) + '을 추가하거나 검색어를 좁혀 보세요.');
      }
      return;
    }
    const p = findProduct(catalog.products, args[0]);
    if (values.json) stdout(JSON.stringify({ ...p, start_url: productStartUrl(p), info_url: productInfoUrl(p) }, null, 2));
    else stdout(p.name + '\n\n' + p.summary + '\n\n상품 안내: ' + productInfoUrl(p) + '\n시작하기: ' + productStartUrl(p) + '\nAPI: ' + p.provider + ' / ' + p.action + (p.mcp.enabled && p.mcp.name ? '\nMCP: ' + p.mcp.name : '') + (p.mcp.enabled && p.mcp.name ? '\n\n입력 확인: node bin/xboss.mjs schema ' + p.slug + ' --anonymous\n내 계정에서는 node --env-file=.env bin/xboss.mjs schema ' + p.slug + '로 확인하세요.' : '\n\n입력 확인: 공식 상품 안내의 API 개발 문서를 확인하세요.'));
    return;
  }

  if (['call', 'submit'].includes(command) && !values.execute) throw new Error('실제 작업을 실행하려면 --execute를 지정하세요.');
  if (command === 'submit' && (!values.provider || !values.action || !values['idempotency-key'])) throw new Error('제출에는 --provider, --action, --idempotency-key가 필요합니다.');
  if (command === 'submit' && values['account-link-id'] !== undefined && !values['account-link-id'].trim()) {
    throw new Error('--account-link-id에는 사용할 기관 연결의 식별자를 입력하세요. 자동 선택하려면 옵션을 생략하세요.');
  }
  const input = ['call', 'submit'].includes(command) ? await readInput(values.input) : undefined;
  const client = createClient({ clientId: values.anonymous ? undefined : env.XBOSS_CLIENT_ID, clientSecret: values.anonymous ? undefined : env.XBOSS_CLIENT_SECRET, envScope: env.XBOSS_ENV_SCOPE || 'real_test' });
  let result;
  if (command === 'doctor' || command === 'tools' || command === 'schema') {
    result = await readAllTools(client, { anonymous: Boolean(values.anonymous) });
    if (command === 'doctor') {
      const mode = values.anonymous || !client.authenticated || result._meta?.['xdata.kr/lane']?.source === 'anonymous' ? 'public' : 'account';
      result = { connected: true, mode, tools: result.tools.length,
        message: (mode === 'public' ? '공개 연결을 확인했습니다. 내 계정 연결은 확인되지 않았습니다.' : '내 계정의 도구 목록을 확인했습니다.') + ' 상품 실행은 아직 하지 않았습니다.',
        next: mode === 'public' ? 'docs/quickstart.md에서 키를 설정한 뒤 node --env-file=.env bin/xboss.mjs doctor로 내 계정을 확인하세요.'
          : 'node --env-file=.env bin/xboss.mjs schema <상품 slug>로 필요한 입력을 확인하세요.' };
    } else if (command === 'schema') {
      result = await selectedTool(result.tools, args[0], readCatalog);
      if (values.template) {
        result = inputTemplate(result.inputSchema);
        stderr('미완성 입력 틀입니다. null을 확인한 실제 값으로 채우세요. 선택 입력·조건부 필수·참조 스키마는 schema에서 확인하세요. 실행은 별도 --execute 명령으로 요청합니다.');
      }
    }
  } else if (command === 'call') result = await client.callTool(args[0], input);
  else if (command === 'submit') {
    const job = { provider: values.provider, action: values.action, params: input };
    if (values['account-link-id'] !== undefined) job.account_link_id = values['account-link-id'];
    result = await client.submitJob(job, { idempotencyKey: values['idempotency-key'] });
  }
  else if (command === 'status') result = await client.getJob(args[0]);
  else if (command === 'result') result = await client.getResult(args[0]);
  else if (command === 'wait') result = await client.waitForJob(args[0], { onProgress: (status) => stderr(status.progress_message || status.status) });
  stdout(JSON.stringify(result, null, 2));
}
