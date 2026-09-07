import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import type { Context } from 'hono';
import { jwtVerify, SignJWT } from 'jose';

const COOKIE_NAME = 'm2h_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;

  if (!value || value.length < 32) {
    throw new Error('AUTH_SECRET is not set (needs at least 32 characters)');
  }

  return new TextEncoder().encode(value);
}

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string;
  picture?: string;
}

export async function issueSession(c: Context, payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function readSession(c: Context): Promise<SessionPayload | null> {
  const token = getCookie(c, COOKIE_NAME);

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret());

    return {
      userId: String(payload.userId ?? payload.sub),
      email: String(payload.email ?? ''),
      name: payload.name ? String(payload.name) : undefined,
      picture: payload.picture ? String(payload.picture) : undefined,
    };
  } catch {
    return null;
  }
}

export function clearSession(c: Context) {
  deleteCookie(c, COOKIE_NAME, { path: '/' });
}
