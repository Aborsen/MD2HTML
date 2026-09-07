import { handle } from 'hono/vercel';
import app from '../server/app';

export const config = { runtime: 'nodejs' };

export default handle(app);
