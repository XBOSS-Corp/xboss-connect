import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { main } from '../src/cli.mjs';
import { XbossClient } from '../src/client.mjs';

const product = {
  id: '1', slug: 'naver-report', name: '네이버 광고 성과 조회', summary: '광고 실적을 확인합니다.',
  category: '마케팅', provider: 'naver', action: 'naver.report', kind: 'product',
  url: 'https://xboss.biz/service-products/naver-report', docs_url: null,
  mcp: { name: 'actual_server_name', enabled: true },
};

function harness({ env = {}, readCatalog, client } = {}) {
  const stdout = [], stderr = [], configs = [], calls = [];
  const dependencies = {
    env, stdout: (value) => stdout.push(String(value)), stderr: (value) => stderr.push(String(value)),
    readCatalog: readCatalog ?? (async () => ({ schema_version: 1, products: [product] })),
    createClient: (config) => {
      configs.push(config);
      if (client) return client;
      return {
        authenticated: Boolean(config.clientId && config.clientSecret),
        listTools: async (options) => {
          calls.push({ method: 'listTools', options });
          return { tools: [{ name: 'actual_server_name' }], _meta: {
            'xdata.kr/lane': { source: config.clientId ? 'credential' : 'anonymous' },
          } };
        },
        callTool: async (name, args) => { calls.push({ method: 'callTool', name, args }); return { content: [] }; },
        submitJob: async (job, options) => { calls.push({ method: 'submitJob', job, options }); return { job_id: 'sample-job', status: 'QUEUED' }; },
        getJob: async (id) => { calls.push({ method: 'getJob', id }); return { job_id: id, status: 'RUNNING' }; },
        getResult: async (id) => { calls.push({ method: 'getResult', id }); return { result: { data: [] } }; },
        waitForJob: async (id, { onProgress }) => {
          calls.push({ method: 'waitForJob', id });
          onProgress({ status: 'RUNNING', progress_message: '자료를 확인하고 있습니다.' });
          return { job_id: id, status: 'SUCCEEDED' };
        },
      };
    },
  };
  return { dependencies, stdout, stderr, configs, calls };
}

async function inputFile(t, text = '{"period":"sample"}') {
  const prefix = resolve(tmpdir(), 'xboss-cli-test-');
  const directory = await mkdtemp(prefix);
  t.after(async () => {
    assert.ok(resolve(directory).startsWith(prefix));
    await rm(directory, { recursive: true, force: true });
  });
  const path = join(directory, 'input.json');
  await writeFile(path, text);
  return path;
}

test('help is offline and does not inspect credentials', async () => {
  const env = new Proxy({}, { get() { throw new Error('Credentials must not be read.'); } });
  const h = harness({ env, readCatalog: async () => { throw new Error('Catalog is not needed.'); } });
  await main(['--help'], h.dependencies);
  assert.match(h.stdout.join(''), /XBOSS Connect/);
  assert.equal(h.configs.length, 0);
});

test('search and show use the local catalog without creating a network client', async () => {
  const env = new Proxy({}, { get() { throw new Error('Credentials must not be read.'); } });
  const h = harness({ env });
  await main(['search', '네이버'.normalize('NFD'), '--json'], h.dependencies);
  assert.equal(JSON.parse(h.stdout[0])[0].slug, product.slug);
  await main(['show', product.slug, '--json'], h.dependencies);
  assert.equal(JSON.parse(h.stdout[1]).name, product.name);
  const startUrl = new URL(JSON.parse(h.stdout[1]).start_url);
  assert.equal(startUrl.origin, 'https://xboss.biz');
  assert.equal(startUrl.searchParams.get('utm_source'), 'xboss-connect');
  assert.equal(startUrl.searchParams.get('utm_medium'), 'connector');
  assert.equal(new URL(startUrl.searchParams.get('returnTo')).searchParams.get('product'), product.slug);
  assert.equal(h.configs.length, 0);
});

