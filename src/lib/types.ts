export interface ConvertedDoc {
  id: string;
  name: string;
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
