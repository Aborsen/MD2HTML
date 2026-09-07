import {
  BookOpen,
  Boxes,
  FileCode2,
  Gauge,
  KeyRound,
  Share2,
  Terminal,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { ScrollToTop } from '@/components/ScrollToTop';
import { useTheme } from '@/lib/theme';
import { Badge } from '@/ui/components/Badge';
import { Typography } from '@/ui/components/Typography';
import { cn } from '@/ui/lib/utils';

/*
 * The manual, living at /docs inside the app it documents.
 *
 * A separate site would drift: built from another checkout, styled by another stylesheet, updated
 * whenever someone remembered. Here the screenshots are captured from this app by
 * `npm run docs:shots`, the tokens are the app's own, and the header links to it — so the page can
 * only ever be as stale as the deployment it ships in.
 */

interface SectionSpec {
  id: string;
  title: string;
  icon: typeof BookOpen;
}

const SECTIONS: SectionSpec[] = [
  { id: 'start', title: 'Start here', icon: BookOpen },
  { id: 'converting', title: 'Converting', icon: FileCode2 },
  { id: 'history', title: 'History', icon: Boxes },
  { id: 'sharing', title: 'Sharing', icon: Share2 },
  { id: 'account', title: 'Account', icon: KeyRound },
  { id: 'api', title: 'API', icon: Terminal },
  { id: 'cli', title: 'Command line', icon: Terminal },
  { id: 'action', title: 'GitHub Action', icon: Terminal },
  { id: 'limits', title: 'Limits', icon: Gauge },
];

/** Which heading the reader is on, so the contents list can say so. */
function useActiveSection(): string {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];

        if (visible) {
          setActive(visible.target.id);
        }
      },
      // A band just under the sticky header: whatever sits there is what is being read.
      { rootMargin: '-72px 0px -70% 0px' }
    );

    for (const section of SECTIONS) {
      const element = document.getElementById(section.id);

      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, []);

  return active;
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <Typography variant="h2" className="mb-3 text-xl md:text-xl">
        {title}
      </Typography>
      <div className="space-y-4 text-ink-body text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-stroke bg-surface-card2 p-4 font-mono text-ink-body text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

/** An inline literal — a flag, a header, a path. */
function K({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface-card2 px-1 py-0.5 font-mono text-ink-primary text-xs">
      {children}
    </code>
  );
}