test('missing execution flags and invalid arguments fail before any client is constructed', async () => {
  const invalid = [
    ['call', 'actual_server_name', '--input', 'missing.json'],
    ['submit', '--provider', 'naver', '--action', 'naver.report', '--input', 'missing.json', '--idempotency-key', 'stable'],
    ['doctor', '--unknown'], ['doctor', '--execute'], ['search', '광고', '--execute'],
    ['unknown-command'], ['status'], ['submit', '--execute', '--input', 'missing.json'],
  ];
  for (const args of invalid) {
    const h = harness();
    await assert.rejects(main(args, h.dependencies));
    assert.equal(h.configs.length, 0, JSON.stringify(args));
    assert.equal(h.calls.length, 0, JSON.stringify(args));
  }
});

test('malformed JSON input fails without echoing the input or creating a client', async (t) => {
  const secret = 'EXAMPLE_INPUT_SECRET_DO_NOT_PRINT';
  const path = await inputFile(t, '{ "private": "' + secret + '", invalid }');
  const h = harness();
  await assert.rejects(main(['call', 'actual_server_name', '--input', path, '--execute'], h.dependencies), (error) => {
    assert.equal(error.message.includes(secret), false);
    return true;
  });
  assert.equal(h.configs.length, 0);
  assert.equal(h.stdout.join('').includes(secret), false);
  assert.equal(h.stderr.join('').includes(secret), false);
});

test('explicit anonymous doctor drops configured credentials and never executes a tool', async () => {
  const h = harness({ env: { XBOSS_CLIENT_ID: 'example-id', XBOSS_CLIENT_SECRET: 'example-secret' } });
  await main(['doctor', '--anonymous'], h.dependencies);
  assert.equal(h.configs[0].clientId, undefined);
  assert.equal(h.configs[0].clientSecret, undefined);
  assert.deepEqual(h.calls.map((call) => call.method), ['listTools']);
  const result = JSON.parse(h.stdout[0]);
  assert.equal(result.mode, 'public');
  assert.match(result.message, /상품 실행은 아직 하지 않았습니다/);
});

test('doctor without credentials reports a public connection rather than an account connection', async () => {
  const h = harness();
  await main(['doctor'], h.dependencies);
  assert.equal(JSON.parse(h.stdout[0]).mode, 'public');
});

test('authenticated doctor keeps connection verification separate from business execution', async () => {
  const h = harness({ env: { XBOSS_CLIENT_ID: 'example-id', XBOSS_CLIENT_SECRET: 'example-secret', XBOSS_ENV_SCOPE: 'production' } });
  await main(['doctor'], h.dependencies);
  assert.equal(h.configs[0].envScope, 'production');
  assert.equal(JSON.parse(h.stdout[0]).mode, 'account');
  assert.deepEqual(h.calls.map((call) => call.method), ['listTools']);
  assert.equal(h.stdout.join('').includes('example-secret'), false);
});

test('tools follows every server cursor without calling a business tool', async () => {
  const cursors = [];
  const client = {
    authenticated: false,
    listTools: async ({ cursor }) => {
      cursors.push(cursor);
      return cursor ? { tools: [{ name: 'second' }] } : { tools: [{ name: 'first' }], nextCursor: 'next/page+' };
    },
    callTool: async () => { throw new Error('Must not execute.'); },
  };
  const h = harness({ client });
  await main(['tools', '--anonymous'], h.dependencies);
  assert.deepEqual(cursors, [undefined, 'next/page+']);
  assert.deepEqual(JSON.parse(h.stdout[0]).tools.map((tool) => tool.name), ['first', 'second']);
});

