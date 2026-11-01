import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { XbossClient, readAllTools } from '../src/client.mjs';

/** Reads public tool declarations without executing a product. */
export async function readTools({ client = new XbossClient({ envScope: 'real_test' }) } = {}) {
  const result = await readAllTools(client, { anonymous: true });
  return result.tools.map(({ name, description }) => ({ name, description }));
}

if (process.argv[1] && relative(fileURLToPath(import.meta.url), resolve(process.argv[1])) === '') {
  readTools()
    .then((tools) => console.log(JSON.stringify(tools, null, 2)))
    .catch((error) => {
      console.error(error.code ? `[${error.code}] ${error.message}` : '도구 목록을 읽지 못했습니다. 연결 안내를 확인하세요.');
      process.exitCode = 1;
    });
}
