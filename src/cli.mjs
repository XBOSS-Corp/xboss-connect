import { readFile, stat } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { XbossClient, readAllTools } from './client.mjs';
import { loadCatalog, searchProducts, findProduct, productStartUrl } from './catalog.mjs';

export const HELP = `XBOSS Connect — 필요한 업무를 찾고 연결하세요.

  search "업무 표현" [--limit 20] [--steps] [--json]
  show <상품 slug> [--json]
  doctor [--anonymous]
  tools [--anonymous]
  call <도구명> --input input.json --execute
  submit --provider PROVIDER --action ACTION --input input.json --idempotency-key UUID --execute
  status <작업 번호>
  wait <작업 번호>
  result <작업 번호>

환경변수: XBOSS_CLIENT_ID, XBOSS_CLIENT_SECRET, XBOSS_ENV_SCOPE
real_test도 실제 기관에 연결됩니다. 실행은 사용자가 명시한 명령에서만 합니다.
안내: https://developer.xdata.kr/common-guide/mcp-overview`;

async function readInput(path) {
  if (!path) throw new Error('--input 파일을 지정하세요.');
  const info = await stat(path);
  if (!info.isFile() || info.size > 1024 * 1024) throw new Error('입력은 1MB 이하 JSON 파일이어야 합니다.');
  let value;
  try { value = JSON.parse(await readFile(path, 'utf8')); } catch { throw new Error('입력 파일의 JSON 형식을 확인하세요.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('입력 파일에는 JSON 객체를 넣으세요.');
  return value;
}

const options = { help: { type: 'boolean', short: 'h' }, anonymous: { type: 'boolean' }, json: { type: 'boolean' }, steps: { type: 'boolean' }, execute: { type: 'boolean' }, limit: { type: 'string' }, input: { type: 'string' }, provider: { type: 'string' }, action: { type: 'string' }, 'idempotency-key': { type: 'string' } };
const allowed = { search: ['limit', 'steps', 'json'], show: ['json'], doctor: ['anonymous'], tools: ['anonymous'], call: ['input', 'execute'], submit: ['provider', 'action', 'input', 'idempotency-key', 'execute'], status: [], wait: [], result: [] };


export async function main(argv = process.argv.slice(2), { env = process.env, stdout = console.log, stderr = console.error, createClient = (config) => new XbossClient(config), readCatalog = loadCatalog } = {}) {
  const { values, positionals } = parseArgs({ args: argv, options, allowPositionals: true, strict: true });
  if (values.help || !positionals.length) { stdout(HELP); return; }
  const [command, ...args] = positionals;
  if (!Object.hasOwn(allowed, command)) throw new Error('알 수 없는 명령입니다. --help를 확인하세요.');
  for (const flag of Object.keys(values)) if (!allowed[command].includes(flag)) throw new Error(command + '에서는 --' + flag + ' 옵션을 사용할 수 없습니다.');
  const expected = ['search', 'show', 'call', 'status', 'wait', 'result'].includes(command) ? 1 : 0;
  if (args.length !== expected) throw new Error(command + ' 명령의 인수를 확인하세요. --help에서 사용법을 볼 수 있습니다.');

  if (command === 'search' || command === 'show') {
    const catalog = await readCatalog();
    if (command === 'search') {
      const found = searchProducts(catalog.products, args[0], { limit: values.limit ? Number(values.limit) : 20, includeSteps: Boolean(values.steps) });
      if (values.json) stdout(JSON.stringify(found, null, 2));
      else if (!found.length) stdout('일치하는 상품이 없습니다. 기관명이나 업무 표현을 바꿔 검색해 보세요.');
      else for (const p of found) stdout(p.name + '\n  ' + p.summary + '\n  show ' + p.slug + '\n');
      return;
    }
    const p = findProduct(catalog.products, args[0]);
    if (values.json) stdout(JSON.stringify({ ...p, start_url: productStartUrl(p) }, null, 2));
    else stdout(p.name + '\n\n' + p.summary + '\n\n상품 안내: ' + p.url + '\n시작하기: ' + productStartUrl(p) + '\nAPI: ' + p.provider + ' / ' + p.action + (p.mcp.enabled && p.mcp.name ? '\nMCP: ' + p.mcp.name : '') + '\n\n현재 지원 도구와 입력은 tools 및 공식 상품 안내에서 확인하세요.');
    return;
  }

  if (['call', 'submit'].includes(command) && !values.execute) throw new Error('실제 작업을 실행하려면 --execute를 지정하세요.');
  if (command === 'submit' && (!values.provider || !values.action || !values['idempotency-key'])) throw new Error('제출에는 --provider, --action, --idempotency-key가 필요합니다.');
  const input = ['call', 'submit'].includes(command) ? await readInput(values.input) : undefined;
  const client = createClient({ clientId: values.anonymous ? undefined : env.XBOSS_CLIENT_ID, clientSecret: values.anonymous ? undefined : env.XBOSS_CLIENT_SECRET, envScope: env.XBOSS_ENV_SCOPE || 'real_test' });
  let result;
  if (command === 'doctor' || command === 'tools') {
    result = await readAllTools(client, { anonymous: Boolean(values.anonymous) });
    if (command === 'doctor') result = { connected: true, mode: values.anonymous || !client.authenticated || result._meta?.['xdata.kr/lane']?.source === 'anonymous' ? 'public' : 'account', tools: result.tools.length, message: '서버 연결과 도구 목록을 확인했습니다. 상품 실행은 아직 하지 않았습니다.' };
  } else if (command === 'call') result = await client.callTool(args[0], input);
  else if (command === 'submit') result = await client.submitJob({ provider: values.provider, action: values.action, params: input }, { idempotencyKey: values['idempotency-key'] });
  else if (command === 'status') result = await client.getJob(args[0]);
  else if (command === 'result') result = await client.getResult(args[0]);
  else if (command === 'wait') result = await client.waitForJob(args[0], { onProgress: (status) => stderr(status.progress_message || status.status) });
  stdout(JSON.stringify(result, null, 2));
}
