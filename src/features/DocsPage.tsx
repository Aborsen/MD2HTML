import {
  BookOpen,
  Boxes,
  FileCode2,
  Gauge,
  Plug,
  HelpCircle,
  KeyRound,
  Share2,
  Terminal,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { ScrollToTop } from '@/components/ScrollToTop';
import { CONVERSIONS } from '@shared/conversions';
import { DOCS_SECTIONS } from '@/lib/docs-sections';
import { MCP_PATH, MCP_TOOL_NAMES, MCP_TOOLS } from '@/lib/mcp-facts';
import { FAQ_ENTRIES } from '@/lib/faq';
import { useTheme } from '@/lib/theme';
import { CodeBlock, InlineCode } from '@/ui/components/Code';
import { DefinitionTable } from '@/ui/components/DefinitionTable';
import { Faq } from '@/ui/components/Faq';
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

/** The order and the wording live in one place; the icons are this page's own business. */
const ICONS: Record<string, typeof BookOpen> = {
  start: BookOpen,
  converting: FileCode2,
  history: Boxes,
  sharing: Share2,
  account: KeyRound,
  api: Terminal,
  cli: Terminal,
  action: Terminal,
  assistant: Plug,
  limits: Gauge,
  faq: HelpCircle,
};

const SECTIONS = DOCS_SECTIONS.map((section) => ({
  ...section,
  icon: ICONS[section.id] ?? BookOpen,
}));

/**
 * Which heading the reader is on, so the contents list can say so.
 *
 * The last heading that has passed under the sticky header, rather than whichever one an observer
 * happens to find intersecting: a long section has no heading on screen at all in the middle of it,
 * and an observer answers that by keeping the previous section lit — which is the section the reader
 * has already left. Positions are read on a frame, so the scroll handler itself does no layout.
 */
function useActiveSection(): string {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;

      let current = SECTIONS[0].id;

      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);

        // 88px: the header plus the breathing room `scroll-mt-20` leaves under it.
        if (element && element.getBoundingClientRect().top <= 88) {
          current = section.id;
        }
      }

      setActive(current);
    };

    const onScroll = () => {
      frame ||= requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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
          <Typography
            variant="span"
            textColor="light"
            className="block text-xxs uppercase tracking-wide"
          >
            Documentation
          </Typography>
          <Typography variant="h1" className="text-2xl md:text-2xl">
            Everything transformpipe does
          </Typography>
          <Typography variant="p" textColor="secondary" className="text-sm">
            Markdown in, a self-contained HTML document out — from this page, from a
            terminal, or from a pull request. This is the whole of it; nothing here
            sits behind a plan.
          </Typography>
        </header>

        <Section id="start" title="Start here">
          <p>
            Drop a <InlineCode>.md</InlineCode> file on the converter and you have the rendered document
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
            <strong>Converter</strong> in the header lists what this app converts.
            Each one has its own page, its own dropzone and its own address, so a
            conversion can be linked and bookmarked rather than set up again:
          </p>
          <ul>
            {CONVERSIONS.map((one) => (
              <li key={one.id}>
                <a href={one.path}>{one.label}</a> —{' '}
                {one.extensions.map((extension, index) => (
                  <span key={extension}>
                    {index > 0 && ', '}
                    <InlineCode>{extension}</InlineCode>
                  </span>
                ))}
              </li>
            ))}
          </ul>
          <p>
            Up to 10 MB a file. Drop several Markdown files at once and they are
            chained into a single document, in the order they arrive, separated by a
            rule. Drop a file the page does not take — a{' '}
            <InlineCode>.docx</InlineCode> on the Markdown page, say — and it goes to
            the conversion that does take it rather than being refused; a mixture of
            kinds is refused, because chaining a spreadsheet onto a Word document is
            not something anybody meant.
          </p>
          <p>
            Everything ends as Markdown, and that is deliberate: it is what a document
            is stored, previewed, shared and reached by a script as, so the whole of
            the app stands on one shape rather than four.
          </p>
          <Shot
            name="converter"
            alt="The transformpipe converter with an empty dropzone"
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
            The source tab is not a summary of the output. It is the exact thing the
            download hands over — the standalone HTML when you converted{' '}
            <em>to</em> HTML, the Markdown when you converted to Markdown: one
            document, styles inline, no scripts, no network.
          </p>
          <p>
            The download button carries the format the conversion produced —{' '}
            <InlineCode>.html</InlineCode> on the Markdown page,{' '}
            <InlineCode>.md</InlineCode> on the others — and the arrow beside it holds
            the rest: Markdown, HTML, plain text, and printing. Print builds the
            exported file in a frame of its own and opens the browser's dialog, so a
            PDF is the document and not a screenshot of the app around it; the export
            flips to a light palette on paper whatever the app is set to.
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
            The chips filter by where a document came from: <em>All formats</em> to
            begin with, then one chip per conversion that actually has rows, and{' '}
            <em>Shared with me</em> for files somebody sent you. A row's badge says
            the same thing — <InlineCode>DOCX → MD</InlineCode> on a Word file — so a
            list of thirty documents still tells you which is which.
          </p>
          <p>
            Downloading is a menu rather than a chip: only the Markdown is ever
            stored, and the HTML and the plain text are built on the spot, so one row
            can hand over any of the three without keeping three copies.
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
            <InlineCode>/s/&lt;token&gt;</InlineCode> — a read-only page with the document and a
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
            <InlineCode>script-src 'none'</InlineCode> and cannot be framed, and every one of them links
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
            <InlineCode>Authorization: Bearer tp_live_…</InlineCode>; a browser session works too, so the
            same endpoints can be tried while signed in.
          </p>
          {/* The origin comes from the page, so this stays right on whatever domain it is read from. */}
          <CodeBlock>{`curl -H "Authorization: Bearer tp_live_…" \\
     --data-binary @README.md \\
     "${window.location.origin}/api/v1/documents?name=README.md&share=link"

# → { "document": { "id": "…", "share": { "url": "https://…/s/…" } } }`}</CodeBlock>
          <DefinitionTable
            rows={[
              {
                key: 'post',
                term: <InlineCode>POST /api/v1/documents</InlineCode>,
                text: (
                  <>
                    Markdown as the body (<InlineCode>?name=</InlineCode>) or JSON{' '}
                    <InlineCode>{'{name, markdown}'}</InlineCode>. <InlineCode>?share=link|people</InlineCode> publishes it
                    in the same call. <InlineCode>?kind=html-to-markdown</InlineCode> or{' '}
                    <InlineCode>?kind=csv-to-markdown</InlineCode> converts the body first, so a
                    page or a spreadsheet can be posted as it is;{' '}
                    <InlineCode>word-to-markdown</InlineCode> is refused here, because reading a{' '}
                    <InlineCode>.docx</InlineCode> happens in the browser.
                  </>
                ),
              },
              {
                key: 'list',
                term: <InlineCode>GET /api/v1/documents</InlineCode>,
                text: 'The newest 500, with sizes, stats and share state.',
              },
              {
                key: 'one',
                term: <InlineCode>GET /api/v1/documents/:id</InlineCode>,
                text: 'Metadata and the Markdown source.',
              },
              {
                key: 'html',
                term: <InlineCode>GET /api/v1/documents/:id.html</InlineCode>,
                text: (
                  <>
                    The standalone document. <InlineCode>?theme=dark</InlineCode> optional.
                  </>
                ),
              },
              {
                key: 'delete',
                term: <InlineCode>DELETE /api/v1/documents/:id</InlineCode>,
                text: 'Removes the row and its stored source.',
              },
              {
                key: 'share',
                term: <InlineCode>GET | PUT /api/v1/documents/:id/share</InlineCode>,
                text: (
                  <>
                    <InlineCode>{'{mode, emails[]}'}</InlineCode>. <InlineCode>private</InlineCode> drops the token.
                  </>
                ),
              },
              {
                key: 'usage',
                term: <InlineCode>GET /api/v1/usage</InlineCode>,
                text: 'What the account is using, against the limits.',
              },
            ]}
          />
          <p>
            Errors are <InlineCode>{'{ "error": "…" }'}</InlineCode> with a status that means what it
            says: 401 unknown key, 404 not yours, 413 the document is over 4 MB, 403 the
            account is out of room, 429 too fast, 410 the source is gone.
          </p>
        </Section>

        <Section id="cli" title="Command line">
          <p>
            <InlineCode>cli/tp.mjs</InlineCode> in the repository is the same API with a friendlier face,
            and no dependencies — a tool that runs in CI should not drag a package tree
            behind it.
          </p>
          <CodeBlock>{`node cli/tp.mjs login tp_live_…          # remembers the key for this machine
node cli/tp.mjs push README.md --share    # prints the link
node cli/tp.mjs push docs/*.md --merge --share --name handbook.md
node cli/tp.mjs push page.html            # converted to Markdown on the way in
node cli/tp.mjs list
node cli/tp.mjs rm <id>
node cli/tp.mjs usage                     # 65.8 kB of 100.0 MB · 3 of 500 documents`}</CodeBlock>
          <p>
            A pushed <InlineCode>.html</InlineCode>, <InlineCode>.csv</InlineCode> or{' '}
            <InlineCode>.tsv</InlineCode> is converted by the endpoint rather than stored as if it
            were already Markdown; a <InlineCode>.docx</InlineCode> is refused, with the page that
            can read it. <InlineCode>--merge</InlineCode> chains Markdown only.
          </p>
          <p>
            The key comes from <InlineCode>--key</InlineCode>, then <InlineCode>TP_API_KEY</InlineCode>, then{' '}
            <InlineCode>~/.config/tp/config.json</InlineCode>. <InlineCode>TP_HOST</InlineCode> points it at another
            deployment, and <InlineCode>--json</InlineCode> prints the API's own answer.
          </p>
        </Section>

        <Section id="action" title="GitHub Action">
          <p>
            Given no file list, the action publishes the Markdown a pull request changed
            and comments the links on it — so a reviewer opens the rendered document
            instead of reading a diff of asterisks.
          </p>
          <CodeBlock>{`- uses: Aborsen/MD2HTML@v1
  with:
    api-key: \${{ secrets.TP_API_KEY }}`}</CodeBlock>
          <p>
            <InlineCode>examples/publish-markdown.yml</InlineCode> is a complete workflow to copy.
            Checkout needs <InlineCode>fetch-depth: 0</InlineCode> for the base commit the file list is
            compared against, and the comment needs <InlineCode>pull-requests: write</InlineCode>.
          </p>
          <DefinitionTable
            rows={[
              {
                key: 'api-key',
                term: <InlineCode>api-key</InlineCode>,
                text: 'Required. Keep it in a repository secret.',
              },
              {
                key: 'files',
                term: <InlineCode>files</InlineCode>,
                text: 'Space-separated paths. Defaults to what the pull request changed.',
              },
              {
                key: 'share',
                term: <InlineCode>share</InlineCode>,
                text: (
                  <>
                    <InlineCode>link</InlineCode> (default), <InlineCode>people</InlineCode>, or <InlineCode>none</InlineCode> to publish
                    privately.
                  </>
                ),
              },
              {
                key: 'merge',
                term: <InlineCode>merge</InlineCode>,
                text: 'Chain the files into one document instead of one each.',
              },
              {
                key: 'comment',
                term: <InlineCode>comment</InlineCode>,
                text: 'Comment the links on the pull request.',
              },
              {
                key: 'host',
                term: <InlineCode>host</InlineCode>,
                text: 'Another deployment of transformpipe.',
              },
            ]}
          />
          <p>
            A push publishes new documents rather than overwriting the old ones, so a
            link in an older comment keeps showing what that commit said.
          </p>
        </Section>

        <Section id="assistant" title="In an assistant">
          <p>
            transformpipe is an MCP server, so it can be added to Claude as a connector. The
            address is this deployment plus <InlineCode>{MCP_PATH}</InlineCode>:
          </p>

          <CodeBlock>{`${window.location.origin}${MCP_PATH}`}</CodeBlock>

          <p>
            On claude.ai that goes in Settings → Connectors → Add custom connector.
            From a terminal:
          </p>

          <CodeBlock>{`claude mcp add --transport http transformpipe ${window.location.origin}${MCP_PATH}`}</CodeBlock>

          <p>
            There is no key to paste. The first call comes back unauthorised, your
            assistant follows that to a page here, and you sign in with the same
            Google account and approve a named client — which is why the page tells
            you which address it is about to act as. What it gets is a token of ours,
            good for your documents and nothing else: not your account, not your
            sign-in, and not your API keys. Disconnect it from the account menu, under
            API keys, and it stops working on the next call.
          </p>

          <DefinitionTable
            rows={MCP_TOOL_NAMES.map((name) => ({
              key: name,
              term: <InlineCode>{name}</InlineCode>,
              text: MCP_TOOLS[name],
            }))}
          />

          <p>
            The tools are the same code as the API above, called in process, so a
            conversation and a script get the same answer. Two of them are shaped for
            the trouble they can cause: sharing publishes a page on the public web, and
            deleting takes an explicit confirmation and removes exactly one document.
          </p>
        </Section>

        <Section id="limits" title="Limits">
          <DefinitionTable
            rows={[
              {
                key: 'account',
                term: 'Per account',
                text: '100 MB of Markdown, 500 documents',
              },
              {
                key: 'convert',
                term: 'Per conversion',
                text: '10 MB — roughly 1.5 million words. Several files dropped together count as the one document they become',
              },
              {
                key: 'document',
                term: 'Per kept document',
                text: '4 MB, and not by our choice: a Vercel Function refuses a request or a response body over 4.5 MB before any of this code runs, so a larger document could be neither saved nor read back. It still converts, previews and downloads — it stays out of the history, and the app says so rather than reporting a save that did not happen',
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

        <Section id="faq" title="Questions">
          <p>
            The same answers the converter shows under its dropzone — one set of
            them, so the two pages cannot drift apart.
          </p>
          <Faq items={FAQ_ENTRIES} />
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
