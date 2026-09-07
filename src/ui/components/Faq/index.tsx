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
 * One question is open on arrival: a page of collapsed headings tells a first-time reader nothing,
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
      className={cn(
        'overflow-hidden rounded-lg border border-stroke bg-surface-card',
        className
      )}
    >
      {items.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger className="rounded-none px-4 text-left">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-ink-body text-sm leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
