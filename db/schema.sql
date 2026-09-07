-- M2H schema. Safe to run repeatedly.
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
