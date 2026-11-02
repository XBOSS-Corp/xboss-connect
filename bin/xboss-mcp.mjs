#!/usr/bin/env node
import { createBridgeFromEnvironment } from '../src/mcp-stdio.mjs';

const MAX_MESSAGE_BYTES = 1024 * 1024;
let handle;
try { handle = createBridgeFromEnvironment(); }
catch {
  process.stderr.write('XBOSS 연결 설정을 확인하세요. Client ID와 Client Secret은 함께 설정하고 환경은 production 또는 real_test를 사용합니다.\n');
  process.exitCode = 1;
}
if (handle) {
  let buffer = Buffer.alloc(0);
  let queue = Promise.resolve();
  const pendingIds = new Set();
  const output = value => { if (value !== null) process.stdout.write(JSON.stringify(value) + '\n'); };
  process.stdin.on('data', chunk => {
    buffer = Buffer.concat([buffer, chunk]);
    let end;
    while ((end = buffer.indexOf(10)) !== -1) {
      const line = buffer.subarray(0, end);
      buffer = buffer.subarray(end + 1);
      if (!line.toString('utf8').trim()) continue;
      if (line.length > MAX_MESSAGE_BYTES) { process.stderr.write('MCP 입력 크기 제한을 초과했습니다.\n'); process.exit(1); }
      let message;
      try { message = JSON.parse(line.toString('utf8')); }
      catch { output({ jsonrpc: '2.0', id: null, error: { code: -32700, message: '올바른 JSON 입력이 필요합니다.' } }); continue; }
      const key = message && 'id' in Object(message) ? JSON.stringify(message.id) : null;
      if (key !== null && pendingIds.has(key)) { output({ jsonrpc: '2.0', id: message.id, error: { code: -32600, message: '처리 중인 요청 ID는 재사용할 수 없습니다.' } }); continue; }
      if (key !== null) pendingIds.add(key);
      queue = queue.then(async () => { try { output(await handle(message)); } finally { if (key !== null) pendingIds.delete(key); } });
    }
    if (buffer.length > MAX_MESSAGE_BYTES) { process.stderr.write('MCP 입력 크기 제한을 초과했습니다.\n'); process.exit(1); }
  });
  process.stdin.on('end', () => { if (buffer.toString('utf8').trim()) output({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'MCP 메시지는 줄바꿈으로 끝나야 합니다.' } }); });
}
