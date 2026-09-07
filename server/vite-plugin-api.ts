import { getRequestListener } from '@hono/node-server';
import { loadEnv, type Plugin } from 'vite';

const SERVER_ENV_KEYS = ['DATABASE_URL', 'NEON_AUTH_BASE_URL'];

/**
 * Serves the same Hono app the Vercel function uses, so `npm run dev` gives a
 * working /api without the Vercel CLI. The app is imported through Vite's SSR
 * module graph, so backend edits reload on save.
 */
export function apiDevServer(): Plugin {
  return {
    name: 'm2h-api-dev-server',
    apply: 'serve',
    config(_config, { mode }) {
      // Vite only exposes VITE_* to the client; the server half reads
      // process.env, so mirror the private keys into it.
      const env = loadEnv(mode, process.cwd(), '');

      for (const key of SERVER_ENV_KEYS) {
        if (env[key] && !process.env[key]) {
          process.env[key] = env[key];
        }
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        try {
          const module = await server.ssrLoadModule('/server/app.ts');

          getRequestListener(module.default.fetch)(req, res);
        } catch (error) {
          server.ssrFixStacktrace(error as Error);
          next(error);
        }
      });
    },
  };
}
