import type { ConversionId } from '@shared/conversions';

export interface ConvertedDoc {
  id: string;
  name: string;
  /** Which conversion produced it. */
  kind: ConversionId;
  /** Present when the document was chained from several files, in merge order. */
  sources?: string[];
  /** Its id in the account, once it is stored there — sharing needs a server-side row. */
  remoteId?: string;
  /**
   * Its row in this browser's history.
   *
   * Saving replaces that row rather than leaving the same document listed twice, once as converted
   * here and once as kept.
   */
  localId?: string;
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
