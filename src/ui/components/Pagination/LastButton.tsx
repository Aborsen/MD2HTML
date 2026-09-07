import { ChevronsRight } from 'lucide-react';
import { NavButton } from './NavButton';

interface Props {
  isDisabled: boolean;
  onClick: () => void;
}

const LastButton = ({ onClick, isDisabled }: Props) => (
  <NavButton onClick={onClick} isDisabled={isDisabled} label="Last page">
    <ChevronsRight />
  </NavButton>
);

LastButton.displayName = 'LastButton';

export { LastButton };