test('tools rejects repeating cursors, duplicate names, malformed cursors, and excessive pages', async () => {
  const cases = [
    (page) => ({ tools: [{ name: 'tool-' + page }], nextCursor: 'repeat' }),
    () => ({ tools: [{ name: 'duplicate' }], nextCursor: 'next' }),
    () => ({ tools: [{ name: 'valid' }], nextCursor: 123 }),
    () => ({ tools: [], nextCursor: 'next' }),
    (page) => ({ tools: [{ name: 'tool-' + page }], nextCursor: 'page-' + page }),
  ];
  for (const resultFor of cases) {
    let pages = 0;
    const h = harness({ client: { authenticated: false, listTools: async () => resultFor(++pages) } });
    await assert.rejects(main(['tools', '--anonymous'], h.dependencies));
    assert.ok(pages <= 100);
    assert.deepEqual(h.stdout, []);
  }
});

test('explicit call preserves the server tool name and reads only the selected input', async (t) => {
  const path = await inputFile(t);
  const h = harness({ readCatalog: async () => { throw new Error('No product-name inference is needed.'); } });
  await main(['call', 'server.exception-name', '--input', path, '--execute'], h.dependencies);
  assert.deepEqual(h.calls, [{ method: 'callTool', name: 'server.exception-name', args: { period: 'sample' } }]);
});

test('explicit submit forwards one request and the user-supplied idempotency key', async (t) => {
  const path = await inputFile(t);
  const h = harness();
  await main(['submit', '--provider', 'naver', '--action', 'naver.report', '--input', path,
    '--idempotency-key', 'stable-request-key', '--execute'], h.dependencies);
  assert.deepEqual(h.calls, [{ method: 'submitJob', job: { provider: 'naver', action: 'naver.report', params: { period: 'sample' } },
    options: { idempotencyKey: 'stable-request-key' } }]);
});

test('wait renders progress on stderr and leaves machine-readable completion on stdout', async () => {
  const h = harness();
  await main(['wait', 'existing-job'], h.dependencies);
  assert.deepEqual(h.stderr, ['자료를 확인하고 있습니다.']);
  assert.equal(JSON.parse(h.stdout[0]).status, 'SUCCEEDED');
  assert.deepEqual(h.calls.map((call) => call.method), ['waitForJob']);
});

test('CLI and real client error path do not expose reflected credentials or replay requests', async () => {
  const secret = 'EXAMPLE_CLIENT_SECRET_DO_NOT_PRINT';
  const env = { XBOSS_CLIENT_ID: 'example-id', XBOSS_CLIENT_SECRET: secret };
  const stdout = [], stderr = [];
  let calls = 0;
  await assert.rejects(main(['doctor'], {
    env, stdout: (value) => stdout.push(value), stderr: (value) => stderr.push(value),
    createClient: (config) => new XbossClient({ ...config, fetchImpl: async () => {
      calls += 1;
      return new Response(JSON.stringify({ error: { code: 'AUTH_CREDENTIAL_INVALID', message: 'Rejected ' + secret } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } });
    } }),
  }), (error) => {
    const publicOutput = JSON.stringify({ error: error.code, message: error.message, next: error.next, recovery: error.recovery });
    assert.equal(publicOutput.includes(secret), false);
    return true;
  });
  assert.equal(calls, 1);
  assert.deepEqual(stdout, []);
  assert.deepEqual(stderr, []);
});


test('search reports omitted matches without changing the JSON array contract', async () => {
  const products = Array.from({ length: 23 }, (_, index) => ({ ...product, id: String(index), slug: 'report-' + index }));
  const h = harness({ readCatalog: async () => ({ products }) });
  await main(['search', '광고'], h.dependencies);
  assert.match(h.stdout[0], /23개 중 20개/);
  assert.match(h.stdout.at(-1), /--limit 23/);
  assert.match(h.stdout[1], /node bin\/xboss.mjs show report-/);
  const json = harness({ readCatalog: async () => ({ products }) });
  await main(['search', '광고', '--json'], json.dependencies);
  assert.equal(json.stdout.length, 1);
  assert.equal(JSON.parse(json.stdout[0]).length, 20);
  assert.equal(json.configs.length, 0);
});

