import { FilterXSS } from 'xss';
import {
  ALLOWED_ATTR,
  ALLOWED_TAGS,
  renderMarkdown,
} from '../shared/markdown.js';

/*
 * The server half of the converter.
 *
 * Three sanitisers were tried before this one, and the reasons are worth keeping:
 *
 *   jsdom + DOMPurify   — the runtime refuses to load it: a CJS dependency requiring an ESM
 *                         module, ERR_REQUIRE_ESM on every request.
 *   linkedom, happy-dom — worse than failing. DOMPurify decides it has no usable DOM and returns
 *                         its input unchanged, script tag and all, while reporting success.
 *   sanitize-html       — same loader problem as jsdom; its parser is now ESM-only.
 *
 * `xss` parses the HTML itself and its whole dependency chain is CommonJS, so there is nothing to
 * emulate and nothing for the loader to trip over. The allow-list is the shared one, so both
 * runtimes keep the same things.
 */
const filter = new FilterXSS({
  whiteList: Object.fromEntries(
    ALLOWED_TAGS.map((tag) => [tag, [...ALLOWED_ATTR]])
  ),
  // Unknown tags go away entirely rather than being escaped into visible angle brackets.
  stripIgnoreTag: true,
  // For these, the content goes too: a stripped <script> tag would otherwise leave its source.
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
});

export function markdownToHtml(markdown: string): string {
  return renderMarkdown(markdown, (html) => filter.process(html));
}
