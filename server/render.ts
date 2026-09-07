import sanitizeHtml from 'sanitize-html';
import {
  ALLOWED_ATTR,
  ALLOWED_TAGS,
  renderMarkdown,
} from '../shared/markdown.js';

/*
 * The server half of the converter.
 *
 * A parser, not a DOM. DOMPurify needs a real one, and neither emulation held up here: jsdom broke
 * the runtime outright (a CJS dependency requiring an ESM module), and the lighter stand-ins were
 * worse than that — DOMPurify reported success and returned the input untouched, script tag
 * included. sanitize-html parses the HTML itself, so there is nothing to emulate and nothing to
 * silently fall back to.
 *
 * The allow-list is the shared one, so both sides keep the same things.
 */
const attributes = { '*': [...ALLOWED_ATTR] };

export function markdownToHtml(markdown: string): string {
  return renderMarkdown(markdown, (html) =>
    sanitizeHtml(html, {
      allowedTags: [...ALLOWED_TAGS],
      allowedAttributes: attributes,
      // Only the schemes a document has any business linking to.
      allowedSchemes: ['http', 'https', 'mailto'],
      allowedSchemesByTag: { img: ['http', 'https', 'data'] },
      // `class` carries the code language marked puts on <code>; nothing else needs it.
      allowedClasses: { code: ['language-*'], pre: ['language-*'] },
      disallowedTagsMode: 'discard',
    })
  );
}
