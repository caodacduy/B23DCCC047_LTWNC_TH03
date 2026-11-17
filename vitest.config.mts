import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    maxWorkers: 2,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: [['text', { skipFull: false }], 'html'],
      include: [
        'src/lib/permissions.ts',
        'src/lib/loan-validate.ts',
        'src/lib/format.ts',
        'src/components/LoanForm.tsx',
      ],
      thresholds: { lines: 70, perFile: true },
    },
  },
});
