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
        agentic: path.resolve(__dirname, 'client/agentic.html'),
        spreadsheet: path.resolve(__dirname, 'client/spreadsheet-automation.html'),
        secretLeads: path.resolve(__dirname, 'client/secret-leads-viewer.html'),
        referral: path.resolve(__dirname, 'client/referral.html'),
      },
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
});

