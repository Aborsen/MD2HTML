import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import { apiDevServer } from './server/vite-plugin-api';

export default defineConfig({
  plugins: [react(), apiDevServer()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // The converter the function also imports; one implementation, two runtimes.
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  server: {
    port: 5180,
    host: '127.0.0.1',
  },
});
