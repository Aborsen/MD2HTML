import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

/*
 * Client ID Metadata Documents: reading a client's own description off the web.
 *
 * The third way a client can identify itself, beside registering (RFC 7591) and being configured by
 * hand. Its `client_id` is an https URL, the document at that URL says what the client is called
 * and where it may be sent back to, and this server fetches it instead of holding a registration.
 * MCP prefers it, and Claude picks it over registration as soon as an authorization server says it
 * is supported — which is the point: registration mints a fresh client on every connection, and our
 * table already held five rows all called "Claude".
 *
 * draft-ietf-oauth-client-id-metadata-document-00, as profiled by the MCP authorization spec of
 * 2025-11-25.
 *
 * This module fetches and checks the shape. What the document is then allowed to mean — which
 * redirect_uris are usable, what a name may contain, how it is stored — is policy and stays in
 * oauth.ts, so there is one place that decides such things for registered and fetched clients
 * alike.
 *
 * The whole of it is a URL taken from a stranger and fetched by our server, which is a server-side
 * request forgery waiting to be written badly. Hence: https only, no redirects followed, the
 * address resolved and refused if it is private, a second timeout, a size cap, and a body that has
 * to be JSON before it is parsed.
 */

/** Long enough for any real metadata document; short enough that nobody streams a film into it. */
const MAX_BYTES = 64 * 1024;

/** Claude gives an authorization endpoint ten seconds in total. This is one hop inside that. */
const TIMEOUT_MS = 5000;

/** Cache floor and ceiling, applied to whatever `cache-control` asks for. */
const MIN_TTL_MS = 5 * 60 * 1000;
const MAX_TTL_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TTL_MS = 60 * 60 * 1000;

/**
 * A failure is remembered too, briefly. Otherwise a client_id that 404s turns every authorization
 * attempt into another fetch, and a person pressing the button again is a fetch each time.
 */
const FAILURE_TTL_MS = 60 * 1000;

export interface ClientDocument {
  /** Exactly the URL it was fetched from; the draft requires the document to say so itself. */
  client_id: string;
  client_name: string;
  redirect_uris: string[];
  client_uri?: string;
  logo_uri?: string;
  scope?: string;
}

export type ClientDocumentResult =
  | { ok: true; document: ClientDocument }
  | { ok: false; why: string };

interface Held {
  until: number;
  result: ClientDocumentResult;
}

/*
 * Per instance, not shared. Serverless means several of these and no invalidation between them,
 * which is exactly what a TTL is for: the worst case is one instance using a document up to an hour
 * older than another's, and a client's name and redirect_uris are not values that change hourly.
 * A shared cache would mean a table, a write on every authorization, and one more thing to sweep.
 */
const HELD = new Map<string, Held>();

/**
 * Whether this `client_id` is a metadata document URL rather than a registered id.
 *
 * https and a path, per the draft: `https://example.com/` identifies a host, not a client, and
 * treating a bare origin as a client_id would let anyone who can serve a file at a domain root
 * speak for the whole domain. No fragment and no credentials, both of which would mean the id and
 * the URL fetched are not the same string.
 */
export function isDocumentId(id: string): boolean {
  if (!id.startsWith('https://') || id.length > 512) {
    return false;
  }

  try {
    const url = new URL(id);

    return (
      url.protocol === 'https:' &&
      url.pathname.length > 1 &&
      url.hash === '' &&
      url.username === '' &&
      url.password === '' &&
      // The canonical form, or the id and the address fetched drift apart by a slash.
      url.toString() === id
    );
  } catch {
    return false;
  }
}

/** Addresses no client is ever hosted at, and several that an attacker would like us to fetch. */
function privateAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    const flat = ip.toLowerCase();

    return (
      flat === '::1' ||
      flat === '::' ||
      flat.startsWith('fe80:') ||
      // Unique local addresses, fc00::/7.
      /^f[cd][0-9a-f]{2}:/.test(flat) ||
      // IPv4 wearing an IPv6 hat: ::ffff:169.254.169.254 must not get through.
      flat.startsWith('::ffff:')
    );
  }

  const parts = ip.split('.').map(Number);

  if (parts.length !== 4 || parts.some((one) => Number.isNaN(one))) {
    return true;
  }

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

/**
 * Where the hostname actually points, refused if that is inside.
 *
 * The check a URL string cannot make: `metadata.example.com` is a public name and may resolve to
 * 169.254.169.254. It is not proof against a name that answers differently on the second lookup —
 * the fetch resolves again — but it stops the plain attack, and the request carries no credential
 * of ours to steal even if one got through.
 */
async function publicHost(hostname: string): Promise<boolean> {
  const bare = hostname.replace(/^\[|\]$/g, '');

  if (isIP(bare)) {
    // An address rather than a name. No real client is published at one, and it is the shape every
    // SSRF attempt takes, so it is refused whether it is private or not.
    return false;
  }

  if (/(^|\.)(localhost|local|internal|localdomain)$/i.test(bare)) {
    return false;
  }

  try {
    const found = await lookup(bare, { all: true });

    return found.length > 0 && found.every((one) => !privateAddress(one.address));
  } catch {
    return false;
  }
}

