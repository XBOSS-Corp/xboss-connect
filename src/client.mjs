import { randomUUID } from 'node:crypto';

export const API_ORIGIN = 'https://api.xdata.kr';
const DEFAULT_TIMEOUT_MS = 120_000;
const MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
const MAX_REQUEST_BYTES = 1024 * 1024;
const ENVIRONMENTS = new Set(['real_test', 'production']);
const TERMINAL_FAILURES = new Set(['FAILED', 'TIMEOUT', 'CANCELED']);
const JOB_ID = /^job_[0-9A-HJKMNP-TV-Z]{26}$/;
const SENSITIVE_FIELD = /^(?:authorization|client_?secret|password|api_?key|access_?token|refresh_?token)$/i;

export class XbossError extends Error {
  constructor(message, { code = 'XBOSS_ERROR', status = null, data = null, next = null, recovery = null } = {}) {
    super(message);
    this.name = 'XbossError';
    this.code = code;
    this.status = status;
    this.data = data;
    this.next = next;
    this.recovery = recovery;
  }
}

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function positiveMilliseconds(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0 || value > 2_147_483_647) {
    throw new XbossError(`${name} must be a positive integer in milliseconds.`, { code: 'INVALID_INPUT' });
  }
  return value;
}

function validateJobId(id) {
  if (typeof id !== 'string' || !JOB_ID.test(id)) {
    throw new XbossError('Use the job_id returned when the job was submitted.', { code: 'INVALID_INPUT' });
  }
  return id;
}

function structuredBlocks(result) {
  const blocks = [];
  if (object(result?.structuredContent)) blocks.push(result.structuredContent);
  for (const item of Array.isArray(result?.content) ? result.content : []) {
    if (item?.type !== 'text' || typeof item.text !== 'string') continue;
    try {
      const value = JSON.parse(item.text);
      if (object(value)) blocks.push(value);
    } catch {
      // Human-readable text is not a structured recovery instruction.
    }
  }
  return blocks;
}

function nextAction(value, blocks = []) {
  return value?._meta?.['xdata.kr/next'] ?? value?.['xdata.kr/next'] ?? value?.next
    ?? blocks.find((item) => item['xdata.kr/next'] || item.next)?.['xdata.kr/next']
    ?? blocks.find((item) => item.next)?.next ?? null;
}

function recoveryData(value, blocks = []) {
  const found = [value, ...blocks].find((item) => object(item)
    && ('result_tool_call' in item || 'status_url' in item || 'job_id' in item || 'safe_to_retry' in item));
  if (!found) return null;
  return Object.fromEntries(['job_id', 'status_url', 'result_tool_call', 'safe_to_retry', 'next_action']
    .filter((key) => key in found).map((key) => [key, found[key]]));
}

/** A small client for XBOSS's published REST and remote MCP contracts. */
export class XbossClient {
  #clientId;
  #clientSecret;
  #authorization;
  #fetch;
  #timeoutMs;
  #envScope;

