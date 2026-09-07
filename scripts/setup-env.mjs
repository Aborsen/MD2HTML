/* Puts the two server variables where they are needed, without them passing through a terminal.
 *
 * Read `.env.local`, keep only the keys this app uses, and (with --vercel) push them to the linked
 * Vercel project for every environment. Values are never printed — only key names — so the log of a
 * setup run is safe to keep.
 *
 *   vercel link --project mouse-agent --yes
 *   vercel env pull .env.local --environment=production   # brings the shared Neon values over
 *   vercel link --project md-2-html --yes
 *   node scripts/setup-env.mjs --vercel                   # prune + push
 *
 * Without --vercel it only prunes, which is also what makes `.env.local` safe to leave lying about:
 * whatever else the pull brought with it is dropped on the floor.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const KEYS = ['DATABASE_URL', 'NEON_AUTH_BASE_URL'];
const FILE = '.env.local';
const ENVIRONMENTS = ['production', 'preview', 'development'];

if (!existsSync(FILE)) {
  console.error(`No ${FILE} here. Run \`vercel env pull ${FILE}\` first.`);
  process.exit(1);
}

const source = readFileSync(FILE, 'utf8');
const values = new Map();

for (const key of KEYS) {
  const found = source.match(new RegExp(`^${key}="?([^"\\n]+)"?$`, 'm'));

  if (found) {
    values.set(key, found[1]);
  }
}

const missing = KEYS.filter((key) => !values.has(key));

if (missing.length) {
  console.error(`Missing from ${FILE}: ${missing.join(', ')}`);
  process.exit(1);
}

writeFileSync(
  FILE,
  `# M2H server variables. Gitignored — never committed.\n` +
    KEYS.map((key) => `${key}="${values.get(key)}"`).join('\n') +
    '\n'
);

console.log(`${FILE} now holds: ${KEYS.join(', ')}`);

if (!process.argv.includes('--vercel')) {
  process.exit(0);
}

for (const key of KEYS) {
  for (const environment of ENVIRONMENTS) {
    // Replace rather than add: a second `env add` for the same name is an error, and a stale value
    // is worse than a missing one.
    spawnSync('vercel', ['env', 'rm', key, environment, '--yes'], {
      stdio: 'ignore',
      shell: true,
    });

    const result = spawnSync('vercel', ['env', 'add', key, environment], {
      input: values.get(key),
      stdio: ['pipe', 'ignore', 'pipe'],
      shell: true,
      encoding: 'utf8',
    });

    console.log(
      `${result.status === 0 ? 'ok  ' : 'FAIL'} ${key} → ${environment}` +
        (result.status === 0 ? '' : `: ${String(result.stderr).trim().slice(0, 120)}`)
    );
  }
}

console.log('\nRedeploy for the new variables to take effect: vercel --prod');
