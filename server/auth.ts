import { resolveMx } from 'node:dns/promises';
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
/** A bare host, optionally with a port. Anything else is not a host we will build a URL from. */
const HOST_SHAPE = /^[a-z0-9.-]+(:\d{1,5})?$/i;

/** Hostnames this deployment answers on, from the platform. Empty in a plain checkout. */
const OWN_HOSTS = new Set(
  [
    process.env.TP_HOST,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
  ]
    .filter(Boolean)
    .map((value) => String(value).replace(/^https?:\/\//, '').replace(/\/$/, ''))
);

/**
 * The origin this request arrived on, and the one every URL we hand out is built from.
 *
 * `x-forwarded-host` is a header anybody can send, and this function feeds things that must not
 * follow it: the issuer in the OAuth metadata, the action of the consent form, the resource these
 * tokens are for, the `origin` presented upstream to the auth service, and every share link. One
 * curl with a forged header used to produce a discovery document naming somebody else's site.
 *
 * So it is honoured only when it agrees with the Host the platform routed on, or names a hostname
 * this deployment is known to answer for. Pinning to a single value instead would break every
 * preview deployment, each of which has a hostname of its own.
 */
export function selfOrigin(c: Context): string {
  const url = new URL(c.req.url);
  const routed = c.req.header('host') ?? url.host;
  const forwarded = c.req.header('x-forwarded-host');
  const claimed =
    forwarded && (forwarded === routed || OWN_HOSTS.has(forwarded))
      ? forwarded
      : routed;
  const host = HOST_SHAPE.test(claimed) ? claimed : url.host;

  const forwardedProto = c.req.header('x-forwarded-proto');
  const proto =
    forwardedProto === 'https' || forwardedProto === 'http'
      ? forwardedProto
      : url.protocol.replace(':', '');

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

/*
 * Can the domain in this address receive mail at all?
 *
 * The one thing a server can check about an address without sending to it. `sdfsdfsdfg@dsfsdfsdf.com`
 * is a perfectly well-formed address and no amount of pattern matching will say otherwise — but
 * that domain publishes no MX record, so nothing addressed to it can be delivered anywhere, and an
 * account made with it is an account nobody can ever confirm or recover.
 *
 * What this is NOT is proof that a mailbox exists. Only the code in the email establishes that, and
 * that is what the confirmation step is for. This refuses the obviously undeliverable — a typo in
 * the domain, a made-up one — before an account exists to clean up.
 *
 * Failing open on a DNS error is deliberate. A resolver that times out must not stop people
 * signing up; the confirmation step is still there behind it. Only a definite "this domain has no
 * mail exchanger" is a refusal.
 */
const MX_CACHE = new Map<string, boolean>();

async function canReceiveMail(email: string): Promise<boolean> {
  const domain = email.split('@')[1]?.toLowerCase();

  if (!domain) {
    return false;
  }

  const known = MX_CACHE.get(domain);

  if (known !== undefined) {
    return known;
  }

  try {
    const records = await resolveMx(domain);
    const ok = records.length > 0 && records.some((one) => one.exchange);

    MX_CACHE.set(domain, ok);

    return ok;
  } catch (cause) {
    const code = (cause as { code?: string }).code;

    /*
     * ENODATA is "this domain exists and has no MX"; ENOTFOUND is "no such domain". Both are
     * definite. Anything else — a timeout, a broken resolver — is our problem, not the address's.
     */
    if (code === 'ENODATA' || code === 'ENOTFOUND') {
      MX_CACHE.set(domain, false);

      return false;
    }

    return true;
  }
}

  const subpath = c.req.path.replace(/^\/api\/auth\/?/, '');

  if (!subpath) {
    return c.json({ error: 'no auth path given' }, 404);
  }

  if (subpath === 'finish') {
    return finishSignIn(c);
  }

  /*
   * Sign-up is the one path that gets looked at rather than only forwarded.
   *
   * The body is read here and passed on as text, because `c.req.raw.arrayBuffer()` below would
   * otherwise be reading a stream this has already consumed.
   */
  if (subpath === 'sign-up/email') {
    const raw = await c.req.raw.clone().text();

    let email = '';

    try {
      email = String((JSON.parse(raw) as { email?: unknown }).email ?? '');
    } catch {
      /* Not JSON. Let the auth service refuse it in its own words. */
    }

    if (email && !(await canReceiveMail(email))) {
      return c.json(
        {
          code: 'UNDELIVERABLE_DOMAIN',
          message: `${email.split('@')[1]} does not accept email, so this address could never be confirmed. Check the spelling.`,
        },
        400
      );
    }
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
