import type { MouseEventHandler, PropsWithChildren } from 'react';
import { IconButton } from '../IconButton';

interface Props {
  label: string;
  isDisabled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const NavButton = ({
  isDisabled,
  label,
  children,
  onClick,
}: PropsWithChildren<Props>) => (
  <IconButton
    type="button"
    variant="secondary"
    size="sm"
    rounded="md"
    onClick={onClick}
    disabled={isDisabled}
    aria-label={label}
  >
    {children}
  </IconButton>
);

NavButton.displayName = 'NavButton';

export { NavButton };
