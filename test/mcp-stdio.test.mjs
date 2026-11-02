import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createStdioBridge, createBridgeFromEnvironment } from '../src/mcp-stdio.mjs';

const original = 'nhis_edi__certificates__workplace_application_notice__issued__init';
const alias = 'nhis_edi__certificates__workplace_notice__issued__init';
const request = (id, method, params = {}) => ({ jsonrpc: '2.0', id, method, params });
const tools = [{ name: original, description: '기관 입력 서식', inputSchema: { type: 'object' }, annotations: { readOnlyHint: true } }];

test('stdio initialization and ping do not connect or grant business access', async () => {
  const bridge = createStdioBridge({});
  const init = await bridge(request(1, 'initialize', { protocolVersion: '2025-11-25' }));
  assert.equal(init.result.protocolVersion, '2025-11-25');
  assert.deepEqual(init.result.capabilities, { tools: {} });
  assert.deepEqual((await bridge(request(2, 'ping'))).result, {});
  assert.equal(await bridge({ jsonrpc: '2.0', method: 'notifications/initialized' }), null);
});

test('stdio preserves schemas and annotations, and dispatches a short alias to the original tool exactly once', async () => {
  const calls = [];
  const bridge = createStdioBridge({ authenticated: true,
    listTools: async () => ({ tools }), callTool: async (...args) => { calls.push(args); return { content: [{ type: 'text', text: '확인 완료' }] }; } });
  const list = await bridge(request(1, 'tools/list'));
  assert.equal(list.result.tools[0].name, alias);
  assert.deepEqual(list.result.tools[0].inputSchema, tools[0].inputSchema);
  assert.deepEqual(list.result.tools[0].annotations, tools[0].annotations);
  await bridge(request(2, 'tools/call', { name: alias, arguments: { selected: 'confirmed' } }));
  assert.deepEqual(calls, [[original, { selected: 'confirmed' }]]);
});

test('stdio refuses unknown tools and does not call protected operations without credentials', async () => {
  let calls = 0;
  const client = { authenticated: false, callTool: async () => { calls++; } };
  const denied = await createStdioBridge(client)(request(1, 'tools/call', { name: alias }));
  assert.equal(denied.result.isError, true);
  assert.equal(calls, 0);
  client.authenticated = true;
  assert.equal((await createStdioBridge(client)(request(2, 'tools/call', { name: alias }))).error.code, -32602);
  assert.equal(calls, 0);
});

test('stdio detects alias collisions rather than losing a workflow', async () => {
  const bridge = createStdioBridge({ authenticated: false, listTools: async () => ({ tools: [...tools, { ...tools[0], name: alias }] }) });
  assert.equal((await bridge(request(1, 'tools/list'))).error.code, -32603);
});

test('stdio does not retry an uncertain business request and preserves safe recovery instructions', async () => {
  let calls = 0;
  const bridge = createStdioBridge({ authenticated: true, listTools: async () => ({ tools }), callTool: async () => {
    calls++; throw Object.assign(new Error('private failure'), { code: 'REQUEST_TIMEOUT', recovery: { job_id: 'existing-job', safe_to_retry: false } });
  } });
  await bridge(request(1, 'tools/list'));
  const result = await bridge(request(2, 'tools/call', { name: alias }));
  assert.equal(calls, 1);
  assert.equal(result.result._meta['xboss.recovery'].safe_to_retry, false);
  assert.equal(JSON.stringify(result).includes('private failure'), false);
});

test('stdio environment configuration uses existing Basic API authentication without exposing secrets', async () => {
  const clientId = 'example-client-id';
  const clientSecret = 'example-client-secret';
  const bridge = createBridgeFromEnvironment({ XBOSS_CLIENT_ID: clientId, XBOSS_CLIENT_SECRET: clientSecret }, { fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.xdata.kr/mcp');
    assert.equal(options.headers['X-MCP-Env-Scope'], 'production');
    assert.equal(options.headers.Authorization, `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`);
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: JSON.parse(options.body).id, result: { tools } }));
  } });
  const result = await bridge(request(1, 'tools/list'));
  assert.equal(result.result.tools[0].name, alias);
  assert.equal(JSON.stringify(result).includes(clientSecret), false);
});

test('stdio executable emits only protocol messages and handles invalid JSON', async () => {
  const child = spawn(process.execPath, ['bin/xboss-mcp.mjs'], { cwd: new URL('../', import.meta.url), env: { PATH: process.env.PATH } });
  let stdout = '', stderr = '';
  child.stdout.on('data', b => { stdout += b; });
  child.stderr.on('data', b => { stderr += b; });
  child.stdin.end(JSON.stringify(request(1, 'initialize')) + '\ninvalid\n' + JSON.stringify(request(2, 'ping')) + '\n');
  await new Promise((resolve, reject) => { child.on('exit', resolve); child.on('error', reject); });
  const replies = stdout.trim().split('\n').map(JSON.parse);
  assert.equal(replies.length, 3);
  assert.equal(replies.find(r => r.id === 1).result.serverInfo.name, 'xboss-connect');
  assert.equal(replies.find(r => r.error).error.code, -32700);
  assert.equal(stderr, '');
});
