import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../Accordion';

export interface FaqEntry {
  question: string;
  answer: ReactNode;
}

interface FaqProps {
  items: FaqEntry[];
  /** Which question starts open. The first one, unless a page has a better idea. */
  defaultOpen?: string;
  className?: string;
}

/**
 * Questions and answers, over the kit's accordion.
 *
 * A card per question with air between them, rather than one bordered list: a list of nine rows
 * reads as a table of contents, and the point here is that each question is a thing you can open.
 * The open one takes the accent border so the answer is visibly attached to its question.
 *
 * One question is open on arrival — a page of collapsed headings tells a first-time reader nothing,
 * and the answer to the first question is usually the one they came with.
 */
export function Faq({ items, defaultOpen, className }: FaqProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ?? items[0].question}
      className={cn('flex w-full flex-col gap-2.5', className)}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.question}
          value={item.question}
          className={cn(
            'overflow-hidden rounded-xl border border-stroke bg-surface-card transition-colors',
            'not-last:border-b hover:border-stroke-hover',
            'data-[state=open]:border-brand-primary/40 data-[state=open]:bg-surface-accent/50'
          )}
        >
          <AccordionTrigger
            className={cn(
              'rounded-none px-4 py-3.5 text-left',
              'focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-inset',
              'data-[state=open]:text-ink-highlight'
            )}
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-0 pb-4 text-ink-body text-sm leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
