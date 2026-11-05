import { spawn } from 'node:child_process';
import path from 'node:path';

const nextBin = path.resolve('node_modules/.bin/next');

const child = spawn(nextBin, ['dev', '-p', '3000', '-H', '0.0.0.0'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3000',
    HOSTNAME: '0.0.0.0',
    NODE_ENV: 'development',
  },
});

process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
