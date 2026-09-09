import type { Content } from '../../content';

/*
 * The words of the five pages that are only words: about, contact, and the legal three.
 *
 * `src/lib/pages.ts` keeps what a page *is* — its id, its address, and the date the legal three
 * state — and this file keeps what a page *says*. Same reason the split exists everywhere else in
 * here: a path is the same in five languages and a paragraph is not, so a translator who opens
 * this file cannot break a route by editing a sentence.
 *
 * Keyed by `StaticPageId`, so a page added to the union without its words stops the build instead
 * of rendering a blank screen. Plain strings rather than React: the prerenderer runs in Node with
 * no React in it, and these pages are the ones a crawler reads in full.
 *
 * The legal three are policy. Moving them here changed no word of them, and translating them is a
 * job for somebody who can say what they mean in the other language — not a paraphrase.
 */

export const pages: Content['pages'] = {
  about: {
    label: 'About',
    title: 'About transformpipe',
    lede: 'A converter that does the work in your browser and stays out of the way.',
    sections: [
      {
        heading: 'What it is',
        body: [
          'transformpipe turns documents into other documents. Markdown into a finished HTML page, and HTML, Word files, spreadsheets and JSON into Markdown. Drop a file, see what it became, take it away as Markdown, HTML, plain text or a PDF.',
          'Everything normalises to Markdown, because Markdown is a format you can read, diff, and keep for twenty years without owning the tool that made it.',
        ],
      },
      {
        heading: 'Why it works this way',
        body: [
          'The conversion runs in your browser. Signed out, no file is sent anywhere — there is no upload to trust, because there is no upload. Sign in and the Markdown is kept in your account so a document follows you to another machine, and it stays private until you share it.',
          'The exported HTML is one file with its styles inline. It asks the network for nothing, which means it opens the same on a laptop with no connection in five years as it does today.',
        ],
      },
      {
        heading: 'Beyond the app',
        body: [
          'The same conversions are reachable from a terminal, from a pull request, and from an assistant: there is a public API, a dependency-free command-line client, a GitHub Action that publishes the Markdown a pull request changed, and an MCP server so a model can convert and share documents on your behalf. The documentation covers all of it.',
        ],
      },
      {
        heading: 'Who builds it',
        body: [
          'transformpipe is built by Raudar Labs.',
        ],
      },
    ],
    seo: {
      title: 'About transformpipe',
      description:
        'transformpipe converts Markdown, HTML, Word, CSV and JSON documents in your browser, with an API, a CLI, a GitHub Action and an MCP server. Built by Raudar Labs.',
    },
  },
  contact: {
    label: 'Contact us',
    title: 'Contact us',
    lede: 'A bug, a format you need, or something that should not be published.',
    sections: [
      {
        heading: 'Bugs and requests',
        body: [
          'Open an issue on the repository. A file that converted wrongly is the most useful thing you can send — attach it if you can share it, and say what you expected instead.',
          'A format we do not convert yet is a request worth making. Several of the ones here started that way.',
        ],
      },
      {
        heading: 'Something shared that should not be',
        body: [
          'Every shared document carries a “Report this document” link at the foot of the page it opens. That link is the fastest route: it identifies the document without you having to describe it.',
        ],
      },
      {
        heading: 'Privacy and legal',
        body: [
          'Questions about what is stored, or a request to delete an account and everything in it, go to the same place. Signed in, you can also delete any document yourself — that removes the row and the stored source together.',
        ],
      },
    ],
    seo: {
      title: 'Contact transformpipe',
      description:
        'Report a bug, ask for a format, flag a shared document, or ask what is stored and have it deleted.',
    },
  },
  privacy: {
    label: 'Privacy',
    title: 'Privacy',
    lede: 'What is stored, where, and what is never collected at all.',
    sections: [
      {
        heading: 'Signed out, nothing reaches us',
        body: [
          'Converting happens in your browser. The file is read, converted and rendered on your own machine, and no part of it is sent to a server. The history you see is your browser’s own storage, not an account.',
        ],
      },
      {
        heading: 'Signed in, this much and no more',
        body: [
          'An account exists so documents can follow you between devices and be shared. It holds:',
        ],
        items: [
          'Your identity from Google, through our authentication provider: an email address, a name, and an account id. We never see or store a password.',
          'For each document you keep: its name, which conversion made it, its size, counts of words, headings, links, code blocks, tables and images, and when it was created.',
          'The Markdown itself, in a private blob store — private meaning it has no public URL and is read only through a request we authorise.',
          'API keys as hashes, never the key. A key is shown once, at creation, and cannot be recovered afterwards — not by you and not by us.',
          'Share settings: whether a document is private, open by link, or addressed to particular email addresses, and the token that a link carries.',
        ],
      },
      {
        heading: 'What we do not do',
        body: [
          'There is no analytics, no advertising, no tracking pixel and no third-party script on this site — not a reduced set, none. Nothing is sold, and nothing is shared with anyone except the infrastructure that runs the service: the database, the blob store, the authentication provider and the host.',
          'Your documents are not read by us, and they are not used to train anything.',
        ],
      },
      {
        heading: 'Cookies and browser storage',
        body: [
          'One session cookie, set by our authentication provider when you sign in, first-party and HttpOnly. A short-lived cookie exists during the sign-in round trip and expires in ten minutes. That is all of them — there is nothing optional to turn off. The cookies page has the detail.',
          'Your theme and, when signed out, your history live in your browser’s local storage. They never leave it.',
        ],
      },
      {
        heading: 'Deleting things',
        body: [
          'Deleting a document deletes the row and the stored Markdown together, at once, not on a schedule. Revoking a share drops the token, so a link already sent stops working.',
          'To remove an account and everything in it, ask — see the contact page. Reaching a storage limit refuses the write; it never deletes something you chose to keep to make room.',
        ],
      },
      {
        heading: 'Children',
        body: [
          'This is a tool for work, not a service for children, and it is not directed at anyone under 16.',
        ],
      },
      {
        heading: 'Changes',
        body: [
          'If this page changes in a way that affects what is collected, the date above changes with it.',
        ],
      },
    ],
    seo: {
      title: 'Privacy — transformpipe',
      description:
        'Signed out, no file leaves your browser. Signed in, we store the document, its metadata and your Google identity — no analytics, no tracking, no third-party scripts.',
    },
  },
  terms: {
    label: 'Terms',
    title: 'Terms of use',
    lede: 'The short version, because a long one would not be read.',
    sections: [
      {
        heading: 'Using the service',
        body: [
          'transformpipe is offered free of charge, as it is. Use it for anything you have the right to convert, from the app, the API, the command line or an assistant.',
          'An account is yours to keep or delete. You are responsible for what you do with an API key, so treat one as a password: anyone holding it can read and write your documents.',
        ],
      },
      {
        heading: 'Your documents stay yours',
        body: [
          'You keep every right you had in a document before you converted it. We claim no ownership and no licence beyond what running the service requires: storing it so you can open it again, and serving it to whoever you deliberately shared it with.',
        ],
      },
      {
        heading: 'What not to put here',
        body: [
          'Do not use the service for content that is unlawful, that you have no right to distribute, or that exists to harm somebody — malware, material that sexually exploits children, targeted harassment. Do not use a share link to run a phishing page.',
          'Shared documents can be reported by anyone who opens them. A document that breaks this section may be unpublished or deleted, and a repeat account closed.',
        ],
      },
      {
        heading: 'Limits and availability',
        body: [
          'Rate and storage limits apply and are published in the documentation. They exist to keep the service up, and may change.',
          'There is no uptime promise. The service may be interrupted, and features may change or be withdrawn. Keep your own copy of anything you cannot lose — the download exists for exactly that, and it needs nothing from us to open.',
        ],
      },
      {
        heading: 'No warranty, and the limit of what we owe',
        body: [
          'The service is provided without warranty of any kind, express or implied. To the fullest extent the law allows, Raudar Labs is not liable for lost data, lost profit, or any indirect or consequential loss arising from using it.',
          'Nothing here limits a right you have that cannot be limited by agreement.',
        ],
      },
      {
        heading: 'Changes and ending',
        body: [
          'These terms may change; the date above says when they last did, and continuing to use the service is how they are accepted. You can stop at any time by deleting your documents and your account.',
        ],
      },
    ],
    seo: {
      title: 'Terms of use — transformpipe',
      description:
        'transformpipe is free and provided as it is. Your documents stay yours, limits are published, and there is no warranty.',
    },
  },
  cookies: {
    label: 'Cookies',
    title: 'Cookies',
    lede: 'There are two, both required to sign in, and nothing to configure.',
    sections: [
      {
        heading: 'Nothing to switch off',
        body: [
          'Most cookie pages exist to let you decline analytics and advertising. This site has neither, so this page has no switches — declining is the only setting, and it is already how the site works.',
          'Signed out, this site sets no cookies at all.',
        ],
      },
      {
        heading: 'The two that exist',
        body: [
          'Both are set by our authentication provider, are first-party, and are marked HttpOnly and Secure — script on the page cannot read them:',
        ],
        items: [
          '__Secure-neon-auth.session_token — keeps you signed in. Without it, every page load would ask you to sign in again. It goes when you sign out.',
          '__Secure-neon-auth.session_challenge — exists for the ten minutes of a sign-in round trip, so the reply from Google can be matched to the request that started it. It is what stops somebody else’s sign-in landing in your session.',
        ],
      },
      {
        heading: 'Browser storage, which is not a cookie',
        body: [
          'Two things live in your browser’s local storage and are never sent anywhere: the theme you picked, and — when you are signed out — your recent conversions, so the history has something in it. Clearing site data in your browser removes both, and the app carries on without them.',
        ],
      },
      {
        heading: 'If that changes',
        body: [
          'If anything optional is ever added, this page gets a real control before it is set, not after. The date above will say when.',
        ],
      },
    ],
    seo: {
      title: 'Cookies — transformpipe',
      description:
        'Two first-party session cookies, both needed to sign in. No analytics, no advertising, nothing optional to configure.',
    },
  },
};
