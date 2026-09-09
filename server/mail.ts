/*
 * Outbound email, over Resend's HTTP API.
 *
 * One `fetch` rather than the SDK. The SDK is a dependency, a build-time weight and a version to
 * keep current, and what it wraps is a single POST with a bearer token — the same argument that
 * keeps the CLI dependency-free.
 *
 * Everything here is best effort. A share that succeeded must not be reported as failed because a
 * mail provider was slow, and a deployment with no key configured must behave like a deployment
 * that simply does not send mail — silently, not by throwing on the first share. So every function
 * returns what happened and nothing here ever rejects.
 *
 * And every caller AWAITS it. The first version fired these off after the response and moved on,
 * which is the natural thing to write and the wrong thing in a serverless function: the platform
 * may freeze the instance the moment the response is sent, and a fetch that had not left yet never
 * does. Three addresses were added on a live deployment and Resend logged nothing at all — not a
 * failure, an absence. So the send is part of the request, and `TIMEOUT_MS` is what keeps a slow
 * provider from turning that into a slow share.
 *
 * In English, whatever the sender's language. These messages go to somebody who has never been to
 * the site, at an address we know nothing else about: there is no locale to read, and the shared
 * document page they are about to open is English for the same reason.
 *
 * Deliverability is mostly not in this file. SPF and DKIM are Resend's records and verified; the
 * missing piece when the first notice landed in spam was a DMARC record on the domain, which is
 * DNS rather than code. What is in here is not making it worse: a subject that does not lead with
 * a raw address, a Reply-To when there is a person behind the message, and both MIME parts.
 */

import { markdownToHtml } from './render.js';

const ENDPOINT = 'https://api.resend.com/emails';

/** The most a send may add to the request that triggered it. */
const TIMEOUT_MS = 4000;

/** Resend refuses anything else, and a from address on an unverified domain bounces silently. */
const FROM =
  process.env.MAIL_FROM ?? 'TransformPipe <no-reply@transformpipe.com>';

export interface Sent {
  ok: boolean;
  /** Why not, for the log. Never shown to the person who triggered the send. */
  reason?: string;
}

const NOT_CONFIGURED: Sent = { ok: false, reason: 'no RESEND_API_KEY' };

/*
 * A message is written once, in Markdown, and both MIME parts come out of it.
 *
 * The HTML part is rendered by `markdownToHtml` — the same converter the product sells, the same
 * one that renders every article on the blog. Anything that breaks an email here breaks a customer
 * document too, which is a better place for a bug to be found than in somebody's inbox.
 *
 * The text part is not the Markdown as written: `[docs](https://…)` reads badly in a plain-text
 * client, so a link becomes "docs: https://…" and a bullet becomes a dash. Everything else about
 * Markdown is already plain text, which is the whole reason it is the source.
 */

/** The Markdown, flattened for a client that shows no markup. */
function asText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1: $2')
    .replace(/^(\s*)[*-]\s+/gm, '$1- ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();
}

/**
 * The Markdown, as HTML, wrapped in enough style to be readable and nothing more.
 *
 * No images and no tracking pixel. The reason to send an HTML part at all is that a text-only
 * message from a domain with no sending history is treated as suspicious — not that a notice with
 * a handful of links in it needs design.
 */
function asHtml(markdown: string): string {
  return [
    '<div style="font:16px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;',
    'color:#1f2430;max-width:34em">',
    markdownToHtml(markdown),
    '</div>',
  ].join('');
}