  constructor({ clientId, clientSecret, envScope = 'real_test', fetchImpl = globalThis.fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    if (!ENVIRONMENTS.has(envScope)) {
      throw new XbossError('envScope must be real_test or production.', { code: 'INVALID_INPUT' });
    }
    if (typeof fetchImpl !== 'function') {
      throw new XbossError('A fetch implementation is required.', { code: 'INVALID_INPUT' });
    }
    const hasId = clientId !== undefined && clientId !== null && clientId !== '';
    const hasSecret = clientSecret !== undefined && clientSecret !== null && clientSecret !== '';
    if (hasId !== hasSecret || (hasId && (typeof clientId !== 'string'
      || typeof clientSecret !== 'string' || clientId.includes(':') || !clientId.trim() || !clientSecret.trim()))) {
      throw new XbossError('Set both XBOSS_CLIENT_ID and XBOSS_CLIENT_SECRET.', { code: 'INVALID_INPUT' });
    }
    this.#clientId = hasId ? clientId : '';
    this.#clientSecret = hasSecret ? clientSecret : '';
    this.#authorization = hasId ? `Basic ${Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64')}` : '';
    this.#envScope = envScope;
    this.#fetch = fetchImpl;
    this.#timeoutMs = positiveMilliseconds(timeoutMs, 'timeoutMs');
  }

  get envScope() { return this.#envScope; }
  get authenticated() { return Boolean(this.#authorization); }

  #sanitize(value, depth = 0) {
    if (depth > 30) return '[omitted]';
    if (typeof value === 'string') {
      let safe = value;
      for (const secret of [this.#authorization, this.#authorization.replace(/^Basic /, ''),
        this.#clientSecret, this.#clientId].filter(Boolean).sort((a, b) => b.length - a.length)) {
        safe = safe.split(secret).join('[redacted]');
      }
      return safe;
    }
    if (Array.isArray(value)) return value.map((item) => this.#sanitize(item, depth + 1));
    if (object(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key,
      SENSITIVE_FIELD.test(key) ? '[redacted]' : this.#sanitize(item, depth + 1)]));
    return value;
  }

  #error(message, options = {}) {
    return new XbossError(this.#sanitize(String(message)), this.#sanitize(options));
  }

  async #request(path, { method = 'GET', body, headers = {}, anonymous = false,
    requireAuth = false, signal, timeoutMs = this.#timeoutMs } = {}) {
    if (requireAuth && !this.authenticated) {
      throw this.#error('Set XBOSS_CLIENT_ID and XBOSS_CLIENT_SECRET to use this operation.', { code: 'AUTH_REQUIRED' });
    }
    const requestHeaders = { Accept: 'application/json', ...headers };
    if (!anonymous && this.#authorization) requestHeaders.Authorization = this.#authorization;
    let serialized;
    if (body !== undefined) {
      try { serialized = JSON.stringify(body); } catch {
        throw this.#error('The request must be JSON-serializable.', { code: 'INVALID_INPUT' });
      }
      if (serialized === undefined || Buffer.byteLength(serialized, 'utf8') > MAX_REQUEST_BYTES) {
        throw this.#error('The JSON request exceeds the client size limit.', { code: 'REQUEST_TOO_LARGE' });
      }
      requestHeaders['Content-Type'] = 'application/json';
    }
    const controller = new AbortController();
    const duration = positiveMilliseconds(timeoutMs, 'timeoutMs');
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, duration);
    const requestSignal = signal ? AbortSignal.any([controller.signal, signal]) : controller.signal;
    let response;
    try {
      response = await this.#fetch(`${API_ORIGIN}${path}`, {
        method, headers: requestHeaders, body: serialized, signal: requestSignal, redirect: 'error',
      });
      if (response.redirected || (response.status >= 300 && response.status < 400)) {
        throw this.#error('The API redirected the request; it was not followed.', { code: 'UNEXPECTED_REDIRECT', status: response.status });
      }
      if (Number(response.headers.get('content-length')) > MAX_RESPONSE_BYTES) {
        await response.body?.cancel();
        throw this.#error('The response exceeds the client size limit.', { code: 'RESPONSE_TOO_LARGE', status: response.status });
      }
      const chunks = [];
      let size = 0;
      if (response.body) {
        const reader = response.body.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > MAX_RESPONSE_BYTES) {
              await reader.cancel();
              throw this.#error('The response exceeds the client size limit.', { code: 'RESPONSE_TOO_LARGE', status: response.status });
            }
            chunks.push(Buffer.from(value));
          }
        } finally { reader.releaseLock(); }
      }
      let payload;
      try { payload = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch {
        throw this.#error('The API returned an unreadable JSON response.', { code: 'INVALID_RESPONSE', status: response.status });
      }
      if (!object(payload)) {
        throw this.#error('The API returned an unexpected JSON response.', { code: 'INVALID_RESPONSE', status: response.status });
      }
      if (!response.ok) {
        const detail = object(payload.error) ? payload.error : payload;
        const data = detail.data ?? detail;
        throw this.#error(detail.message ?? `The API returned HTTP ${response.status}.`, {
          code: data.error_code ?? detail.code ?? 'HTTP_ERROR', status: response.status, data,
          next: nextAction(data), recovery: recoveryData(data),
        });
      }
      return payload;
    } catch (error) {
      if (error instanceof XbossError) throw error;
      if (timedOut) throw this.#error('The request timed out. A submitted operation may still be running; do not automatically submit it again.', { code: 'REQUEST_TIMEOUT' });
      if (signal?.aborted) throw this.#error('Local waiting was stopped. This does not cancel a server job.', { code: 'ABORTED' });
      throw this.#error('The API could not be reached. Check the connection before trying again.', { code: 'NETWORK_ERROR' });
    } finally { clearTimeout(timer); }
  }