test('schema finds an exact tool without consulting or inferring from the catalog', async () => {
  const tool = { name: 'server.exception-name', title: '선택한 도구', inputSchema: { type: 'object' } };
  const h = harness({
    env: { XBOSS_CLIENT_ID: 'example-id', XBOSS_CLIENT_SECRET: 'example-secret' },
    readCatalog: async () => { throw new Error('An exact current tool needs no catalog lookup.'); },
    client: { listTools: async ({ anonymous }) => { assert.equal(anonymous, true); return { tools: [tool] }; } },
  });
  await main(['schema', tool.name, '--anonymous'], h.dependencies);
  assert.deepEqual(JSON.parse(h.stdout[0]), tool);
  assert.equal(h.configs[0].clientId, undefined);
  assert.equal(h.configs[0].clientSecret, undefined);
});

test('schema resolves a public slug to its declared name across every list page', async () => {
  const tool = { name: product.mcp.name, inputSchema: { type: 'object', required: ['period'] },
    _meta: { 'xdata.kr/credential': { required: true, providers: ['naver'] } } };
  const cursors = [];
  const h = harness({ client: { listTools: async ({ cursor }) => {
    cursors.push(cursor);
    return cursor ? { tools: [tool] } : { tools: [{ name: 'other' }], nextCursor: 'next' };
  } } });
  await main(['schema', product.slug, '--anonymous'], h.dependencies);
  assert.deepEqual(cursors, [undefined, 'next']);
  assert.deepEqual(JSON.parse(h.stdout[0]), tool);
});

test('schema rejects absent and disabled mappings instead of guessing a tool name', async () => {
  const absent = harness({ client: { listTools: async () => ({ tools: [{ name: 'naver__report' }] }) } });
  await assert.rejects(main(['schema', product.slug], absent.dependencies), /현재 목록에 없습니다/);
  assert.deepEqual(absent.stdout, []);
  const disabled = harness({ readCatalog: async () => ({ products: [{ ...product, mcp: { ...product.mcp, enabled: false } }] }) });
  await assert.rejects(main(['schema', product.slug], disabled.dependencies), /현재 목록에 없습니다/);
  const unknown = harness();
  await assert.rejects(main(['schema', 'ACTUAL_SERVER_NAME'], unknown.dependencies), /정확한 도구명/);
  assert.equal(unknown.calls.some((call) => call.method !== 'listTools'), false);
});

test('templates contain only required structure and null values without following references', async () => {
  const inputSchema = { type: 'object', required: ['employees', 'consent', 'date', 'reference', 'choice'], properties: {
    employees: { type: 'array', minItems: 1, items: { type: 'object', required: ['name', 'amount'], properties: {
      name: { type: 'string', default: 'must-not-copy' }, amount: { type: 'integer', default: 0 }, optional: { type: 'string' },
    } } },
    consent: { type: 'boolean', default: true }, date: { type: 'string', enum: ['must-not-copy'] },
    reference: { $ref: 'https://example.invalid/no-fetch' }, choice: { oneOf: [{ type: 'number' }, { type: 'string' }] },
    request_idempotency_key: { type: 'string' },
  } };
  const before = JSON.stringify(inputSchema);
  let listCalls = 0;
  const h = harness({ client: { listTools: async () => { listCalls++; return { tools: [{ name: 'exact', inputSchema }] }; } } });
  await main(['schema', 'exact', '--template'], h.dependencies);
  assert.deepEqual(JSON.parse(h.stdout[0]), {
    employees: [{ name: null, amount: null }], consent: null, date: null, reference: null, choice: null,
  });
  assert.equal(JSON.stringify(inputSchema), before);
  assert.equal(listCalls, 1);
  assert.match(h.stderr.join(''), /미완성.*null.*별도 --execute/);
});

