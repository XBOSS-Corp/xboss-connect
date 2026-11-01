#!/usr/bin/env node
import { main } from '../src/cli.mjs';

main().catch((error) => {
  console.error(JSON.stringify({ error: error.code || 'INPUT_ERROR', message: error.message, next: error.next, recovery: error.recovery }, null, 2));
  process.exitCode = 1;
});
