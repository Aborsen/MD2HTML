import { Button } from '../Button';

interface Props {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

const PageButton = ({ page, isActive, onClick }: Props) => (
  <Button
    type="button"
    variant={isActive ? 'primary' : 'secondary'}
    size="sm"
    rounded="md"
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    className="size-8 px-0"
  >
    {page}
  </Button>
);

PageButton.displayName = 'PageButton';

export { PageButton };
