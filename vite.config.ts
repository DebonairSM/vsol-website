import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './client',
  publicDir: 'public',
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client/index.html'),
        agentric: path.resolve(__dirname, 'client/agentric.html'),
        spreadsheet: path.resolve(__dirname, 'client/spreadsheet-automation.html'),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});

