export interface ConvertedDoc {
  id: string;
  name: string;
  /** Present when the document was chained from several files, in merge order. */
  sources?: string[];
  /** Its id in the account, once it is stored there — sharing needs a server-side row. */
  remoteId?: string;
  size: number;
  createdAt: number;
  markdown: string;
  html: string;
  stats: {
    words: number;
    headings: number;
    links: number;
    codeBlocks: number;
    tables: number;
    images: number;
  };
}
