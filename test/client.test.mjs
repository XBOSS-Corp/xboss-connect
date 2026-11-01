import test from 'node:test';
import assert from 'node:assert/strict';
import { API_ORIGIN, XbossClient, XbossError } from '../src/client.mjs';

const JOB_ID = 'job_01JC8YH8R0E1ABCDEFGHJKMNPQ';
const credentials = { clientId: 'example-client-id', clientSecret: 'example-client-secret' };

function json(value, status = 200, headers = {}) {
  return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}

function rpc(request, result) {
  return json({ jsonrpc: '2.0', id: JSON.parse(request.body).id, result });
}

test('construction never contacts the network or exposes credentials as public fields', () => {
  let called = false;
  const client = new XbossClient({ ...credentials, fetchImpl: () => { called = true; } });
  assert.equal(called, false);
  assert.equal(client.authenticated, true);
  assert.equal(JSON.stringify(client), '{}');
  assert.throws(() => new XbossClient({ clientId: 'half' }), { code: 'INVALID_INPUT' });
  assert.throws(() => new XbossClient({ envScope: 'sandbox' }), { code: 'INVALID_INPUT' });
});

test('anonymous discovery omits configured credentials and does not execute tools', async () => {
  const calls = [];
  const client = new XbossClient({ ...credentials, fetchImpl: async (url, request) => {
    calls.push({ url, request });
    return rpc(request, { tools: [{ name: 'server_supplied_name', inputSchema: {} }], nextCursor: 'page-two' });
  } });
  const result = await client.listTools({ anonymous: true });
  assert.equal(result.tools[0].name, 'server_supplied_name');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${API_ORIGIN}/mcp`);
  assert.equal(calls[0].request.headers.Authorization, undefined);
  assert.equal(calls[0].request.headers['X-MCP-Env-Scope'], 'real_test');
  assert.equal(calls[0].request.redirect, 'error');
  assert.equal(JSON.parse(calls[0].request.body).method, 'tools/list');
});

test('authenticated MCP preserves tool names and public metadata', async () => {
  const name = 'exceptional.tool-name';
  const client = new XbossClient({ ...credentials, envScope: 'production', fetchImpl: async (_url, request) => {
    assert.equal(request.headers.Authorization, `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`);
    assert.equal(request.headers['X-MCP-Env-Scope'], 'production');
    assert.equal(request.headers['X-Env-Scope'], undefined);
    assert.deepEqual(JSON.parse(request.body).params, { name, arguments: { example: 1 } });
    return rpc(request, { content: [{ type: 'text', text: 'ok' }], _meta: { 'xdata.kr/next': { stage: 'unknown-future-stage' } } });
  } });
  const result = await client.callTool(name, { example: 1 });
  assert.equal(result._meta['xdata.kr/next'].stage, 'unknown-future-stage');
});

test('MCP HTTP 200 JSON-RPC failures preserve next action without replaying', async () => {
  let count = 0;
  const client = new XbossClient({ fetchImpl: async (_url, request) => {
    count += 1;
    return json({ jsonrpc: '2.0', id: JSON.parse(request.body).id, error: {
      code: -32602, message: 'Register a credential.', data: {
        error_code: 'PRIMARY_ACCOUNT_LINK_NOT_FOUND',
        'xdata.kr/next': { stage: 'link_credential', action_url: 'https://console.xdata.kr/credentials' },
      },
    } });
  } });
  await assert.rejects(client.callTool('known_tool'), (error) => {
    assert.ok(error instanceof XbossError);
    assert.equal(error.code, 'PRIMARY_ACCOUNT_LINK_NOT_FOUND');
    assert.equal(error.next.stage, 'link_credential');
    return true;
  });
  assert.equal(count, 1);
});

test('tool failure carries existing-job recovery and never retries execution', async () => {
  let calls = 0;
  const client = new XbossClient({ fetchImpl: async (_url, request) => {
    calls += 1;
    return rpc(request, { isError: true, content: [
      { type: 'text', text: 'Waiting ended; the job is still running.' },
      { type: 'text', text: JSON.stringify({ job_id: JOB_ID, safe_to_retry: false,
        result_tool_call: { name: 'xdata__job__result', arguments: { job_id: JOB_ID } } }) },
    ] });
  } });
  await assert.rejects(client.callTool('known_tool'), (error) => {
    assert.equal(error.code, 'MCP_TOOL_ERROR');
    assert.equal(error.recovery.job_id, JOB_ID);
    assert.equal(error.recovery.safe_to_retry, false);
    assert.equal(error.recovery.result_tool_call.name, 'xdata__job__result');
    return true;
  });
  assert.equal(calls, 1);
});

test('errors redact credentials and authentication tokens, including echoed text', async () => {
  const basic = Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64');
  const client = new XbossClient({ ...credentials, fetchImpl: async () => json({ error: {
    code: 'AUTH_CREDENTIAL_INVALID', message: `Rejected ${credentials.clientSecret} Basic ${basic}`,
    data: { client_secret: credentials.clientSecret, Authorization: `Basic ${basic}`, nested: { access_token: 'test-token' } },
  } }, 401) });
  await assert.rejects(client.listTools(), (error) => {
    const output = `${error.stack} ${JSON.stringify(error)}`;
    for (const secret of [credentials.clientSecret, basic, 'test-token']) assert.equal(output.includes(secret), false);
    assert.equal(error.status, 401);
    return true;
  });
});

test('malformed MCP error content still returns a typed failure without execution replay', async () => {
  const client = new XbossClient({ fetchImpl: async (_url, request) => rpc(request, {
    isError: true, content: { unexpected: 'object' },
  }) });
  await assert.rejects(client.callTool('known_tool'), { name: 'XbossError', code: 'MCP_TOOL_ERROR' });
});

test('REST submit requires an explicit stable idempotency key and preserves 202', async () => {
  let calls = 0;
  const job = { provider: 'example', action: 'example.read', params: { period: 'sample' } };
  const client = new XbossClient({ ...credentials, fetchImpl: async (url, request) => {
    calls += 1;
    assert.equal(url, `${API_ORIGIN}/v1/jobs`);
    assert.equal(request.headers['Idempotency-Key'], 'request-123');
    assert.equal(request.headers['X-Env-Scope'], 'real_test');
    assert.equal(request.headers['X-MCP-Env-Scope'], undefined);
    assert.deepEqual(JSON.parse(request.body), job);
    return json({ job_id: JOB_ID, status: 'QUEUED' }, 202);
  } });
  await assert.rejects(client.submitJob(job), { code: 'INVALID_INPUT' });
  assert.equal(calls, 0);
  assert.equal((await client.submitJob(job, { idempotencyKey: 'request-123' })).job_id, JOB_ID);
  assert.equal(calls, 1);
});

test('REST operations require credentials and reject path injection before fetch', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return json({}); };
  await assert.rejects(new XbossClient({ fetchImpl }).getJob(JOB_ID), { code: 'AUTH_REQUIRED' });
  await assert.rejects(new XbossClient({ ...credentials, fetchImpl }).getResult('../keys'), { code: 'INVALID_INPUT' });
  assert.equal(calls, 0);
});

test('network errors are not retried or echoed', async () => {
  let calls = 0;
  const client = new XbossClient({ ...credentials, fetchImpl: async () => {
    calls += 1;
    throw new Error(`network reflected ${credentials.clientSecret}`);
  } });
  await assert.rejects(client.callTool('known_tool'), (error) => {
    assert.equal(error.code, 'NETWORK_ERROR');
    assert.equal(error.message.includes(credentials.clientSecret), false);
    return true;
  });
  assert.equal(calls, 1);
});

test('redirects, invalid JSON, mismatched MCP ids, and oversized responses fail closed', async () => {
  const fixtures = [
    { response: () => new Response('', { status: 302, headers: { Location: 'https://example.invalid' } }), code: 'UNEXPECTED_REDIRECT' },
    { response: () => new Response('<html>bad gateway</html>', { status: 502 }), code: 'INVALID_RESPONSE' },
    { response: () => json({ jsonrpc: '2.0', id: 'different', result: { tools: [] } }), code: 'INVALID_RESPONSE' },
    { response: () => json({}, 200, { 'Content-Length': String(9 * 1024 * 1024) }), code: 'RESPONSE_TOO_LARGE' },
  ];
  for (const fixture of fixtures) {
    const client = new XbossClient({ fetchImpl: async () => fixture.response() });
    await assert.rejects(client.listTools(), { code: fixture.code });
  }
});

test('request timeout aborts once and does not retry a tool', async () => {
  let calls = 0;
  const client = new XbossClient({ timeoutMs: 10, fetchImpl: async (_url, { signal }) => {
    calls += 1;
    return new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true });
    });
  } });
  await assert.rejects(client.callTool('known_tool'), { code: 'REQUEST_TIMEOUT' });
  assert.equal(calls, 1);
});

test('polling uses only status GET and returns the succeeded status before result fetch', async () => {
  const states = ['QUEUED', 'RUNNING', 'SUCCEEDED'];
  const seen = [];
  const urls = [];
  const client = new XbossClient({ ...credentials, fetchImpl: async (url, request) => {
    urls.push(url);
    assert.equal(request.method, 'GET');
    assert.equal(request.headers['Idempotency-Key'], undefined);
    return json({ job_id: JOB_ID, status: states.shift(), retry_after_seconds: 0.001 });
  } });
  const state = await client.waitForJob(JOB_ID, { onProgress: (value) => seen.push(value.status) });
  assert.equal(state.status, 'SUCCEEDED');
  assert.deepEqual(seen, ['QUEUED', 'RUNNING', 'SUCCEEDED']);
  assert.equal(urls.length, 3);
  assert.ok(urls.every((url) => url === `${API_ORIGIN}/v1/jobs/${JOB_ID}`));
});

test('terminal failures and cancellation stop polling without new submissions', async () => {
  for (const status of ['FAILED', 'TIMEOUT', 'CANCELED']) {
    let calls = 0;
    const client = new XbossClient({ ...credentials, fetchImpl: async () => {
      calls += 1;
      return json({ job_id: JOB_ID, status, error: { message: 'Check the original job.', retryable: false } });
    } });
    await assert.rejects(client.waitForJob(JOB_ID), { code: `JOB_${status}` });
    assert.equal(calls, 1);
  }
});

test('local abort interrupts polling delay and does not cancel the remote job', async () => {
  let calls = 0;
  const abort = new AbortController();
  const client = new XbossClient({ ...credentials, fetchImpl: async () => {
    calls += 1;
    return json({ job_id: JOB_ID, status: 'RUNNING', retry_after_seconds: 30 });
  } });
  await assert.rejects(client.waitForJob(JOB_ID, { signal: abort.signal, onProgress: () => abort.abort() }), { code: 'ABORTED' });
  assert.equal(calls, 1);
});

test('local wait deadline ends without resubmitting or losing the job identifier', async () => {
  let calls = 0;
  const client = new XbossClient({ ...credentials, fetchImpl: async () => {
    calls += 1;
    return json({ job_id: JOB_ID, status: 'RUNNING', retry_after_seconds: 30 });
  } });
  await assert.rejects(client.waitForJob(JOB_ID, { timeoutMs: 20 }), (error) => {
    assert.equal(error.code, 'WAIT_TIMEOUT');
    assert.equal(error.data.job_id, JOB_ID);
    return true;
  });
  assert.equal(calls, 1);
});

test('UUID idempotency keys are accepted once while whitespace, Korean, and oversized keys fail before fetch', async () => {
  let calls = 0;
  const uuid = '550e8400-e29b-41d4-a716-446655440000';
  const client = new XbossClient({ ...credentials, fetchImpl: async (_url, request) => {
    calls += 1;
    assert.equal(request.headers['Idempotency-Key'], uuid);
    return json({ job_id: JOB_ID, status: 'QUEUED' }, 202);
  } });
  const job = { provider: 'example', action: 'example.read', params: {} };
  for (const idempotencyKey of ['', 'request key', ' leading', 'trailing ', '요청키', 'line\nbreak', 'x'.repeat(129)]) {
    await assert.rejects(client.submitJob(job, { idempotencyKey }), { code: 'INVALID_INPUT' });
  }
  assert.equal(calls, 0);
  const result = await client.submitJob(job, { idempotencyKey: uuid });
  assert.equal(result.job_id, JOB_ID);
  assert.equal(calls, 1);
});


test('read-tools example shares complete anonymous pagination and rejects malformed pages', async () => {
  const { readTools } = await import('../examples/read-tools.mjs');
  const requests = [];
  const client = {
    async listTools(options) {
      requests.push(options);
      return requests.length === 1
        ? { tools: [{ name: 'first', description: 'First tool', inputSchema: {} }], nextCursor: 'next/page+' }
        : { tools: [{ name: 'second', description: 'Second tool' }] };
    },
    async callTool() { throw new Error('Business tools must not execute.'); },
  };
  assert.deepEqual(await readTools({ client }), [
    { name: 'first', description: 'First tool' }, { name: 'second', description: 'Second tool' },
  ]);
  assert.deepEqual(requests, [{ anonymous: true }, { anonymous: true, cursor: 'next/page+' }]);
  await assert.rejects(readTools({ client: { listTools: async () => ({ tools: [], nextCursor: 'missing' }) } }), { code: 'INVALID_RESPONSE' });
});
