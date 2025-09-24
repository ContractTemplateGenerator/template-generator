import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    alias: {
      '@termslaw/templates': resolve(__dirname, '../templates/src'),
      '@termslaw/state-data': resolve(__dirname, '../state-data/src')
    }
  }
});
