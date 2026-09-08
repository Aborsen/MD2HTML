import type { Context } from 'hono';

/**
 * Neon Auth, served from our own origin.
 *
 * Neon Auth lives on a Neon hostname. Talking to it directly from the page would make its session
 * cookie a third-party cookie for this site, which browsers are progressively refusing to carry.
 * So everything under /api/auth/* is forwarded and the Set-Cookie on the way back has its Domain
 * attribute stripped: the cookie then belongs to this site, first-party and carried without
 * argument.
 *
 * A deliberately dumb proxy — it does not interpret Better Auth's protocol. The one exception is
 * `finish`, where a one-time verifier is exchanged for a session, because only a server can do that.
 */

const authBase = () => process.env.NEON_AUTH_BASE_URL?.replace(/\/$/, '') ?? '';

/** The name Neon Auth gives the one-time value that completes an OAuth sign-in. */
const VERIFIER = 'neon_auth_session_verifier';

/** Headers that describe the hop rather than the request. */
const HOP_BY_HOP = new Set([
  'host',
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'proxy-authorization',
  'proxy-authenticate',
  'te',
  'trailer',
  'content-length',
  'accept-encoding',
]);

/** Headers describing OUR hop, which the upstream must not see. */
const OUR_HOP = /^(x-forwarded-|x-vercel-|x-real-ip$|forwarded$|cdn-loop$)/i;

/** The long-lived session cookie — the only one with no cross-site work left to do. */
const SESSION_COOKIE = /session_token/i;

/** The origin this deployment is reached on; Better Auth checks it against its trusted list. */
export function selfOrigin(c: Context): string {
  const url = new URL(c.req.url);
  const host = c.req.header('x-forwarded-host') ?? c.req.header('host') ?? url.host;
  const proto =
    c.req.header('x-forwarded-proto') ?? url.protocol.replace(':', '');

  return `${proto}://${host}`;
}

/**
 * Makes an upstream cookie belong to THIS site: Domain and Partitioned are dropped, the session
 * cookie becomes SameSite=Lax, and the short-lived OAuth machinery keeps SameSite=None — which is
 * only honoured on a Secure cookie, so the two travel together.
 */
function firstParty(cookie: string): string {
  const name = cookie.split('=', 1)[0].trim();
  const owned = cookie
    .replace(/;\s*Domain=[^;]*/i, '')
    .replace(/;\s*Partitioned/i, '');

  if (SESSION_COOKIE.test(name)) {
    return owned.replace(/;\s*SameSite=None/i, '; SameSite=Lax');
  }

  const cross = /;\s*SameSite=(Lax|Strict)/i.test(owned)
    ? owned.replace(/;\s*SameSite=(Lax|Strict)/i, '; SameSite=None')
    : /;\s*SameSite=None/i.test(owned)
      ? owned
      : `${owned}; SameSite=None`;

  return /;\s*Secure/i.test(cross) ? cross : `${cross}; Secure`;
}

function upstreamCookies(response: Response): string[] {
  return typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : ([response.headers.get('set-cookie')].filter(Boolean) as string[]);
}

export interface SessionUser {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
}

/**
 * Who is calling. A session is verified by asking Neon Auth, never by decoding anything here — if
 * the issuer says the session is good it is, and this app holds no signing key.
 */
export async function currentUser(c: Context): Promise<SessionUser | null> {
  const base = authBase();
  const cookie = c.req.header('cookie') ?? '';

  if (!base || !cookie.includes('session_token')) {
    return null;
  }

  try {
    const response = await fetch(`${base}/get-session`, {
      headers: { cookie, accept: 'application/json' },
    });

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as { user?: SessionUser } | null;
    const user = body?.user;

    if (!user?.id) {
      return null;
    }

    return {
      id: user.id,
      name: String(user.name ?? user.email ?? 'Someone').slice(0, 120),
      email: user.email ? String(user.email).slice(0, 200) : null,
      image: user.image ? String(user.image).slice(0, 500) : null,
    };
  } catch {
    return null;
  }
}

/**
 * Google redirects to Neon's own host — the redirect_uri is fixed to their domain — so Neon
 * completes its half and sends the browser back here carrying a one-time verifier. Turning that
 * verifier into a session reads the session-challenge cookie and sets the session cookie that comes
 * back; both need a server, which is why the callback lands here rather than on the page.
 */