  async #rpc(method, params, options = {}) {
    const id = randomUUID();
    const payload = await this.#request('/mcp', {
      method: 'POST', body: { jsonrpc: '2.0', id, method, params },
      headers: { 'X-MCP-Env-Scope': this.#envScope }, ...options,
    });
    if (!object(payload) || payload.jsonrpc !== '2.0' || payload.id !== id) {
      throw this.#error('The API returned an unexpected MCP response.', { code: 'INVALID_RESPONSE' });
    }
    if (object(payload.error)) {
      const detail = payload.error;
      const data = detail.data ?? {};
      throw this.#error(detail.message ?? 'MCP rejected the request.', {
        code: data.error_code ?? detail.code ?? 'MCP_ERROR', status: 200, data,
        next: nextAction(data), recovery: recoveryData(data),
      });
    }
    if (!object(payload.result)) {
      throw this.#error('The MCP response did not contain a result.', { code: 'INVALID_RESPONSE' });
    }
    const result = payload.result;
    if (result.isError === true) {
      const blocks = structuredBlocks(result);
      const text = (Array.isArray(result.content) ? result.content : [])
        .find((item) => item?.type === 'text' && typeof item.text === 'string')?.text;
      throw this.#error(text ?? 'The requested operation did not finish successfully.', {
        code: blocks.find((item) => item.error_code)?.error_code ?? 'MCP_TOOL_ERROR', status: 200,
        data: result, next: nextAction(result, blocks), recovery: recoveryData(result, blocks),
      });
    }
    return result;
  }

  /** Returns a catalog result; it does not execute a business operation. */
  async listTools({ anonymous = false, cursor } = {}) {
    if (cursor !== undefined && (typeof cursor !== 'string' || !cursor)) {
      throw this.#error('cursor must be a non-empty string.', { code: 'INVALID_INPUT' });
    }
    const result = await this.#rpc('tools/list', cursor ? { cursor } : {}, { anonymous });
    if (!Array.isArray(result.tools)) {
      throw this.#error('The MCP response did not contain a tool list.', { code: 'INVALID_RESPONSE' });
    }
    return result;
  }

  /** Explicit execution. Names and arguments must come from tools/list. */
  async callTool(name, args = {}) {
    if (typeof name !== 'string' || !name.trim() || name.length > 256 || !object(args)) {
      throw this.#error('Provide a tool name from tools/list and a JSON argument object.', { code: 'INVALID_INPUT' });
    }
    return this.#rpc('tools/call', { name, arguments: args });
  }

  async submitJob(job, { idempotencyKey } = {}) {
    if (!object(job) || typeof job.provider !== 'string' || !job.provider.trim()
      || typeof job.action !== 'string' || !job.action.trim() || !object(job.params)) {
      throw this.#error('Provide provider, action, and a params object.', { code: 'INVALID_INPUT' });
    }
    if (typeof idempotencyKey !== 'string' || !/^[\x21-\x7e]{1,128}$/.test(idempotencyKey)) {
      throw this.#error('Provide a stable ASCII idempotencyKey (1–128 characters).', { code: 'INVALID_INPUT' });
    }
    const result = await this.#request('/v1/jobs', {
      method: 'POST', body: job, requireAuth: true,
      headers: { 'X-Env-Scope': this.#envScope, 'Idempotency-Key': idempotencyKey },
    });
    if (!object(result) || typeof result.job_id !== 'string' || !JOB_ID.test(result.job_id)) {
      throw this.#error('The submit response did not contain a valid job_id. Keep the idempotency key before attempting recovery.', { code: 'INVALID_RESPONSE' });
    }
    return result;
  }

  async getJob(id, { signal, timeoutMs } = {}) {
    return this.#request(`/v1/jobs/${validateJobId(id)}`, {
      requireAuth: true, headers: { 'X-Env-Scope': this.#envScope }, signal, timeoutMs,
    });
  }

  async getResult(id, { signal, timeoutMs } = {}) {
    return this.#request(`/v1/jobs/${validateJobId(id)}/result`, {
      requireAuth: true, headers: { 'X-Env-Scope': this.#envScope }, signal, timeoutMs,
    });
  }

  /** Polls an existing job only. Stopping local waiting never cancels that job. */
  async waitForJob(id, { timeoutMs = 300_000, onProgress, signal } = {}) {
    validateJobId(id);
    const deadline = Date.now() + positiveMilliseconds(timeoutMs, 'timeoutMs');
    while (true) {
      if (signal?.aborted) throw this.#error('Local waiting was stopped. This does not cancel the server job.', { code: 'ABORTED', data: { job_id: id } });
      const remaining = deadline - Date.now();
      if (remaining <= 0) throw this.#error('Local waiting timed out. Check this job again to retrieve its result.', { code: 'WAIT_TIMEOUT', data: { job_id: id } });
      let state;
      try {
        state = await this.getJob(id, { signal, timeoutMs: Math.min(this.#timeoutMs, remaining) });
      } catch (error) {
        if (error instanceof XbossError && error.code === 'REQUEST_TIMEOUT' && Date.now() >= deadline) {
          throw this.#error('Local waiting timed out. Check this job again to retrieve its result.', { code: 'WAIT_TIMEOUT', data: { job_id: id } });
        }
        throw error;
      }
      if (!object(state) || state.job_id !== id) {
        throw this.#error('The status response does not match the requested job.', { code: 'INVALID_RESPONSE' });
      }
      if (typeof onProgress === 'function') await onProgress(state);
      if (state.status === 'SUCCEEDED') return state;
      if (TERMINAL_FAILURES.has(state.status)) {
        throw this.#error(state.error?.message ?? `Job ended with ${state.status}.`, {
          code: `JOB_${state.status}`, data: state,
          recovery: { job_id: id, safe_to_retry: state.error?.retryable === true },
        });
      }
      if (state.status !== 'QUEUED' && state.status !== 'RUNNING') {
        throw this.#error('The API returned an unknown job status.', { code: 'INVALID_RESPONSE', data: { job_id: id } });
      }
      const retrySeconds = Number(state.retry_after_seconds);
      const delayMs = Number.isFinite(retrySeconds) && retrySeconds > 0 ? Math.max(100, retrySeconds * 1000) : 1000;
      await new Promise((resolve) => {
        const delay = Math.max(1, Math.min(delayMs, deadline - Date.now()));
        const finish = () => { clearTimeout(timer); signal?.removeEventListener('abort', finish); resolve(); };
        const timer = setTimeout(finish, delay);
        signal?.addEventListener('abort', finish, { once: true });
        if (signal?.aborted) finish();
      });
    }
  }
}

