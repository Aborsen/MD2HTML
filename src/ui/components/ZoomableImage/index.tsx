'use client';

import { Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Modal, ModalContent } from '../Modal';
import { Typography } from '../Typography';

interface ZoomableImageProps {
  src: string;
  alt: string;
  /** Shown under the image and again in the enlarged view, where it is the only label. */
  caption?: string;
  /** Extra classes for the inline image, not the enlarged one. */
  className?: string;
}

/**
 * An image that opens at full size when you click it.
 *
 * Screenshots in the documentation are captured at 2560 by 1600 and shown at a third of that, which
 * makes them illustrations of the shape of a screen rather than pictures you can read. The text in
 * them — a button's label, a badge, the format menu — is the part somebody is looking for when they
 * came to the documentation, and at that scale it is a smudge.
 *
 * The trigger is a button rather than a link to the file: a link opens a bare image in a tab with
 * the page lost behind it, and this keeps the caption, closes on Escape, and returns you where you
 * were. The magnifier appears on hover and on keyboard focus, because an image that does something
 * when clicked has to say so.
 */
export function ZoomableImage({
  src,
  alt,
  caption,
  className,
}: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Enlarge: ${alt}`}
        className={cn(
          'group relative block w-full cursor-zoom-in overflow-hidden rounded-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2'
        )}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn(
            'w-full rounded-lg border border-stroke bg-surface-card transition-opacity',
            'group-hover:opacity-90',
            className
          )}
        />

        <span
          aria-hidden
          className={cn(
            'absolute top-2 right-2 flex size-7 items-center justify-center rounded-md',
            'border border-stroke bg-surface-card/90 text-ink-secondary backdrop-blur',
            'opacity-0 transition-opacity',
            'group-hover:opacity-100 group-focus-visible:opacity-100'
          )}
        >
          <Maximize2 className="size-3.5" />
        </span>
      </button>

      <Modal open={isOpen} onOpenChange={setIsOpen}>
        {/*
          * Wider than the default modal and sized to the picture: an enlarged screenshot that is
          * still capped at a reading column has not been enlarged.
          */}
        <ModalContent
          aria-label={alt}
          className="max-w-[min(90rem,96vw)] gap-3 p-3 sm:p-4"
        >
          {/*
            * The box scrolls, and below `lg` the picture is allowed to be wider than it.
            *
            * The threshold is `lg` and not `sm` because of what the numbers do. A dialog can be
            * 96vw at most, and the documentation column it was clicked from is 768px wide: at a
            * tablet's 768px the dialog is 737px, so capping the image inside it made the enlarged
            * picture *smaller* than the one on the page — 701px against 720px. Below `lg` the image
            * is sized to the height instead, which makes it wider than the screen, and this box
            * pans. From `lg` up there is genuinely more room, so `max-w-full` brings it back inside
            * and the reader gets a picture that fits rather than one to drag around.
            */}
          <div className="overflow-auto rounded-md border border-stroke bg-surface-card">
            <img
              src={src}
              alt={alt}
              className="h-auto max-h-[82dvh] w-auto max-w-none object-contain lg:max-w-full"
            />
          </div>

          {caption && (
            <Typography variant="p" textColor="secondary" className="text-xs">
              {caption}
            </Typography>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
