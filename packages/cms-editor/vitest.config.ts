import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    dir: 'src',
    include: ['**/*.test.ts?(x)'],
    alias: {
      '@axonivy/cms-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/context/test-utils/setup-tests.tsx'],
    css: false,
    reporters: process.env.CI ? ['basic', 'junit'] : ['default'],
    outputFile: 'report.xml'
  }
});