async function send(message: {
  to: string;
  subject: string;
  /** The body, in Markdown. Both parts are derived from it — see `asText` and `asHtml`. */
  markdown: string;
  /**
   * Where a reply goes, when there is a person to reply to.
   *
   * A share notice is from somebody, and a message you cannot answer from an address that says
   * no-reply is both less useful and more suspicious — filters weigh replyability, and a recipient
   * who wants to ask "what is this?" should be able to.
   */
  replyTo?: string;
}): Promise<Sent> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    return NOT_CONFIGURED;
  }

  /*
   * Resend answers in a few hundred milliseconds. Four seconds is long enough that a normal send
   * never hits it and short enough that a share is never held hostage by a provider having a bad
   * minute — the access is already written either way.
   */
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [message.to],
        subject: message.subject,
        text: asText(message.markdown),
        /*
         * Both parts, not text alone.
         *
         * The first version sent text only, on the argument that a notice with one link in it
         * gains nothing from markup and that an HTML template usually arrives with a tracking
         * pixel in it. The second half of that is still true and there is no pixel here — but
         * text-only automated mail from a domain with no sending history is exactly what a filter
         * treats harshly, and the first share notice this product ever sent went to spam. So the
         * HTML part is the same words, marked up and nothing more.
         */
        html: asHtml(message.markdown),
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      /*
       * The body carries Resend's own reason — an unverified domain, a suppressed address, a rate
       * limit. Kept short: this goes to a log, and a whole error page in a log line is noise.
       */
      const said = await response.text().catch(() => '');

      return { ok: false, reason: `${response.status} ${said.slice(0, 200)}` };
    }

    return { ok: true };
  } catch (cause) {
    return {
      ok: false,
      reason:
        cause instanceof Error && cause.name === 'AbortError'
          ? `no answer in ${TIMEOUT_MS}ms`
          : cause instanceof Error
            ? cause.message
            : 'network',
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Tells somebody a document has been shared with their address.
 *
 * Two parts, text and HTML, generated from the one set of words — see `asHtml`. No images and no
 * tracking pixel: the reason to have an HTML part at all is that a text-only message from a young
 * domain is treated as suspicious, not that a notice with one link in it needs design.
 *
 * The sentence about signing in is the whole point of the message. A document shared to named
 * addresses is not a public link: opening it requires being signed in as that address, and somebody
 * who does not know that clicks the link, sees a sign-in page, and assumes it is broken.
 */
export async function sendShareNotice(options: {
  to: string;
  /** The address that shared it. Shown, because an anonymous share is a phishing email. */
  from: string;
  documentName: string;
  url: string;
}): Promise<Sent> {
  const { to, from, documentName, url } = options;

  return send({
    to,
    replyTo: from.includes('@') ? from : undefined,
    /*
     * The document's name, not the sharer's address.
     *
     * The first version led with the address — `someone@example.com shared "notes.md" with you` —
     * which puts a raw email address and a quoted filename in the subject line, and that pair is a
     * shape spam filters know well. Who shared it is the first line of the body, where it belongs.
     */
    subject: `${documentName} was shared with you`,
    markdown: [
      `${from} shared a document with you on TransformPipe.`,
      '',
      `**${documentName}** — [open it](${url})`,
      '',
      `It was shared with ${to} specifically rather than published, so opening it means signing in`,
      'with that address. Nobody else can open the link.',
      '',
      '[TransformPipe](https://transformpipe.com) — a document converter that runs in your browser.',
    ].join('\n'),
  });
}

/**
 * The one message a new account gets.
 *
 * It says what the account makes possible and where to go next — the manual, the blog, and the
 * issue tracker, which is the only address this product has for hearing back from anybody. The
 * privacy sentence is in it because that is the claim the whole thing rests on and the moment
 * somebody signs in is exactly when they might assume it stopped being true.
 *
 * The links are built from the origin the request came in on, so a preview deployment sends people
 * to itself rather than to production.
 */
export async function sendWelcome(options: {
  to: string;
  /** The account's name, as the auth service has it. May be an email's local part, or empty. */
  name: string | null;
  origin: string;
}): Promise<Sent> {
  const { to, name, origin } = options;

  /*
   * A first name, only when there is one.
   *
   * Signing up with a password does not ask for a name, so the account gets the local part of the
   * address — and "Hi admin," is worse than no greeting at all. So a name is used only when it is
   * not simply what comes before the @, and the sentence works either way.
   */
  const local = to.split('@')[0]?.toLowerCase() ?? '';
  const first = (name ?? '').trim().split(/\s+/)[0] ?? '';
  const greeting =
    first && first.toLowerCase() !== local ? `Hi ${first},` : 'Hi,';

  return send({
    to,
    subject: 'Welcome to TransformPipe',
    markdown: [
      greeting,
      '',
      'Welcome to the TransformPipe community — we’re glad you’re here.',
      '',
      'Your account is ready. You can now keep your converted documents in one place, access',
      'them from another device, and share them via a link or directly with specific people.',
      '',
      'Here are a few places to start:',
      '',
      `* **Documentation:** [transformpipe.com/docs](${origin}/docs)`,
      '  Learn how to get more from TransformPipe with the API, command-line client, GitHub',
      '  Action, and MCP Connector for AI assistants. You can connect an assistant from the',
      '  account menu without creating or pasting an API key.',
      `* **Blog:** [transformpipe.com/blog](${origin}/blog)`,
      '  Explore product updates, practical workflows, and ideas for automating document',
      '  conversion.',
      '* **Feedback and feature requests:**',
      '  [Open a GitHub issue](https://github.com/Aborsen/MD2HTML/issues/new)',
      '  Have an idea, found a bug, or want to share a workflow you’d like us to support? We’d',
      '  genuinely love to hear from you. Early community feedback directly shapes what we build',
      '  next.',
      '',
      'One important note on privacy: document conversion happens locally in your browser,',
      'whether you are signed in or not. Your files are not uploaded for conversion. You can read',
      `more in our [Privacy Policy](${origin}/privacy).`,
      '',
      'Thanks for joining us.',
      '',
      'Best,',
      'The TransformPipe team',
    ].join('\n'),
  });
}

/** Whether this deployment can send at all, for a caller that wants to say so in its response. */
export const canSendMail = () => Boolean(process.env.RESEND_API_KEY);
