-- transformpipe schema. Safe to run repeatedly.
--
-- The signed-in user lives in `neon_auth."user"`, which Neon Auth owns and migrates. This table
-- references that user by id only and deliberately does not declare a foreign key into it: a hard
-- constraint into someone else's migrations is a good way to have a deploy fail at an awkward
-- moment. The prefix keeps this app's one table distinct in a database it shares with others.

create table if not exists m2h_document (
  id          uuid primary key default gen_random_uuid(),
  -- Who it belongs to. Not a foreign key; see above.
  user_id     uuid        not null,
  name        text        not null,
  size        integer     not null,
  -- The markdown source, so a document can be re-opened and re-rendered anywhere.
  markdown    text        not null,
  -- Word/heading/table counts: cheap to show in the list without reading the source.
  stats       jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- The only query the list makes: this user's documents, newest first.
create index if not exists m2h_document_user_recent
  on m2h_document (user_id, created_at desc);

-- Sharing.
--
-- One token per document, and a mode that says who may use it: 'link' is anyone holding it,
-- 'people' narrows that to the addresses in m2h_document_share, 'private' means nobody. The token
-- survives a switch between modes so an already-sent link keeps working when access widens.

alter table m2h_document
  add column if not exists share_token text unique;

alter table m2h_document
  add column if not exists share_mode text not null default 'private';

create table if not exists m2h_document_share (
  document_id uuid not null references m2h_document (id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now(),
  primary key (document_id, email)
);

-- Sources move out of the row.
--
-- `markdown` stays nullable rather than being dropped: rows written before the Blob store existed
-- still carry their text, and a checkout without a store token still writes there. `blob_path`
-- names the file when it went to Blob instead.

alter table m2h_document
  add column if not exists blob_path text;

alter table m2h_document
  alter column markdown drop not null;

-- API keys.
--
-- The key itself is shown once, at creation, and never stored: the row keeps a SHA-256 hash and a
-- short prefix, which is enough to recognise a key in a list and to look one up on a request.
-- A revoked key keeps its row so an audit trail survives the revocation.

create table if not exists m2h_api_key (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  name         text not null,
  prefix       text not null,
  token_hash   text not null unique,
  created_at   timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at   timestamptz
);

create index if not exists m2h_api_key_owner on m2h_api_key (user_id, created_at desc);

-- Rate limiting and usage, in one place.
--
-- A row per caller per minute. It answers "is this caller going too fast" without another service
-- to run, and the same rows answer "is this key still in use, and how hard" — which is the second
-- question anyone asks about an API. Old minutes are swept on write; nothing here is kept for long.

create table if not exists m2h_call (
  caller  text not null,
  minute  timestamptz not null,
  calls   integer not null default 0,
  primary key (caller, minute)
);

create index if not exists m2h_call_minute on m2h_call (minute);

-- Reports about a shared document.
--
-- A public link plus arbitrary content is a phishing surface, and the only thing worse than
-- receiving a report is having nowhere for one to land. The token is stored rather than the
-- document id: whoever reports has the link, not the id.

create table if not exists m2h_report (
  id          uuid primary key default gen_random_uuid(),
  share_token text not null,
  reason      text not null,
  reporter    text,
  created_at  timestamptz not null default now(),
  handled_at  timestamptz
);

create index if not exists m2h_report_open on m2h_report (created_at desc) where handled_at is null;

-- Connecting an AI assistant.
--
-- transformpipe is its own OAuth authorization server for the MCP endpoint. It has to be: the protocol
-- forbids handing a client a token issued by somebody else, so a Neon Auth session cannot be passed
-- through. The person signs in here as they always do, approves a named client on a page they
-- looked at, and the client gets a token of ours that acts as them and reaches nothing else.
--
-- Every secret below is stored as a SHA-256 hash and never in the clear, for the same reason the
-- API keys are: a leaked table should give an attacker nothing to present.

create table if not exists m2h_oauth_client (
  -- 'm2hc_' plus random hex. Registered by the client itself, with no secret: a client that runs on
  -- someone else's machine cannot keep one.
  id            text primary key,
  name          text not null default '',
  redirect_uris jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now()
);

-- An authorization request that is waiting for the person to sign in.
--
-- The parameters are parked here under an opaque id rather than carried through the sign-in round
-- trip in a query string: a return path that contains someone else's redirect_uri is one encoding
-- mistake away from mattering, and an id has no such surface.

create table if not exists m2h_oauth_pending (
  id         text primary key,
  params     jsonb not null,
  expires_at timestamptz not null
);

-- One authorization code, single use.
--
-- `used_at` is what makes it single use, and it is set before anything is checked against the row:
-- a code replayed while the first exchange is still in flight would otherwise mint a second set of
-- tokens, and on a serverless platform that conditional update is the only lock there is.

create table if not exists m2h_oauth_code (
  code_hash      text primary key,
  client_id      text not null,
  user_id        uuid not null,
  redirect_uri   text not null,
  code_challenge text not null,
  resource       text,
  scope          text not null default 'documents:read documents:write',
  expires_at     timestamptz not null,
  used_at        timestamptz
);

-- Access and refresh tokens.
--
-- One table with a `kind`, because they differ by lifetime and by what they may be exchanged for,
-- not by shape — and one table means one place that revokes. A revoked row is kept so the person
-- can still see that the connection existed.

create table if not exists m2h_oauth_token (
  token_hash   text primary key,
  kind         text not null default 'access',
  client_id    text not null,
  user_id      uuid not null,
  scope        text not null default 'documents:read documents:write',
  resource     text,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz,
  revoked_at   timestamptz,
  last_used_at timestamptz
);

-- "Everything this person has connected", for the screen that lets them take it back.
create index if not exists m2h_oauth_token_user
  on m2h_oauth_token (user_id, created_at desc);

-- Who the consent page was rendered for, and whether they said yes.
--
-- `shown_to` is what ties an approval to the browser that was shown the page: without it, anybody
-- who can start an authorization request holds an id that somebody else's session could be made to
-- approve. `approved_at` keeps the row after the code is issued, so a second press of the button —
-- or a client that starts the flow again — is told the connection was already approved rather than
-- that its request expired, which is the difference between a next step and a dead end.

alter table m2h_oauth_pending
  add column if not exists shown_to uuid;

alter table m2h_oauth_pending
  add column if not exists approved_at timestamptz;

-- One grant, one chain.
--
-- An access token and the refresh token issued with it belong to the same authorisation, and every
-- rotation of that refresh token continues the same chain. Recording which chain a row belongs to
-- is what lets revocation mean what RFC 7009 says it means — handing back a refresh token ends the
-- access token issued beside it — and what lets a replayed, already-rotated refresh token end the
-- whole chain instead of merely being refused, which is the only useful response to the one signal
-- that a token has been copied.

alter table m2h_oauth_token
  add column if not exists grant_id uuid;

create index if not exists m2h_oauth_token_grant on m2h_oauth_token (grant_id);

-- Which conversion made a document.
--
-- The history filters on it and a row says so on its face, because "notes.md" tells you nothing
-- about whether it came from Word, from a web page or from a spreadsheet — and once several
-- conversions land in one list, that is the first thing anybody wants to narrow by. Rows written
-- before there was more than one conversion are exactly what the default says they are.

alter table m2h_document
  add column if not exists kind text not null default 'markdown-to-html';

create index if not exists m2h_document_user_kind
  on m2h_document (user_id, kind, created_at desc);
