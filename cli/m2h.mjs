#!/usr/bin/env node
/* m2h — publish Markdown from a terminal.
 *
 *   m2h login m2h_live_…                  remember a key for this machine
 *   m2h push README.md --share            convert and publish; prints the link
 *   m2h push docs/*.md --merge --share    chain several files into one document
 *   m2h list                              what is in the account
 *   m2h rm <id>                           delete one
 *   m2h usage                             how much room is left
 *
 * No dependencies on purpose: a tool people run in CI should not drag a tree of packages behind
 * it, and everything here is one fetch and some printing.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';

const HOST = process.env.M2H_HOST ?? 'https://transformpipe.com';
const CONFIG_DIR = join(homedir(), '.config', 'm2h');
const CONFIG = join(CONFIG_DIR, 'config.json');

const args = process.argv.slice(2);
const command = args.shift();

/** Flags anywhere, files anywhere: `m2h push --share a.md b.md` reads the way people type it. */
function parse(argv) {
  const flags = {};
  const rest = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (!arg.startsWith('--')) {
      rest.push(arg);
      continue;
    }

    const [name, inline] = arg.slice(2).split('=');
    const next = argv[i + 1];

    if (inline !== undefined) {
      flags[name] = inline;
    } else if (next && !next.startsWith('--')) {
      flags[name] = next;
      i += 1;
    } else {
      flags[name] = true;
    }
  }

  return { flags, rest };
}

const { flags, rest } = parse(args);

function storedKey() {
  try {
    return JSON.parse(readFileSync(CONFIG, 'utf8')).key ?? null;
  } catch {
    return null;
  }
}

function key() {
  const found = flags.key ?? process.env.M2H_API_KEY ?? storedKey();

  if (!found) {
    fail(
      'No API key. Run `m2h login m2h_live_…`, set M2H_API_KEY, or pass --key.\n' +
        `Create one in the account menu at ${HOST}`
    );
  }

  return found;
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

async function call(path, options = {}) {
  const response = await fetch(`${HOST}/api/v1${path}`, {
    ...options,
    headers: { authorization: `Bearer ${key()}`, ...(options.headers ?? {}) },
  });

  const text = await response.text();
  let body;

  try {
    body = JSON.parse(text);
  } catch {
    body = { error: text.slice(0, 200) };
  }

  if (!response.ok) {
    // The API says what went wrong in words; repeating them beats inventing our own.
    fail(`${body.error ?? response.statusText} (${response.status})`);
  }

  return body;
}

const bytes = (n) =>
  n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} kB` : `${(n / 1024 / 1024).toFixed(1)} MB`;

async function push() {
  const files = rest;

  if (files.length === 0) {
    fail('Which file? `m2h push README.md --share`');
  }

  const share = flags.share === true ? 'link' : flags.share;

  if (share && share !== 'link' && share !== 'people') {
    fail('--share takes `link` or `people`');
  }

  const sources = files.map((file) => {
    if (!existsSync(file)) {
      fail(`No such file: ${file}`);
    }

    return { name: basename(file), markdown: readFileSync(file, 'utf8') };
  });

  // Several files become one document when asked; otherwise each stands on its own.
  const documents = flags.merge
    ? [
        {
          name:
            flags.name ??
            (sources.length > 1
              ? `${sources[0].name} + ${sources.length - 1} more`
              : sources[0].name),
          markdown: sources.map((s) => s.markdown.trim()).join('\n\n---\n\n'),
        },
      ]
    : sources.map((s) => ({ name: flags.name ?? s.name, markdown: s.markdown }));

  const results = [];

  for (const document of documents) {
    const query = new URLSearchParams({ name: document.name });

    if (share) {
      query.set('share', share);
    }

    const { document: created } = await call(`/documents?${query}`, {
      method: 'POST',
      headers: { 'content-type': 'text/markdown' },
      body: document.markdown,
    });

    results.push(created);
  }

  if (flags.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  for (const document of results) {
    console.log(
      `${document.name}  ${bytes(document.size)}  ${document.words} words`
    );
    console.log(`  ${document.share.url ?? `${HOST}/history (not shared)`}`);
  }
}

async function list() {
  const { documents } = await call('/documents');

  if (flags.json) {
    console.log(JSON.stringify(documents, null, 2));
    return;
  }

  if (documents.length === 0) {
    console.log('Nothing here yet. `m2h push README.md --share`');
    return;
  }

  for (const document of documents) {
    const shared = document.share.url ? document.share.url : 'private';

    console.log(
      `${document.id}  ${document.name.padEnd(32).slice(0, 32)}  ${bytes(document.size).padStart(8)}  ${shared}`
    );
  }
}

async function remove() {
  if (rest.length === 0) {
    fail('Which one? `m2h rm <id>` — `m2h list` shows the ids.');
  }

  for (const id of rest) {
    await call(`/documents/${id}`, { method: 'DELETE' });
    console.log(`deleted ${id}`);
  }
}

async function usage() {
  const used = await call('/usage');

  if (flags.json) {
    console.log(JSON.stringify(used, null, 2));
    return;
  }

  console.log(
    `${bytes(used.bytes)} of ${bytes(used.limits.bytes)} · ${used.documents} of ${used.limits.documents} documents`
  );
}

function login() {
  const token = rest[0];

  if (!token?.startsWith('m2h_live_')) {
    fail('Pass the key: `m2h login m2h_live_…`');
  }

  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG, JSON.stringify({ key: token }, null, 2), { mode: 0o600 });
  console.log(`Saved to ${CONFIG}`);
}

const commands = { push, list, rm: remove, usage, login };

if (!command || command === '--help' || command === '-h') {
  console.log(
    [
      'm2h — publish Markdown from a terminal',
      '',
      '  m2h login m2h_live_…               remember a key for this machine',
      '  m2h push README.md --share         convert and publish; prints the link',
      '  m2h push docs/*.md --merge --share chain several files into one document',
      '  m2h list                           what is in the account',
      '  m2h rm <id>                        delete one',
      '  m2h usage                          how much room is left',
      '',
      'Options: --key, --name, --share link|people, --merge, --json',
      `Host:    ${HOST}  (M2H_HOST to point elsewhere)`,
    ].join('\n')
  );
  process.exit(0);
}

if (!commands[command]) {
  fail(`Unknown command: ${command}. Try \`m2h --help\`.`);
}

await commands[command]();
