import { neon } from '@neondatabase/serverless';

let cached: ReturnType<typeof neon> | null = null;

/** Neon HTTP client — one per process, created lazily. */
export function sql() {
  if (!cached) {
    const url = process.env.DATABASE_URL;

    if (!url) {
      throw new Error('DATABASE_URL is not set');
    }

    cached = neon(url);
  }

  return cached;
}

export interface DocumentRow {
  id: string;
  name: string;
  /** Which conversion produced it, from shared/conversions. */
  kind: string;
  size: number;
  stats: Record<string, number>;
  created_at: string;
  markdown?: string;
}
