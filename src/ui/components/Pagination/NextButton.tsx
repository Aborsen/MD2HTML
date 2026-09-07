import { ChevronRight } from 'lucide-react';
import { NavButton } from './NavButton';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
}

const NextButton = ({ onClick, isDisabled }: Props) => (
  <NavButton onClick={onClick} isDisabled={isDisabled} label="Next page">
    <ChevronRight />
  </NavButton>
);

NextButton.displayName = 'NextButton';

export { NextButton };
