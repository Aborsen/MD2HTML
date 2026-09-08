import { NodeHtmlMarkdown } from 'node-html-markdown';

/*
 * HTML in, Markdown out — the same implementation in the browser and on the server.
 *
 * The library was chosen for that: it carries its own parser, so it runs where there is no DOM, and
 * the alternative that only works in a browser would have left the API, the command line and the
 * assistant tools unable to do a conversion the app offers on its own front page.
 *
 * It handles tables and strikethrough itself. Task lists it does not, so that is the one translator
 * written here: a checkbox inside a list item is the whole point of a task list, and a document that
 * loses its ticks on the way through has lost the thing somebody was tracking.
 */

const translators = {
  /*
   * `- [x] ` and `- [ ] `. The checkbox is rendered as the marker's text rather than as content of
   * the item, so the list item's own translator puts the dash in front of it and the two meet.
   */
  input: ({
    node,
  }: {
    node: { getAttribute(name: string): string | null | undefined };
  }) => {
    const type = (node.getAttribute('type') ?? '').toLowerCase();

    if (type !== 'checkbox') {
      return { ignore: true, recurse: false };
    }

    /*
     * `checked` is a boolean attribute: when it is there its value is the empty string, so presence
     * is the test. This parser answers `undefined` for an attribute that is absent, and comparing
     * against `null` alone turns every box into a ticked one — which is worse than losing them,
     * because a list of things to do arrives looking done.
     */
    const attribute = node.getAttribute('checked');
    const ticked =
      (attribute !== undefined && attribute !== null) ||
      node.getAttribute('data-checked') === 'true';

    /*
     * `ignore: false` is the load-bearing part. INPUT is on the library's own ignore list, and a
     * custom translator is merged over that entry rather than replacing it — so without this the
     * translator is registered, never runs, and the ticks disappear with no error anywhere.
     */
    return {
      content: ticked ? '[x] ' : '[ ] ',
      ignore: false,
      recurse: false,
      noEscape: true,
    };
  },
};

let converter: NodeHtmlMarkdown | null = null;

function instance(): NodeHtmlMarkdown {
  converter ??= new NodeHtmlMarkdown(
    {
      // Its own parser, everywhere. One parser means one set of results to explain.
      preferNativeParser: false,
      bulletMarker: '-',
      codeFence: '```',
      emDelimiter: '*',
      strongDelimiter: '**',
      // A wrapped line inside a paragraph is not a line break in Markdown, and pretending it is
      // fills the output with trailing spaces nobody asked for.
      keepDataImages: false,
    },
    translators as never
  );

  return converter;
}

/** Everything a browser or an editor wraps a fragment in, and none of it is the document. */
const STRIP = /<(script|style|noscript|template|svg|iframe|head|nav|footer)\b[\s\S]*?<\/\1>/gi;

export function htmlToMarkdown(html: string): string {
  const body = html
    // A saved page carries the whole browser chrome with it; the article is what was wanted.
    .replace(STRIP, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  return (
    instance()
      .translate(body)
      // Three or more blank lines is what a converted page usually arrives as.
      .replace(/\n{3,}/g, '\n\n')
      /*
       * The checkbox and the text after it each bring their own space, so a task item arrives with
       * two. One is what a task list is written with, and some parsers accept only that.
       */
      .replace(/^(\s*(?:[-*+]|\d+\.)\s\[[ xX]\])\s+/gm, '$1 ')
      .trim() + '\n'
  );
}
