import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

function normalizeBasePath(value: string | undefined) {
  if (!value) return '/';
  if (value === './' || value === '.') return './';
  let next = value;
  if (!next.startsWith('/')) {
    next = `/${next}`;
  }
  if (!next.endsWith('/')) {
    next = `${next}/`;
  }
  return next;
}

export default defineConfig(({ command }) => {
  const basePath = normalizeBasePath(process.env.VITE_BASE_PATH);

  return {
    base: command === 'serve' ? '/' : basePath,
    plugins: [react()],
    resolve: {
      alias: {
        '@termslaw/state-data': resolve(__dirname, '../state-data/src'),
        '@': resolve(__dirname, './src')
      }
    },
    test: {
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      globals: true
    }
  };
});
