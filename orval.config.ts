import { defineConfig } from 'orval';
export default defineConfig({
  api: {
    input: './openapi.yaml',
    output: {
      target: './packages/api-client/src/index.ts',
      client: 'fetch',
      override: {
        mutator: { path: './packages/api-client/src/fetcher.ts', name: 'customFetch' },
      },
    },
  },
});
