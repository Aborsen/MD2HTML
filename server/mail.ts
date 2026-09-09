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

const ENDPOINT = 'https://api.resend.com/emails';

/** The most a send may add to the request that triggered it. */
const TIMEOUT_MS = 4000;

/** Resend refuses anything else, and a from address on an unverified domain bounces silently. */
const FROM = process.env.MAIL_FROM ?? 'transformpipe <no-reply@transformpipe.com>';

export interface Sent {
  ok: boolean;
  /** Why not, for the log. Never shown to the person who triggered the send. */
  reason?: string;
}

const NOT_CONFIGURED: Sent = { ok: false, reason: 'no RESEND_API_KEY' };

/**
 * The same message, as HTML.
 *
 * Built from the text rather than written twice, so the two parts cannot say different things: a
 * blank line becomes a paragraph and a line that is a URL becomes a link. No images, no tracking,
 * no styling beyond a readable measure — what this exists for is to be a `text/html` alternative
 * at all, not to be a design.
 */
function asHtml(text: string): string {
  const escape = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((line) => {
        const bare = line.trim();

        return /^https?:\/\/\S+$/.test(bare)
          ? `<a href="${escape(bare)}">${escape(bare)}</a>`
          : escape(line);
      });

      return `<p>${lines.join('<br>')}</p>`;
    })
    .join('\n');

  return `<div style="font:16px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;max-width:34em">${paragraphs}</div>`;
}

async function send(message: {
  to: string;
  subject: string;
  text: string;
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
        text: message.text,
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
        html: asHtml(message.text),
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
    text: [
      `${from} shared a document with you on transformpipe.`,
      '',
      documentName,
      url,
      '',
      `It was shared with ${to} specifically rather than published, so opening it means signing in`,
      'with that address. Nobody else can open the link.',
      '',
      'transformpipe.com — a document converter that runs in your browser',
    ].join('\n'),
  });
}

/**
 * The one message a new account gets.
 *
 * Short, and it says what the account is for rather than thanking anybody for joining. Somebody who
 * has just converted a file knows what the product does; what they do not know is that the document
 * is now theirs on another machine, that a link will publish it, and that a key or an assistant can
 * reach it. Three sentences and the addresses to find them at.
 *
 * Plain text, like the share notice, and for the same reasons: it renders the same everywhere and
 * carries no tracking pixel to land it in a spam folder.
 */
export async function sendWelcome(options: {
  to: string;
  origin: string;
}): Promise<Sent> {
  const { to, origin } = options;

  return send({
    to,
    subject: 'Your transformpipe account',
    text: [
      'Your account is ready.',
      '',
      'Signed in, the documents you convert are kept and follow you to another machine, and any',
      'one of them can be shared as a link or addressed to particular people.',
      '',
      `Everything the app does, a script can do too: ${origin}/docs has the API, a command-line`,
      'client and a GitHub Action. An assistant can be connected from the account menu, under MCP',
      'connector, with no key to paste.',
      '',
      `Converting still happens in your browser, signed in or out — no file is uploaded. ${origin}/privacy`,
      'says what is stored and what is not.',
      '',
      'transformpipe.com',
    ].join('\n'),
  });
}

/** Whether this deployment can send at all, for a caller that wants to say so in its response. */
export const canSendMail = () => Boolean(process.env.RESEND_API_KEY);
