import {
  type ConversionId,
  conversion,
  conversionForFile,
} from '@shared/conversions';

/*
 * Running a conversion in the browser.
 *
 * Every converter is loaded on demand. Two of them are not small — the one that reads .docx files
 * is the largest thing in this application by some distance — and somebody who came to convert
 * Markdown should not download a Word reader to do it. So each is behind `import()`, which Vite
 * turns into a chunk of its own, and the bundle for the front page stays the size it was.
 *
 * Everything ends as Markdown. That is what a document is stored and rendered as, so a conversion
 * that produced anything else would need its own version of the preview, the share page, the
 * export, the API and the assistant tools.
 */

export interface Converted {
  /** What the file became. */
  markdown: string;
  /** What to call it now: the same name with the extension the content has. */
  name: string;
  /** Which conversion produced it, so the history can say. */
  kind: ConversionId;
}

/** `notes.docx` becomes `notes.md`; a name with no extension gains one. */
function renamed(name: string, extension: string): string {
  const dot = name.lastIndexOf('.');

  return `${dot > 0 ? name.slice(0, dot) : name}${extension}`;
}

async function readText(file: File): Promise<string> {
  const text = await file.text();

  // A file saved by Windows carries a byte-order mark, and it is not part of the document.
  return text.replace(/^﻿/, '');
}

export async function convertFile(
  id: ConversionId,
  file: File
): Promise<Converted> {
  switch (id) {
    case 'html-to-markdown': {
      const { htmlToMarkdown } = await import('@shared/from-html');

      return {
        markdown: htmlToMarkdown(await readText(file)),
        name: renamed(file.name, '.md'),
        kind: id,
      };
    }

    case 'csv-to-markdown': {
      const { delimitedToMarkdown } = await import('@shared/from-table');
      const text = await readText(file);
      const table = delimitedToMarkdown(text, {
        // A tab-separated file says so in its name; anything else is sniffed from the first line.
        delimiter: file.name.toLowerCase().endsWith('.tsv') ? '\t' : undefined,
      });

      if (!table) {
        throw new Error('That file has no rows in it.');
      }

      // The name is worth keeping: a table with no title is a table nobody can place later.
      return {
        markdown: `# ${renamed(file.name, '')}\n\n${table}`,
        name: renamed(file.name, '.md'),
        kind: id,
      };
    }

    case 'word-to-markdown': {
      const [{ htmlToMarkdown }, mammoth] = await Promise.all([
        import('@shared/from-html'),
        import('mammoth'),
      ]);

      const { value, messages } = await mammoth.convertToHtml({
        arrayBuffer: await file.arrayBuffer(),
      });

      const markdown = htmlToMarkdown(value);

      if (!markdown.trim()) {
        /*
         * mammoth answers with its own account of what it could not map, and when the result is
         * empty that account is the only thing anybody can act on.
         */
        const why =
          messages
            .map((message) => message.message)
            .slice(0, 2)
            .join('; ') || 'the file has no text in it';

        throw new Error(`Nothing came out of that document — ${why}.`);
      }

      return { markdown, name: renamed(file.name, '.md'), kind: id };
    }

    default: {
      // Markdown is already Markdown; the HTML is made when it is shown.
      return {
        markdown: await readText(file),
        name: file.name,
        kind: 'markdown-to-html',
      };
    }
  }
}

/**
 * Which conversion a set of dropped files is, given the screen they were dropped on.
 *
 * The screen decides, unless the files plainly disagree with it — dropping a .docx on the Markdown
 * screen means "convert this", not "you are on the wrong page". A mixture is refused, because
 * chaining a spreadsheet onto a Word document is not something anybody meant to do.
 */
export function conversionForFiles(
  here: ConversionId,
  files: File[]
): { id: ConversionId; rejected?: string } {
  const guesses = files.map((file) => conversionForFile(file.name));
  const unknown = files.find((file, index) => guesses[index] === null);

  if (unknown) {
    return {
      id: here,
      rejected: `${unknown.name} — ${conversion(here).extensions.join(', ')} is what this page takes.`,
    };
  }

  const ids = [...new Set(guesses.map((one) => one!.id))];

  if (ids.length > 1) {
    return {
      id: here,
      rejected: `Those are ${ids.length} different kinds of file. Convert one kind at a time.`,
    };
  }

  return { id: ids[0] };
}