/** `max-age`, clamped. A document that asks to be cached for a year does not get one. */
function ttlFrom(header: string | null): number {
  const found = /(?:^|,)\s*max-age\s*=\s*(\d+)/i.exec(header ?? '');

  if (!found) {
    return DEFAULT_TTL_MS;
  }

  const asked = Number(found[1]) * 1000;

  return Math.min(Math.max(asked, MIN_TTL_MS), MAX_TTL_MS);
}

/** The body, up to the cap, without trusting `content-length` to be the truth. */
async function readCapped(response: Response): Promise<string | null> {
  const declared = Number(response.headers.get('content-length') ?? '0');

  if (declared > MAX_BYTES) {
    return null;
  }

  if (!response.body) {
    return null;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      size += value.length;

      if (size > MAX_BYTES) {
        return null;
      }

      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }

  return Buffer.concat(chunks).toString('utf8');
}

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((one): one is string => typeof one === 'string')
    : [];
}

function readDocument(url: string, body: string): ClientDocumentResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(body);
  } catch {
    return { ok: false, why: 'the document is not JSON' };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, why: 'the document is not a JSON object' };
  }

  const doc = parsed as Record<string, unknown>;

  /*
   * The check the whole scheme rests on. Without it, `client_id=https://mine.example/me.json` could
   * serve a document claiming to be somebody else's client, and the consent page would show their
   * name over my redirect_uri.
   */
  if (doc.client_id !== url) {
    return { ok: false, why: 'its client_id is not the URL it was fetched from' };
  }

  const name = typeof doc.client_name === 'string' ? doc.client_name.trim() : '';

  if (!name) {
    return { ok: false, why: 'it has no client_name' };
  }

  const redirects = strings(doc.redirect_uris);

  if (redirects.length === 0) {
    return { ok: false, why: 'it lists no redirect_uris' };
  }

  /*
   * We have no way to authenticate a client, by design: a client that runs on somebody else's
   * machine cannot keep a secret, and PKCE is what stands in its place. A document asking for
   * `client_secret_basic` or `private_key_jwt` expects to be authenticated, and letting it through
   * as a public client would quietly give it less protection than it asked for.
   */
  const method = doc.token_endpoint_auth_method;

  if (typeof method === 'string' && method !== 'none') {
    return { ok: false, why: `it wants ${method}, and this server authenticates no client` };
  }

  return {
    ok: true,
    document: {
      client_id: url,
      client_name: name,
      redirect_uris: redirects,
      client_uri: typeof doc.client_uri === 'string' ? doc.client_uri : undefined,
      logo_uri: typeof doc.logo_uri === 'string' ? doc.logo_uri : undefined,
      scope: typeof doc.scope === 'string' ? doc.scope : undefined,
    },
  };
}

/**
 * The document at a URL client_id, fetched, checked and remembered.
 *
 * Never throws: every failure is a `why` a caller can log or show, because "unknown client" with no
 * reason is the hardest thing to diagnose from the other end of an OAuth flow.
 */
export async function clientDocument(url: string): Promise<ClientDocumentResult> {
  if (!isDocumentId(url)) {
    return { ok: false, why: 'not an https URL with a path' };
  }

  const held = HELD.get(url);

  if (held && held.until > Date.now()) {
    return held.result;
  }

  const { result, ttl } = await fetchDocument(url);

  HELD.set(url, { result, until: Date.now() + ttl });

  return result;
}

/** Split out so `clientDocument` is the caching, and this is the fetching. */
async function fetchDocument(
  url: string
): Promise<{ result: ClientDocumentResult; ttl: number }> {
  const fail = (why: string) => ({
    result: { ok: false as const, why },
    ttl: FAILURE_TTL_MS,
  });

  if (!(await publicHost(new URL(url).hostname))) {
    return fail('its address is not a public one');
  }

  let response: Response;

  try {
    response = await fetch(url, {
      /*
       * Not followed, deliberately. A redirect is how a public, allowed address becomes an
       * internal one after the check above, and a client whose document has moved can publish the
       * new URL as its client_id — the id is the address, so a moved document is a different
       * client.
       */
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        accept: 'application/json',
        'user-agent': 'TransformPipe (+https://transformpipe.com)',
      },
    });
  } catch {
    return fail('it could not be fetched');
  }

  if (response.status >= 300 && response.status < 400) {
    return fail('it redirects, and a moved document is a different client');
  }

  if (!response.ok) {
    return fail(`it answered ${response.status}`);
  }

  const type = response.headers.get('content-type') ?? '';

  if (!/^application\/(?:[\w.+-]+\+)?json\b/i.test(type.trim())) {
    return fail('it is not served as JSON');
  }

  const body = await readCapped(response).catch(() => null);

  if (body === null) {
    return fail('it is too large, or it stopped mid-way');
  }

  const read = readDocument(url, body);

  return {
    result: read,
    ttl: read.ok ? ttlFrom(response.headers.get('cache-control')) : FAILURE_TTL_MS,
  };
}