function Rows({ rows }: { rows: { key: string; term: ReactNode; text: ReactNode }[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-stroke">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.key}
              className={cn('align-top', index > 0 && 'border-stroke border-t')}
            >
              <th
                scope="row"
                className="w-2/5 bg-surface-card2/60 px-4 py-2.5 text-left font-medium text-ink-primary"
              >
                {row.term}
              </th>
              <td className="px-4 py-2.5 text-ink-body">{row.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * A screenshot of this app, in whichever theme the reader is using.
 *
 * `npm run docs:shots` captures every one of them twice, light and dark, because a dark screenshot
 * on a light page reads as somebody else's product.
 */
function Shot({
  name,
  alt,
  caption,
}: {
  name: string;
  alt: string;
  caption: string;
}) {
  const { theme } = useTheme();

  return (
    <figure className="space-y-2">
      <img
        src={`/docs/${name}-${theme}.png`}
        alt={alt}
        loading="lazy"
        className="w-full rounded-lg border border-stroke bg-surface-card"
      />
      <figcaption className="text-ink-secondary text-xs">{caption}</figcaption>
    </figure>
  );
}

export function DocsPage() {
  const active = useActiveSection();

  return (
    <div className="mx-auto flex w-full max-w-5xl gap-10">
      <nav
        aria-label="On this page"
        className="sticky top-20 hidden h-fit w-44 shrink-0 lg:block"
      >
        <Typography
          variant="span"
          textColor="light"
          className="mb-2 block text-xxs uppercase tracking-wide"
        >
          On this page
        </Typography>
        <ul className="space-y-0.5">
          {SECTIONS.map(({ id, title, icon: Icon }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? 'true' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                  active === id
                    ? 'bg-surface-accent text-ink-highlight'
                    : 'text-ink-secondary hover:bg-state-hover hover:text-ink-body'
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                {title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 max-w-3xl flex-1 space-y-12 pb-8">
        <header className="space-y-3">
          <Badge variant="secondary">Documentation</Badge>
          <Typography variant="h1" className="text-2xl md:text-2xl">
            Everything M2H does
          </Typography>
          <Typography variant="p" textColor="secondary" className="text-sm">
            Markdown in, a self-contained HTML document out — from this page, from a
            terminal, or from a pull request. This is the whole of it; nothing here
            sits behind a plan.
          </Typography>
        </header>

        <Section id="start" title="Start here">
          <p>
            Drop a <K>.md</K> file on the converter and you have the rendered document
            and a download. Nothing is stored and nothing is sent anywhere — the
            conversion runs in this browser.
          </p>
          <p>
            Sign in with Google and the same documents follow you between devices, can
            be shared by link or by address, and can be reached by a script with an API
            key. Whatever you converted before signing in moves into the account on the
            way.
          </p>
        </Section>

        <Section id="converting" title="Converting">
          <p>
            Drag a file onto the dropzone or pick one — <K>.md</K>, <K>.markdown</K>,{' '}
            <K>.mdown</K>, <K>.mkd</K> and <K>.txt</K>, up to 10 MB. Drop several at
            once and they are chained into a single document, in the order they arrive,
            separated by a rule.
          </p>
          <Shot
            name="converter"
            alt="The M2H converter with an empty dropzone"
            caption="The converter. The logo doubles as “start over”."
          />
          <p>
            What comes out is GitHub Flavored Markdown: tables, task lists,
            strikethrough, autolinks, fenced code. The preview is the document itself,
            styled with the same tokens as the app, so a dark app hands over a dark
            page — and printing always flips to light, because a dark page on paper is
            a wall of ink.
          </p>
          <Shot
            name="preview"
            alt="A converted document shown in the preview tab"
            caption="Preview, with the counts the document actually has."
          />
          <p>
            The <strong>HTML source</strong> tab is not a summary of the output. It is
            the exact file the download hands over: one document, styles inline, no
            scripts, no network.
          </p>
          <Shot
            name="source"
            alt="The HTML source tab showing the standalone document"
            caption="The HTML source tab: what you get, before you get it."
          />
          <p>
            For reading rather than checking, the preview goes fullscreen and keeps a
            readable measure; Escape comes back. A long document grows a back-to-top
            button, in both views.
          </p>
        </Section>

        <Section id="history" title="History">
          <p>
            Every conversion lands in the history — in your account when signed in, in
            this browser when not. Search runs over file names, the columns sort, and a
            row opens the document.
          </p>
          <Shot
            name="history"
            alt="The history list with search, chips and sortable columns"
            caption="HTML or Markdown, search, sortable columns."
          />
          <p>
            The chips are not a filter over two kinds of file. Only the Markdown source
            is ever stored; the HTML is built on the spot. So the chip changes the row's
            name, its badge, what the size column measures and what a download hands
            over — the same document, seen from either end.
          </p>
          <p>
            Tick rows and the selection bar appears: merge them into one document,
            download them, or delete them. Merging keeps the order of the list.
          </p>
          <Shot
            name="selection"
            alt="Two rows selected, with the bulk action bar"
            caption="Bulk merge, download and delete."
          />
        </Section>

        <Section id="sharing" title="Sharing">
          <p>
            <strong>Anyone with the link</strong> publishes the document at{' '}
            <K>/s/&lt;token&gt;</K> — a read-only page with the document and a
            download, nothing else. <strong>Only these addresses</strong> asks the
            reader to sign in with an address you listed.
          </p>
          <p>
            Revoking drops the token, so a link you already sent stops working; sharing
            again mints a different one. No email is ever sent — you pass the link on
            yourself.
          </p>
          <p>
            Documents other people addressed to you appear under the{' '}
            <strong>Shared with me</strong> chip, with who shared each one. They are
            read-only: open and download, no delete, no re-share. A link share belongs
            to whoever holds the link, so it appears on no one's list.
          </p>
          <p>
            A shared page carries someone's content on our domain, so it is served with{' '}
            <K>script-src 'none'</K> and cannot be framed, and every one of them links
            to a report form that needs no JavaScript. Nothing is revoked automatically:
            a report is a stranger's claim about someone else's document, and both
            mistakes — leaving a bad page up, killing an innocent link — deserve a
            person reading it first.
          </p>
        </Section>

        <Section id="account" title="Account">
          <p>
            Sign-in is Google, through Neon Auth. The account menu holds the theme (dark
            by default, remembered per browser), the API keys, and the way out.
          </p>
          <p>
            A key is shown once and stored only as a hash. It reaches documents and
            shares — never the account or the keys themselves, so a leaked key cannot
            mint its replacement or lock you out. Revoking one takes effect on the next
            request.
          </p>
        </Section>

        <Section id="api" title="API">
          <p>
            Everything the app does, a script can do. Send the key as{' '}
            <K>Authorization: Bearer m2h_live_…</K>; a browser session works too, so the
            same endpoints can be tried while signed in.
          </p>
          <Code>{`curl -H "Authorization: Bearer m2h_live_…" \\
     --data-binary @README.md \\
     "https://md-2-html.vercel.app/api/v1/documents?name=README.md&share=link"

# → { "document": { "id": "…", "share": { "url": "https://…/s/…" } } }`}</Code>
          <Rows
            rows={[
              {
                key: 'post',
                term: <K>POST /api/v1/documents</K>,
                text: (
                  <>
                    Markdown as the body (<K>?name=</K>) or JSON{' '}
                    <K>{'{name, markdown}'}</K>. <K>?share=link|people</K> publishes it
                    in the same call.
                  </>
                ),
              },
              {
                key: 'list',
                term: <K>GET /api/v1/documents</K>,
                text: 'The newest 500, with sizes, stats and share state.',
              },
              {
                key: 'one',
                term: <K>GET /api/v1/documents/:id</K>,
                text: 'Metadata and the Markdown source.',
              },
              {
                key: 'html',
                term: <K>GET /api/v1/documents/:id.html</K>,
                text: (
                  <>
                    The standalone document. <K>?theme=dark</K> optional.
                  </>
                ),
              },
              {
                key: 'delete',
                term: <K>DELETE /api/v1/documents/:id</K>,
                text: 'Removes the row and its stored source.',
              },
              {
                key: 'share',
                term: <K>GET | PUT /api/v1/documents/:id/share</K>,
                text: (
                  <>
                    <K>{'{mode, emails[]}'}</K>. <K>private</K> drops the token.
                  </>
                ),
              },
              {
                key: 'usage',
                term: <K>GET /api/v1/usage</K>,
                text: 'What the account is using, against the limits.',
              },
            ]}
          />
          <p>
            Errors are <K>{'{ "error": "…" }'}</K> with a status that means what it
            says: 401 unknown key, 404 not yours, 413 the document is over 1 MB, 403 the
            account is out of room, 429 too fast, 410 the source is gone.
          </p>
        </Section>

        <Section id="cli" title="Command line">
          <p>
            <K>cli/m2h.mjs</K> in the repository is the same API with a friendlier face,
            and no dependencies — a tool that runs in CI should not drag a package tree
            behind it.
          </p>
          <Code>{`node cli/m2h.mjs login m2h_live_…          # remembers the key for this machine
node cli/m2h.mjs push README.md --share    # prints the link
node cli/m2h.mjs push docs/*.md --merge --share --name handbook.md
node cli/m2h.mjs list
node cli/m2h.mjs rm <id>
node cli/m2h.mjs usage                     # 65.8 kB of 100.0 MB · 3 of 500 documents`}</Code>
          <p>
            The key comes from <K>--key</K>, then <K>M2H_API_KEY</K>, then{' '}
            <K>~/.config/m2h/config.json</K>. <K>M2H_HOST</K> points it at another
            deployment, and <K>--json</K> prints the API's own answer.
          </p>
        </Section>

        <Section id="action" title="GitHub Action">
          <p>
            Given no file list, the action publishes the Markdown a pull request changed
            and comments the links on it — so a reviewer opens the rendered document
            instead of reading a diff of asterisks.
          </p>
          <Code>{`- uses: Aborsen/MD2HTML@v1
  with:
    api-key: \${{ secrets.M2H_API_KEY }}`}</Code>
          <p>
            <K>examples/publish-markdown.yml</K> is a complete workflow to copy.
            Checkout needs <K>fetch-depth: 0</K> for the base commit the file list is
            compared against, and the comment needs <K>pull-requests: write</K>.
          </p>
          <Rows
            rows={[
              {
                key: 'api-key',
                term: <K>api-key</K>,
                text: 'Required. Keep it in a repository secret.',
              },
              {
                key: 'files',
                term: <K>files</K>,
                text: 'Space-separated paths. Defaults to what the pull request changed.',
              },
              {
                key: 'share',
                term: <K>share</K>,
                text: (
                  <>
                    <K>link</K> (default), <K>people</K>, or <K>none</K> to publish
                    privately.
                  </>
                ),
              },
              {
                key: 'merge',
                term: <K>merge</K>,
                text: 'Chain the files into one document instead of one each.',
              },
              {
                key: 'comment',
                term: <K>comment</K>,
                text: 'Comment the links on the pull request.',
              },
              {
                key: 'host',
                term: <K>host</K>,
                text: 'Another deployment of M2H.',
              },
            ]}
          />
          <p>
            A push publishes new documents rather than overwriting the old ones, so a
            link in an older comment keeps showing what that commit said.
          </p>
        </Section>

        <Section id="limits" title="Limits">
          <Rows
            rows={[
              {
                key: 'account',
                term: 'Per account',
                text: '100 MB of Markdown, 500 documents',
              },
              {
                key: 'document',
                term: 'Per document',
                text: '1 MB — roughly 150,000 words',
              },
              {
                key: 'upload',
                term: 'Per upload',
                text: '10 MB a file in the browser',
              },
              {
                key: 'caller',
                term: 'Per caller',
                text: '60 requests a minute, counted by key or by session',
              },
            ]}
          />
          <p>
            Reaching a limit is a refusal, not a silent eviction. This app used to drop
            the oldest document to stay under its cap, which quietly destroyed something
            its owner had chosen to keep; now it says what to delete instead.
          </p>
        </Section>

        <footer className="border-stroke border-t pt-6 text-ink-secondary text-sm">
          Source and issues:{' '}
          <a
            href="https://github.com/Aborsen/MD2HTML"
            target="_blank"
            rel="noreferrer"
            className="text-brand-tertiary underline underline-offset-2"
          >
            github.com/Aborsen/MD2HTML
          </a>
        </footer>
      </div>

      <ScrollToTop />
    </div>
  );
}