/** Reads every tool-list page without executing a tool. */
export async function readAllTools(client, { anonymous = false } = {}) {
  const tools = [];
  const names = new Set();
  const cursors = new Set();
  let first;
  let cursor;
  for (let page = 0; page < 100; page++) {
    const result = await client.listTools({ anonymous, ...(cursor === undefined ? {} : { cursor }) });
    if (!result || !Array.isArray(result.tools)) throw new XbossError('도구 목록 응답 형식을 확인할 수 없습니다.', { code: 'INVALID_RESPONSE' });
    first ??= result;
    for (const tool of result.tools) {
      if (!tool || typeof tool.name !== 'string' || !tool.name.trim() || names.has(tool.name)) {
        throw new XbossError('도구 목록에 잘못되거나 중복된 이름이 있습니다. 다시 확인하세요.', { code: 'INVALID_RESPONSE' });
      }
      names.add(tool.name);
      tools.push(tool);
    }
    if (result.nextCursor === undefined) {
      const complete = { ...first, tools };
      delete complete.nextCursor;
      return complete;
    }
    if (!result.tools.length || typeof result.nextCursor !== 'string' || !result.nextCursor
      || cursors.has(result.nextCursor)) {
      throw new XbossError('도구 목록 페이지가 누락되거나 반복됩니다. 다시 확인하세요.', { code: 'INVALID_RESPONSE' });
    }
    cursor = result.nextCursor;
    cursors.add(cursor);
  }
  throw new XbossError('도구 목록 페이지 수가 예상 범위를 넘었습니다.', { code: 'INVALID_RESPONSE' });
}
