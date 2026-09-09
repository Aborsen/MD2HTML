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
import { Fragment, useMemo, type ReactNode } from 'react';
import { AppBreadcrumbs } from '@/components/AppBreadcrumbs';
import { ScrollToTop } from '@/components/ScrollToTop';
import { docsCrumbs } from '@/lib/breadcrumbs';
import { CONVERSIONS } from '@shared/conversions';
import { DOCS_SECTION_IDS } from '@/lib/docs-sections';
import { useI18n, useT } from '@/lib/i18n/context';
import { MCP_PATH, MCP_TOOL_NAMES, MCP_TOOLS } from '@/lib/mcp-facts';
import { FAQ_FLAGS } from '@/lib/faq';
import { useTheme } from '@/lib/theme';
import { useActiveHeading } from '@/lib/use-active-heading';
import { CodeBlock, InlineCode } from '@/ui/components/Code';
import { DefinitionTable } from '@/ui/components/DefinitionTable';
import { Faq } from '@/ui/components/Faq';
import { Typography } from '@/ui/components/Typography';
import { TableOfContents } from '@/ui/components/TableOfContents';
import { ZoomableImage } from '@/ui/components/ZoomableImage';
import { cn } from '@/ui/lib/utils';

/*
 * The manual, living at /docs inside the app it documents.
 *
 * A separate site would drift: built from another checkout, styled by another stylesheet, updated
 * whenever someone remembered. Here the screenshots are captured from this app by
 * `npm run docs:shots`, the tokens are the app's own, and the header links to it — so the page can
 * only ever be as stale as the deployment it ships in.
 *
 * None of the words are in this file. The prose is `docs.*` in the catalogue and the eleven section
 * titles are `content.docs`, keyed by the same id the contents list and the address use, so the
 * page reads in whichever language the reader chose. What stays here is everything that is not
 * language: the order, the ids, the icons, and the paths, flags and endpoints the sentences wrap.
 */

/** The order and the ids come from `DOCS_SECTION_IDS`; the icons are this page's own business. */
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

const SECTIONS = DOCS_SECTION_IDS.map((id) => ({
  id,
  icon: ICONS[id] ?? BookOpen,
}));

/**
 * One catalogue sentence with elements dropped into its `{placeholders}`.
 *
 * A sentence that wraps a path, a flag or a bold label is one entry in the catalogue rather than
 * the two or three fragments the JSX would otherwise cut it into. Fragments cannot be reordered,
 * and a German sentence does not put the code where an English one does — so the whole sentence is
 * translated at once and the elements are dropped in wherever it asks for them. The code itself
 * stays in the JSX below, because a header name or a file extension is not a word anybody
 * translates.
 *
 * A placeholder with nothing to fill it renders as it is written, which is visible in review rather
 * than silently missing from the page.
 */
function Rich({
  text,
  parts,
}: {
  text: string;
  parts: Record<string, ReactNode>;
}) {
  return (
    <>
      {text.split(/(\{\w+\})/g).map((piece, index) => {
        const name = /^\{(\w+)\}$/.exec(piece)?.[1];

        return (
          <Fragment key={index}>
            {name && name in parts ? parts[name] : piece}
          </Fragment>
        );
      })}
    </>
  );
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
 * on a light page reads as somebody else's product. The name picks the file and is the same in
 * every language; the alt text and the caption are words, and arrive translated.
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
  const t = useT();

  return (
    <figure className="space-y-2">
      <ZoomableImage
        src={`/docs/${name}-${theme}.png`}
        alt={alt}
        caption={caption}
      />
      <figcaption className="text-ink-secondary text-xs">
        {caption}{' '}
        <span className="text-ink-inactive">{t('docs.shot.enlarge')}</span>
      </figcaption>
    </figure>
  );
}

