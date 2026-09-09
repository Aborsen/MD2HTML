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
 * In English, whatever the sender's language. These messages go to somebody who has never been to
 * the site, at an address we know nothing else about: there is no locale to read, and the shared
 * document page they are about to open is English for the same reason.
 */

const ENDPOINT = 'https://api.resend.com/emails';

/** Resend refuses anything else, and a from address on an unverified domain bounces silently. */
const FROM = process.env.MAIL_FROM ?? 'transformpipe <no-reply@transformpipe.com>';

export interface Sent {
  ok: boolean;
  /** Why not, for the log. Never shown to the person who triggered the send. */
  reason?: string;
}

const NOT_CONFIGURED: Sent = { ok: false, reason: 'no RESEND_API_KEY' };

async function send(message: {
  to: string;
  subject: string;
  text: string;
}): Promise<Sent> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    return NOT_CONFIGURED;
  }

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
      }),
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
      reason: cause instanceof Error ? cause.message : 'network',
    };
  }
}

/**
 * Tells somebody a document has been shared with their address.
 *
 * Plain text, not HTML. A notification with one link in it gains nothing from markup, arrives
 * looking the same in every client, and never lands in a spam folder for having a tracking pixel
 * in it — which is the other thing an HTML template usually brings.
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
    subject: `${from} shared "${documentName}" with you`,
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
