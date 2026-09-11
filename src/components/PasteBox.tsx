import { ClipboardPaste, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useT } from '@/lib/i18n/context';
import { Button } from '@/ui/components/Button';
import { Typography } from '@/ui/components/Typography';

/*
 * The other way in: text from the clipboard rather than a file from the disk.
 *
 * Everything here used to need a file, which is an awkward thing to ask of somebody who has the
 * Markdown in their clipboard and no reason to save it first. The text is handed to the same
 * `onFiles` the dropzone calls — synthesised into a file with this conversion's own extension — so
 * the conversion, the size limit, the preview, the download, the save and the history are the ones
 * that already work rather than a second path that looks the same and drifts.
 *
 * Closed by default. An open textarea under the dropzone makes the front page read as two things
 * competing for the same job; the button says the other way exists and gets out of the way.
 */
export function PasteBox({
  isBusy = false,
  extension,
  onText,
  onGoToLivePreview,
}: {
  isBusy?: boolean;
  /** This conversion's first extension, with the dot: what the pasted text is called. */
  extension: string;
  onText: (text: string) => void;
  /** Offered only where it is the better tool: Markdown, and only once the box is open. */
  onGoToLivePreview?: () => void;
}) {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) {
    return (
      <div className="flex justify-center">
        <Button
          variant="tertiary"
          size="sm"
          leftSlot={<ClipboardPaste />}
          onClick={() => {
            setIsOpen(true);
            // The point of the button is the textarea, so it takes the caret with it.
            requestAnimationFrame(() => field.current?.focus());
          }}
        >
          {t('converter.paste.open', { extension })}
        </Button>
      </div>
    );
  }

  const ready = text.trim().length > 0;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-card p-4 md:p-5">
      <div className="flex items-center justify-between gap-2">
        <Typography variant="span" weight="bold" className="text-sm">
          {t('converter.paste.label', { extension })}
        </Typography>

        <Button
          variant="tertiary"
          size="sm"
          leftSlot={<X />}
          onClick={() => setIsOpen(false)}
        >
          {t('converter.paste.close')}
        </Button>
      </div>

      {/*
       * A plain textarea, monospaced. Anything cleverer here would be an editor, and an editor with
       * no preview beside it is the worst of both: `/markdown-live-preview` is where typing belongs.
       */}
      <textarea
        ref={field}
        value={text}
        onChange={(event) => setText(event.target.value)}
        spellCheck={false}
        placeholder={t('converter.paste.placeholder')}
        aria-label={t('converter.paste.label', { extension })}
        className="min-h-48 w-full resize-y rounded-lg border border-stroke bg-surface-page p-3 font-mono text-compact text-ink-body outline-none focus-visible:border-brand-primary"
      />

      <div className="flex flex-wrap items-center justify-end gap-2">
        {/*
         * A count, because the limit is real and a person pasting a book should find that out here
         * rather than from a refusal. `handleFiles` still checks the bytes — this is a courtesy,
         * not the gate.
         */}
        <Typography variant="span" textColor="light" className="mr-auto text-xs tabular-nums">
          {t('converter.paste.count', { count: String(text.length) })}
        </Typography>

        {/*
         * Somebody typing into this box wants the other page and does not know it exists. Said
         * here rather than on the page above, because this is the moment the want appears.
         */}
        {onGoToLivePreview && (
          <Button variant="tertiary" size="sm" onClick={onGoToLivePreview}>
            {t('converter.paste.live')}
          </Button>
        )}

        <Button
          variant="primary"
          size="md"
          disabled={!ready || isBusy}
          onClick={() => {
            onText(text);
            setIsOpen(false);
          }}
        >
          {t('converter.paste.convert')}
        </Button>
      </div>
    </div>
  );
}