test('missing input files fail in Korean before constructing any network client', async () => {
  const h = harness();
  const missing = join(tmpdir(), 'xboss-missing-' + process.pid + '-' + Date.now(), 'private-input.json');
  await assert.rejects(main(['call', 'actual_server_name', '--input', missing, '--execute'], h.dependencies), (error) => {
    assert.match(error.message, /입력 파일.*--input 파일 경로/);
    assert.equal(error.message.includes(missing), false);
    assert.equal(error.message.includes('ENOENT'), false);
    return true;
  });
  assert.equal(h.configs.length, 0);
  assert.equal(h.calls.length, 0);
});

test('UTF-8 BOM input saved by Windows editors is accepted without changing the values', async (t) => {
  const path = await inputFile(t, '\uFEFF{"period":"sample"}');
  const h = harness();
  await main(['call', 'actual_server_name', '--input', path, '--execute'], h.dependencies);
  assert.deepEqual(h.calls, [{ method: 'callTool', name: 'actual_server_name', args: { period: 'sample' } }]);
});

test('public doctor fallback explicitly directs the user to connect their account', async () => {
  const h = harness({ client: { authenticated: true,
    listTools: async () => ({ tools: [{ name: 'public' }], _meta: { 'xdata.kr/lane': { source: 'anonymous' } } }),
  } });
  await main(['doctor'], h.dependencies);
  const result = JSON.parse(h.stdout[0]);
  assert.equal(result.mode, 'public');
  assert.match(result.message, /내 계정 연결은 확인되지 않았습니다/);
  assert.match(result.next, /--env-file=.env.*doctor/);
});

test('schema and template inspection cannot accept execution flags', async () => {
  for (const args of [['schema', product.slug, '--execute'], ['search', '광고', '--template'], ['schema']]) {
    const h = harness();
    await assert.rejects(main(args, h.dependencies));
    assert.equal(h.configs.length, 0);
    assert.equal(h.calls.length, 0);
  }
});


test('REST connection selection is forwarded at the top level without changing params', async (t) => {
  const path = await inputFile(t);
  const h = harness();
  await main(['submit', '--provider', 'naver', '--action', 'naver.report', '--input', path,
    '--idempotency-key', 'stable-request-key', '--account-link-id', 'example-account-link', '--execute'], h.dependencies);
  assert.deepEqual(h.calls, [{ method: 'submitJob', job: {
    provider: 'naver', action: 'naver.report', params: { period: 'sample' }, account_link_id: 'example-account-link',
  }, options: { idempotencyKey: 'stable-request-key' } }]);
});

test('empty REST connection selection fails before reading input or constructing a client', async () => {
  for (const value of ['', '   ', '\t']) {
    const h = harness();
    await assert.rejects(main(['submit', '--provider', 'naver', '--action', 'naver.report',
      '--input', 'missing.json', '--idempotency-key', 'stable', '--account-link-id', value, '--execute'], h.dependencies),
    /--account-link-id.*생략/);
    assert.equal(h.configs.length, 0);
    assert.equal(h.calls.length, 0);
  }
});

test('account-link-id is accepted only for REST submission', async () => {
  const h = harness();
  await assert.rejects(main(['doctor', '--account-link-id', 'example-account-link'], h.dependencies), /옵션을 사용할 수 없습니다/);
  assert.equal(h.configs.length, 0);
});


test('show carries connector attribution through product information without replacing its canonical URL', async () => {
  const h = harness();
  await main(['show', product.slug, '--json'], h.dependencies);
  const result = JSON.parse(h.stdout[0]);
  assert.equal(result.url, product.url);
  const info = new URL(result.info_url);
  assert.equal(info.searchParams.get('utm_source'), 'xboss-connect');
  assert.equal(info.searchParams.get('utm_medium'), 'connector');
  assert.equal(info.searchParams.get('utm_content'), product.slug);
  const plain = harness();
  await main(['show', product.slug], plain.dependencies);
  assert.ok(plain.stdout[0].includes(result.info_url));
  assert.equal(h.configs.length, 0);
});
