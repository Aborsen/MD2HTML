import { ChevronLeft } from 'lucide-react';
import { NavButton } from './NavButton';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
}

const PrevButton = ({ isDisabled, onClick }: Props) => (
  <NavButton onClick={onClick} isDisabled={isDisabled} label="Previous page">
    <ChevronLeft />
  </NavButton>
);

PrevButton.displayName = 'PrevButton';

export { PrevButton };
