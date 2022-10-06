import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, './package/index.ts'),
      name: 'index',
      fileName: 'index',
    },
  },
  server: {
    port: 8899,
  },
});
