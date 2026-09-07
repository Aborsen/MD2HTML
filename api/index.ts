/**
 * The Vercel entry point. `vercel.json` rewrites every /api/* path here, and the Hono app routes
 * on the original URL.
 *
 * The handler is a plain Node request listener rather than hono/vercel's `handle`: on the Node
 * runtime Vercel calls it with (req, res), and the Web-handler version never answers that — every
 * call ended in FUNCTION_INVOCATION_TIMEOUT. It is the same listener the Vite dev middleware uses,
 * so local and deployed behaviour come from one path.
 */
import { getRequestListener } from '@hono/node-server';
import app from '../server/app.js';

export default getRequestListener(app.fetch);
