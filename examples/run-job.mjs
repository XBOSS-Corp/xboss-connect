import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { XbossClient } from '../src/client.mjs';

const USAGE = 'node --env-file=.env examples/run-job.mjs --provider PROVIDER --action ACTION --input input.json --idempotency-key REQUEST_UUID --execute';

/** Submits one explicitly requested job. Importing this module does not run it. */
export async function main(argv = process.argv.slice(2)) {
  const { values } = parseArgs({
    args: argv,
    allowPositionals: false,
    options: {
      provider: { type: 'string' },
      action: { type: 'string' },
      input: { type: 'string' },
      'idempotency-key': { type: 'string' },
      execute: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  });

  if (values.help || argv.length === 0) {
    console.log(USAGE);
    return;
  }
  if (!values.execute) throw new Error('실제 작업을 제출하려면 --execute를 지정하세요.');
  for (const key of ['provider', 'action', 'input', 'idempotency-key']) {
    if (!values[key]?.trim()) throw new Error(`--${key} 값이 필요합니다.`);
  }

  let params;
  try {
    params = JSON.parse(await readFile(values.input, 'utf8'));
  } catch {
    throw new Error('입력 파일을 읽을 수 없거나 JSON 형식이 올바르지 않습니다.');
  }
  if (params === null || Array.isArray(params) || typeof params !== 'object') {
    throw new Error('입력 파일에는 선택한 상품의 params 객체를 넣으세요.');
  }

  const client = new XbossClient({
    clientId: process.env.XBOSS_CLIENT_ID,
    clientSecret: process.env.XBOSS_CLIENT_SECRET,
    envScope: process.env.XBOSS_ENV_SCOPE || 'real_test',
  });
  const job = await client.submitJob(
    { provider: values.provider, action: values.action, params },
    { idempotencyKey: values['idempotency-key'] },
  );
  console.log(JSON.stringify({ job_id: job.job_id, status: job.status }));
  await client.waitForJob(job.job_id, {
    onProgress: (status) => console.error(status.progress_message || status.status),
  });
  console.log(JSON.stringify(await client.getResult(job.job_id), null, 2));
}

if (process.argv[1] && relative(fileURLToPath(import.meta.url), resolve(process.argv[1])) === '') {
  main().catch((error) => {
    console.error(error.code ? `[${error.code}] ${error.message}` : error.message);
    process.exitCode = 1;
  });
}
