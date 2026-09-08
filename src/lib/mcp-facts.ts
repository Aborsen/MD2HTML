/*
 * What the connector is, in one place.
 *
 * The documentation page and the server both read this. That matters more than it looks: a page
 * that lists a tool the server no longer has sends people somewhere that does not exist, and they
 * conclude the product is broken rather than that the sentence is. Here the server's tool table is
 * typed by `McpToolName`, so a tool renamed on one side stops the build on the other.
 */

export const MCP_PATH = '/api/mcp';

export const MCP_TOOL_NAMES = [
  'tp_help',
  'tp_convert_markdown',
  'tp_save_document',
  'tp_list_documents',
  'tp_get_document',
  'tp_share_document',
  'tp_usage',
  'tp_delete_document',
] as const;

export type McpToolName = (typeof MCP_TOOL_NAMES)[number];

/** One line each, for the page. The server holds the long descriptions the model reads. */
export const MCP_TOOLS: Record<McpToolName, string> = {
  tp_help: 'Answers questions about transformpipe from the documentation rather than from memory.',
  tp_convert_markdown:
    'Markdown in, sanitised HTML out. Optionally the whole self-contained document.',
  tp_save_document:
    'Saves Markdown to the account, and publishes it in the same call when asked.',
  tp_list_documents: 'What is on the account, with the id each other tool takes.',
  tp_get_document: 'One document, as its Markdown source or as rendered HTML.',
  tp_share_document:
    'Changes who may open a document: a link, named addresses, or nobody.',
  tp_usage: 'What the account is using against its limits.',
  tp_delete_document:
    'Deletes one document, permanently, and only with an explicit confirmation.',
};
