import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    'import.meta.vitest': false,
  },
  test: {
    globals: true,
    environment: 'node',
    /**
     * for in-source testing.
     * {@link https://vitest.dev/guide/in-source.html}
     */
    includeSource: ['src/**/*.ts'],
  },
  resolve: {
    alias: {
      '@/': `${__dirname}/src/`,
      '@root/': `${__dirname}/`,
    },
  },
});
