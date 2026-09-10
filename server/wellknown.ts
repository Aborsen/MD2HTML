import type { Context } from 'hono';
import { selfOrigin } from './auth.js';
import { resourceUri, SCOPES } from './oauth.js';

/*
 * The two documents a client reads before it can ask for a token.
 *
 * These are the whole of "how do I sign in here" as far as the protocol is concerned, and when they
 * are missing the failure is silent from the client's side: the MCP endpoint says 401, nothing
 * answers the discovery request, and the person is told the server could not be reached. So they
 * are routed in vercel.json as well as here — a deployment that serves the app for these paths
 * hands a client an HTML page where it expected JSON, and reports it as a parse error.
 */

const CACHED = {
  'cache-control': 'public, max-age=300',
  // Read by a client from anywhere; there is nothing here that is not public.
  'access-control-allow-origin': '*',
};

/**
 * RFC 9728. Served at the bare path and at the path-suffixed form, because a client may construct
 * either: one follows the `resource_metadata` hint in our 401, the other builds the URL itself.
 *
 * `authorization_servers` holds exactly one entry: Claude uses the first and does not fall back.
 */
export function protectedResource(c: Context) {
  return c.json(
    {
      resource: resourceUri(c),
      authorization_servers: [selfOrigin(c)],
      bearer_methods_supported: ['header'],
      scopes_supported: [...SCOPES],
      resource_documentation: `${selfOrigin(c)}/docs`,
    },
    200,
    CACHED
  );
}

/**
 * RFC 8414.
 *
 * `S256` only, and no `plain`: a public client cannot keep a secret, so the verifier is the whole of
 * what proves the token request came from whoever started the flow.
 *
 * `client_id_metadata_document_supported` is what makes a client hand us a URL as its client_id
 * instead of registering. It is read together with `none` above — a metadata-document client is a
 * public one and authenticates at the token endpoint with nothing — and a client that finds only
 * one of the two falls back to registration, which still works and is still advertised below.
 *
 * It was deliberately absent while `server/cimd.ts` did not exist, because advertising it would
 * have chosen a road that dead-ends. It exists now.
 */
export function authorizationServer(c: Context) {
  const origin = selfOrigin(c);

  return c.json(
    {
      issuer: origin,
      authorization_endpoint: `${origin}/api/oauth/authorize`,
      token_endpoint: `${origin}/api/oauth/token`,
      registration_endpoint: `${origin}/api/oauth/register`,
      revocation_endpoint: `${origin}/api/oauth/revoke`,
      scopes_supported: [...SCOPES],
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none'],
      client_id_metadata_document_supported: true,
      revocation_endpoint_auth_methods_supported: ['none'],
      authorization_response_iss_parameter_supported: true,
      service_documentation: `${origin}/docs`,
    },
    200,
    CACHED
  );
}
