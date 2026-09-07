import { ChevronsLeft } from 'lucide-react';
import { NavButton } from './NavButton';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
}

const FirstButton = ({ onClick, isDisabled }: Props) => (
  <NavButton onClick={onClick} isDisabled={isDisabled} label="First page">
    <ChevronsLeft />
  </NavButton>
);

FirstButton.displayName = 'FirstButton';

export { FirstButton };
