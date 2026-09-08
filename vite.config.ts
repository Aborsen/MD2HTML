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
  /*
   * One Node-ism, replaced rather than shimmed.
   *
   * node-html-markdown guards two timing calls with `if (process.env.LOG_PERF)`, and in a browser
   * there is no `process` at all — so the HTML converter threw "process is not defined" the first
   * time anything used it, and the app reported it as a file it could not read. Defining the one
   * expression turns the branch into `if (false)`, which then disappears. A global `process` shim
   * would have covered this and hidden the next one.
   */
  define: {
    'process.env.LOG_PERF': 'false',
  },
  server: {
    port: 5180,
    host: '127.0.0.1',
  },
});