export function DocsPage({ onGoToConverter }: { onGoToConverter: () => void }) {
  const active = useActiveHeading(SECTIONS.map((one) => one.id));
  const t = useT();
  /*
   * Three kinds of word on this page are not the page's own, and each is read from the slice that
   * owns it rather than copied into `docs.*`: the trail at the top, which every page shares; the
   * section titles, which the contents list beside the page needs as well; and the name of each
   * conversion, which the header's menu shows. Keyed by the same id in both places, so a heading
   * and the line linking to it — or a menu entry and the list item under it — cannot end up saying
   * two different things.
   */
  const { content, locale } = useI18n();
  const titles = content.docs;

  /*
   * The whole list of questions, in the reader's language.
   *
   * Not `FAQ_ENTRIES`: that one is zipped against the English slice on purpose, because the
   * connector's `tp_help` tool reads it from the server and answers in English. Rendering it here
   * put an English FAQ at the foot of a French manual — the words come from the catalogue, and the
   * flags stay in the code, position being the only id a question has.
   *
   * Unlike the converter's shorter list, nothing is filtered out: somebody in the documentation is
   * past deciding whether to use the thing and is looking for the detail.
   */
  const questions = useMemo(
    () => content.faq.map((one, index) => ({ ...one, ...FAQ_FLAGS[index] })),
    [content.faq]
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl gap-10">
      <TableOfContents
        items={SECTIONS.map(({ id, icon }) => ({
          id,
          title: titles[id].title,
          icon,
        }))}
        activeId={active}
        label={t('docs.toc')}
      />

      <div className="min-w-0 max-w-3xl flex-1 space-y-12 pb-8">
        <AppBreadcrumbs
          items={docsCrumbs(content, locale)}
          onNavigate={onGoToConverter}
        />

        <header className="space-y-3">
          <Typography
            variant="span"
            textColor="light"
            className="block text-xxs uppercase tracking-wide"
          >
            {t('docs.eyebrow')}
          </Typography>
          <Typography variant="h1" className="text-2xl md:text-2xl">
            {t('docs.title')}
          </Typography>
          <Typography variant="p" textColor="secondary" className="text-sm">
            {t('docs.lede')}
          </Typography>
        </header>

        <Section id="start" title={titles.start.title}>
          <p>{t('docs.start.signedOut')}</p>
          <p>{t('docs.start.signedIn')}</p>
        </Section>

        <Section id="converting" title={titles.converting.title}>
          <p>
            <Rich
              text={t('docs.converting.intro')}
              parts={{
                menu: <strong>{t('docs.converting.menu')}</strong>,
              }}
            />
          </p>
          <ul>
            {CONVERSIONS.map((one) => (
              <li key={one.id}>
                {/* Each conversion is named by the same entry the header's menu reads. */}
                <a href={one.path}>{content.conversions[one.id].label}</a> —{' '}
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
            <Rich
              text={t('docs.converting.sizes')}
              parts={{ docx: <InlineCode>.docx</InlineCode> }}
            />
          </p>
          <p>{t('docs.converting.oneShape')}</p>
          <Shot
            name="converter"
            alt={t('docs.converting.shot.converter.alt')}
            caption={t('docs.converting.shot.converter.caption')}
          />
          <p>{t('docs.converting.flavour')}</p>
          <Shot
            name="preview"
            alt={t('docs.converting.shot.preview.alt')}
            caption={t('docs.converting.shot.preview.caption')}
          />
          <p>
            <Rich
              text={t('docs.converting.source')}
              parts={{
                to: <em>{t('docs.converting.source.emphasis')}</em>,
              }}
            />
          </p>
          <p>
            <Rich
              text={t('docs.converting.download')}
              parts={{
                html: <InlineCode>.html</InlineCode>,
                md: <InlineCode>.md</InlineCode>,
              }}
            />
          </p>
          <Shot
            name="source"
            alt={t('docs.converting.shot.source.alt')}
            caption={t('docs.converting.shot.source.caption')}
          />
          <p>{t('docs.converting.reading')}</p>
        </Section>

        <Section id="history" title={titles.history.title}>
          <p>{t('docs.history.intro')}</p>
          <Shot
            name="history"
            alt={t('docs.history.shot.history.alt')}
            caption={t('docs.history.shot.history.caption')}
          />
          <p>
            <Rich
              text={t('docs.history.chips')}
              parts={{
                all: <em>{t('docs.history.chip.all')}</em>,
                shared: <em>{t('docs.chip.shared')}</em>,
                badge: <InlineCode>DOCX → MD</InlineCode>,
              }}
            />
          </p>
          <p>{t('docs.history.downloading')}</p>
          <p>{t('docs.history.selection')}</p>
          <Shot
            name="selection"
            alt={t('docs.history.shot.selection.alt')}
            caption={t('docs.history.shot.selection.caption')}
          />
        </Section>

        <Section id="sharing" title={titles.sharing.title}>
          <p>
            <Rich
              text={t('docs.sharing.modes')}
              parts={{
                anyone: <strong>{t('docs.sharing.mode.link')}</strong>,
                path: <InlineCode>/s/&lt;token&gt;</InlineCode>,
                only: <strong>{t('docs.sharing.mode.people')}</strong>,
              }}
            />
          </p>
          <p>{t('docs.sharing.revoking')}</p>
          <p>
            <Rich
              text={t('docs.sharing.incoming')}
              parts={{ shared: <strong>{t('docs.chip.shared')}</strong> }}
            />
          </p>
          <p>
            <Rich
              text={t('docs.sharing.safety')}
              parts={{
                csp: <InlineCode>script-src 'none'</InlineCode>,
              }}
            />
          </p>
        </Section>

        <Section id="account" title={titles.account.title}>
          <p>{t('docs.account.signIn')}</p>
          <p>{t('docs.account.keys')}</p>
        </Section>

        <Section id="api" title={titles.api.title}>
          <p>
            <Rich
              text={t('docs.api.intro')}
              parts={{
                auth: (
                  <InlineCode>Authorization: Bearer tp_live_…</InlineCode>
                ),
              }}
            />
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
                  <Rich
                    text={t('docs.api.post')}
                    parts={{
                      name: <InlineCode>?name=</InlineCode>,
                      json: <InlineCode>{'{name, markdown}'}</InlineCode>,
                      share: <InlineCode>?share=link|people</InlineCode>,
                      kindHtml: (
                        <InlineCode>?kind=html-to-markdown</InlineCode>
                      ),
                      kindCsv: <InlineCode>?kind=csv-to-markdown</InlineCode>,
                      kindJson: (
                        <InlineCode>?kind=json-to-markdown</InlineCode>
                      ),
                      word: <InlineCode>word-to-markdown</InlineCode>,
                      docx: <InlineCode>.docx</InlineCode>,
                    }}
                  />
                ),
              },
              {
                key: 'list',
                term: <InlineCode>GET /api/v1/documents</InlineCode>,
                text: t('docs.api.list'),
              },
              {
                key: 'one',
                term: <InlineCode>GET /api/v1/documents/:id</InlineCode>,
                text: t('docs.api.one'),
              },
              {
                key: 'html',
                term: <InlineCode>GET /api/v1/documents/:id.html</InlineCode>,
                text: (
                  <Rich
                    text={t('docs.api.html')}
                    parts={{ theme: <InlineCode>?theme=dark</InlineCode> }}
                  />
                ),
              },
              {
                key: 'delete',
                term: <InlineCode>DELETE /api/v1/documents/:id</InlineCode>,
                text: t('docs.api.delete'),
              },
              {
                key: 'share',
                term: <InlineCode>GET | PUT /api/v1/documents/:id/share</InlineCode>,
                text: (
                  <Rich
                    text={t('docs.api.share')}
                    parts={{
                      modes: <InlineCode>{'{mode, emails[]}'}</InlineCode>,
                      private: <InlineCode>private</InlineCode>,
                    }}
                  />
                ),
              },
              {
                key: 'usage',
                term: <InlineCode>GET /api/v1/usage</InlineCode>,
                text: t('docs.api.usage'),
              },
            ]}
          />
          <p>
            <Rich
              text={t('docs.api.errors')}
              parts={{
                shape: <InlineCode>{'{ "error": "…" }'}</InlineCode>,
              }}
            />
          </p>
        </Section>

        <Section id="cli" title={titles.cli.title}>
          <p>
            <Rich
              text={t('docs.cli.intro')}
              parts={{ cli: <InlineCode>cli/tp.mjs</InlineCode> }}
            />
          </p>
          <CodeBlock>{`node cli/tp.mjs login tp_live_…          # remembers the key for this machine
node cli/tp.mjs push README.md --share    # prints the link
node cli/tp.mjs push docs/*.md --merge --share --name handbook.md
node cli/tp.mjs push page.html            # converted to Markdown on the way in
node cli/tp.mjs list
node cli/tp.mjs rm <id>
node cli/tp.mjs usage                     # 65.8 kB of 100.0 MB · 3 of 500 documents`}</CodeBlock>
          <p>
            <Rich
              text={t('docs.cli.extensions')}
              parts={{
                html: <InlineCode>.html</InlineCode>,
                csv: <InlineCode>.csv</InlineCode>,
                tsv: <InlineCode>.tsv</InlineCode>,
                json: <InlineCode>.json</InlineCode>,
                docx: <InlineCode>.docx</InlineCode>,
                merge: <InlineCode>--merge</InlineCode>,
              }}
            />
          </p>
          <p>
            <Rich
              text={t('docs.cli.key')}
              parts={{
                key: <InlineCode>--key</InlineCode>,
                env: <InlineCode>TP_API_KEY</InlineCode>,
                config: <InlineCode>~/.config/tp/config.json</InlineCode>,
                host: <InlineCode>TP_HOST</InlineCode>,
                json: <InlineCode>--json</InlineCode>,
              }}
            />
          </p>
        </Section>

        <Section id="action" title={titles.action.title}>
          <p>{t('docs.action.intro')}</p>
          <CodeBlock>{`- uses: Aborsen/MD2HTML@v1
  with:
    api-key: \${{ secrets.TP_API_KEY }}`}</CodeBlock>
          <p>
            <Rich
              text={t('docs.action.workflow')}
              parts={{
                example: (
                  <InlineCode>examples/publish-markdown.yml</InlineCode>
                ),
                depth: <InlineCode>fetch-depth: 0</InlineCode>,
                permission: <InlineCode>pull-requests: write</InlineCode>,
              }}
            />
          </p>
          <DefinitionTable
            rows={[
              {
                key: 'api-key',
                term: <InlineCode>api-key</InlineCode>,
                text: t('docs.action.input.apiKey'),
              },
              {
                key: 'files',
                term: <InlineCode>files</InlineCode>,
                text: t('docs.action.input.files'),
              },
              {
                key: 'share',
                term: <InlineCode>share</InlineCode>,
                text: (
                  <Rich
                    text={t('docs.action.input.share')}
                    parts={{
                      link: <InlineCode>link</InlineCode>,
                      people: <InlineCode>people</InlineCode>,
                      none: <InlineCode>none</InlineCode>,
                    }}
                  />
                ),
              },
              {
                key: 'merge',
                term: <InlineCode>merge</InlineCode>,
                text: t('docs.action.input.merge'),
              },
              {
                key: 'comment',
                term: <InlineCode>comment</InlineCode>,
                text: t('docs.action.input.comment'),
              },
              {
                key: 'host',
                term: <InlineCode>host</InlineCode>,
                text: t('docs.action.input.host'),
              },
            ]}
          />
          <p>{t('docs.action.pushes')}</p>
        </Section>

        <Section id="assistant" title={titles.assistant.title}>
          <p>
            <Rich
              text={t('docs.assistant.intro')}
              parts={{ path: <InlineCode>{MCP_PATH}</InlineCode> }}
            />
          </p>

          <CodeBlock>{`${window.location.origin}${MCP_PATH}`}</CodeBlock>

          <p>{t('docs.assistant.adding')}</p>

          <CodeBlock>{`claude mcp add --transport http transformpipe ${window.location.origin}${MCP_PATH}`}</CodeBlock>

          <p>{t('docs.assistant.auth')}</p>

          {/*
            * The connector's own table stays English: `mcp-facts.ts` is what the server hands a
            * model as its tool list, and a tool name and its description are part of a protocol.
            */}
          <DefinitionTable
            rows={MCP_TOOL_NAMES.map((name) => ({
              key: name,
              term: <InlineCode>{name}</InlineCode>,
              text: MCP_TOOLS[name],
            }))}
          />

          <p>{t('docs.assistant.tools')}</p>
        </Section>

        <Section id="limits" title={titles.limits.title}>
          <DefinitionTable
            rows={[
              {
                key: 'account',
                term: t('docs.limits.account.term'),
                text: t('docs.limits.account.text'),
              },
              {
                key: 'convert',
                term: t('docs.limits.convert.term'),
                text: t('docs.limits.convert.text'),
              },
              {
                key: 'document',
                term: t('docs.limits.document.term'),
                text: t('docs.limits.document.text'),
              },
              {
                key: 'caller',
                term: t('docs.limits.caller.term'),
                text: t('docs.limits.caller.text'),
              },
            ]}
          />
          <p>{t('docs.limits.refusal')}</p>
        </Section>

        <Section id="faq" title={titles.faq.title}>
          <p>{t('docs.faq.intro')}</p>
          <Faq items={questions} />
        </Section>

        <footer className="border-stroke border-t pt-6 text-ink-secondary text-sm">
          {t('docs.footer.source')}{' '}
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
