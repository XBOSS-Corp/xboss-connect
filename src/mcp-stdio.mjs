import { XbossClient, readAllTools } from './client.mjs';

// Explicit aliases preserve both workflows without truncating or hiding tools.
const ALIASES = new Map([
  ['nhis_edi__certificates__workplace_application_notice__apply__init', 'nhis_edi__certificates__workplace_notice__apply__init'],
  ['nhis_edi__certificates__workplace_application_notice__issued__init', 'nhis_edi__certificates__workplace_notice__issued__init'],
]);
const SUPPORTED_VERSIONS = new Set(['2024-11-05', '2025-03-26', '2025-06-18', '2025-11-25']);
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function createStdioBridge(client) {
  const names = new Map();
  const response = (id, result) => ({ jsonrpc: '2.0', id, result });
  const failure = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });
  return async message => {
    if (!isObject(message) || message.jsonrpc !== '2.0' || typeof message.method !== 'string'
      || ('id' in message && typeof message.id !== 'string' && !Number.isSafeInteger(message.id))) {
      return failure(null, -32600, '올바른 JSON-RPC 요청이 필요합니다.');
    }
    if (!('id' in message)) return null;
    const { id, method } = message;
    const params = message.params ?? {};
    if (!isObject(params)) return failure(id, -32602, 'params는 객체여야 합니다.');
    try {
      if (method === 'initialize') {
        return response(id, {
          protocolVersion: SUPPORTED_VERSIONS.has(params.protocolVersion) ? params.protocolVersion : '2025-06-18',
          capabilities: { tools: {} },
          serverInfo: { name: 'xboss-connect', version: '0.1.3' },
          instructions: 'XBOSS의 현재 도구와 입력을 확인하고 요청한 업무만 실행하세요. 발행, 신고, 신청, 초안 저장의 효과를 확인하고 서버의 확인 절차를 따르세요. 비밀키는 채팅에 요청하지 마세요. 계정 설정은 https://console.xdata.kr/api 에서 진행합니다.',
        });
      }
      if (method === 'ping') return response(id, {});
      if (method === 'tools/list') {
        const result = await readAllTools(client, { anonymous: !client.authenticated });
        const resolved = new Map();
        const tools = result.tools.map(tool => {
          const name = ALIASES.get(tool.name) ?? tool.name;
          if (!/^[a-zA-Z0-9_-]{1,64}$/.test(name) || resolved.has(name)) {
            throw new Error('도구 이름의 길이 또는 중복 오류가 있습니다. 최신 연결 패키지를 확인하세요.');
          }
          resolved.set(name, tool.name);
          return { ...tool, name };
        });
        names.clear();
        for (const [name, original] of resolved) names.set(name, original);
        return response(id, { ...result, tools });
      }
      if (method === 'tools/call') {
        if (!client.authenticated) {
          return response(id, { isError: true, content: [{ type: 'text', text: '실제 업무에는 XBOSS 계정 연결이 필요합니다. https://console.xdata.kr/api 에서 Client ID와 Client Secret을 확인하고 앱의 로컬 환경변수 XBOSS_CLIENT_ID, XBOSS_CLIENT_SECRET에 설정하세요. 비밀값을 채팅에 보내지 마세요. 공개 목록 조회만으로 업무가 실행되지는 않습니다.' }] });
        }
        if (typeof params.name !== 'string' || !names.has(params.name) || !isObject(params.arguments ?? {})) {
          return failure(id, -32602, '현재 tools/list에 있는 도구와 올바른 입력 객체를 사용하세요.');
        }
        const result = await client.callTool(names.get(params.name), params.arguments ?? {});
        return response(id, result);
      }
      return failure(id, -32601, '이 연결은 initialize, ping, tools/list, tools/call을 지원합니다.');
    } catch (error) {
      // The existing client sanitizes server errors. Never serialize process.env or the client.
      if (method === 'tools/call' && error.data?.isError === true) return response(id, error.data);
      if (method !== 'tools/call') return failure(id, -32603, 'XBOSS 도구 목록을 확인하지 못했습니다. 연결과 최신 패키지를 확인하세요.');
      return response(id, { isError: true, content: [{ type: 'text', text: 'XBOSS 연결 또는 작업을 완료하지 못했습니다. 기존 작업이 있으면 상태를 먼저 확인하고 자동 재제출하지 마세요.' }],
        _meta: { 'xboss.errorCode': String(error.code ?? 'CONNECTION_ERROR'), ...(error.next ? { 'xdata.kr/next': error.next } : {}), ...(error.recovery ? { 'xboss.recovery': error.recovery } : {}) } });
    }
  };
}

export function createBridgeFromEnvironment(env = process.env, options = {}) {
  const clean = value => typeof value === 'string' && /^\$\{[^}]+\}$/.test(value) ? undefined : value;
  return createStdioBridge(new XbossClient({
    clientId: clean(env.XBOSS_CLIENT_ID), clientSecret: clean(env.XBOSS_CLIENT_SECRET),
    envScope: env.XBOSS_ENV_SCOPE || 'production', ...options,
  }));
}
