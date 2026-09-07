import { Ellipsis } from 'lucide-react';

const EllipsisIndicator = () => (
  <span
    aria-hidden
    className="flex size-8 cursor-default items-center justify-center text-ink-inactive [&_svg]:size-4"
  >
    <Ellipsis />
  </span>
);

EllipsisIndicator.displayName = 'EllipsisIndicator';

export { EllipsisIndicator };