async function finishSignIn(c: Context): Promise<Response> {
  const origin = selfOrigin(c);
  const here = new URL(c.req.url);
  const verifier = here.searchParams.get(VERIFIER);
  /*
   * `to` arrives in a link, and a link is something anybody can write, so it is not enough for it
   * to be relative: it has to be one of this app's own destinations. The list is the app's pages
   * plus the consent step an assistant sends people through.
   */
  const requested = (here.searchParams.get('to') ?? '/').replace(/^[^/]*\/\//, '/');
  const asked = requested.startsWith('/') ? requested : `/${requested}`;
  const path = asked.split('?')[0].replace(/\/$/, '') || '/';
  const allowed =
    // The app's own pages,
    ['/', '/history', '/docs', '/blog'].includes(path) ||
    // one article or one shared document,
    /^\/(blog|open|s)\/[^/]+$/.test(path) ||
    // or the consent step an assistant sent them through.
    asked.startsWith('/api/oauth/authorize?');
  const back = allowed ? asked : '/';

  const landing = (outcome: string, why?: string) => {
    const url = new URL(back, origin);

    url.searchParams.set('auth', outcome);

    if (why) {
      url.searchParams.set('why', why);
    }

    return url.pathname + url.search + url.hash;
  };

  if (!verifier) {
    return c.redirect(landing('missing-verifier'), 302);
  }

  let upstream: Response;

  try {
    upstream = await fetch(
      `${authBase()}/get-session?${VERIFIER}=${encodeURIComponent(verifier)}`,
      {
        headers: {
          cookie: c.req.header('cookie') ?? '',
          origin,
          accept: 'application/json',
        },
      }
    );
  } catch (error) {
    const why = String((error as Error).message).slice(0, 60);

    return c.redirect(landing('unreachable', why), 302);
  }

  if (!upstream.ok) {
    // Say what the upstream itself said: it is the difference between "try again" and knowing
    // which thing to fix.
    let why = '';

    try {
      const said = await upstream.text();
      const parsed = said.trim().startsWith('{') ? JSON.parse(said) : null;

      why = String(parsed?.code ?? parsed?.message ?? '')
        .slice(0, 60)
        .replace(/[^A-Za-z0-9 _.-]/g, '');
    } catch {
      // An upstream that cannot even be read is described by its status alone.
    }

    return c.redirect(
      landing('rejected', why ? `${upstream.status} ${why}` : String(upstream.status)),
      302
    );
  }

  const cookies = upstreamCookies(upstream);

  // No cookie means no session, and redirecting as though it worked would leave the page saying
  // "signed out" with no explanation.
  if (cookies.length === 0) {
    return c.redirect(landing('no-session-cookie'), 302);
  }

  const response = c.redirect(landing('ok'), 302);

  for (const cookie of cookies) {
    response.headers.append('set-cookie', firstParty(cookie));
  }

  return response;
}

/** Forwards one call under /api/auth/* to Neon Auth. */
export async function authProxy(c: Context): Promise<Response> {
  if (!authBase()) {
    return c.json(
      {
        error:
          'This deployment has no auth configured. NEON_AUTH_BASE_URL is unset.',
      },
      503
    );
  }

  const subpath = c.req.path.replace(/^\/api\/auth\/?/, '');

  if (!subpath) {
    return c.json({ error: 'no auth path given' }, 404);
  }

  if (subpath === 'finish') {
    return finishSignIn(c);
  }

  // Better Auth needs the original query intact — the OAuth callback carries `code` and `state`.
  const query = new URL(c.req.url).searchParams.toString();
  const target = `${authBase()}/${subpath}${query ? `?${query}` : ''}`;

  const headers = new Headers();

  c.req.raw.headers.forEach((value, key) => {
    const name = key.toLowerCase();

    if (!HOP_BY_HOP.has(name) && !OUR_HOP.test(name) && name !== 'referer') {
      headers.set(key, value);
    }
  });

  // Stated explicitly rather than left to whatever the hop happened to carry.
  headers.set('origin', selfOrigin(c));

  let upstream: Response;

  try {
    upstream = await fetch(target, {
      method: c.req.method,
      headers,
      body:
        c.req.method === 'GET' || c.req.method === 'HEAD'
          ? undefined
          : await c.req.raw.arrayBuffer(),
      redirect: 'manual', // a redirect is part of the flow; the browser must see it
    });
  } catch (error) {
    return c.json(
      { error: `could not reach the auth service: ${(error as Error).message}` },
      502
    );
  }

  const body = await upstream.arrayBuffer();
  const response = new Response(body, { status: upstream.status });

  upstream.headers.forEach((value, key) => {
    const name = key.toLowerCase();

    if (
      name !== 'set-cookie' &&
      name !== 'content-encoding' &&
      name !== 'content-length'
    ) {
      response.headers.set(key, value);
    }
  });

  for (const cookie of upstreamCookies(upstream)) {
    response.headers.append('set-cookie', firstParty(cookie));
  }

  return response;
}
