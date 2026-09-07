import { Typography } from '@/ui/components/Typography';

type Stats = {
  words: number;
  headings: number;
  links: number;
  codeBlocks: number;
  tables: number;
  images: number;
};

interface DocStatsProps {
  stats: Stats;
}

const LABELS: Array<[keyof Stats, string, string]> = [
  ['words', 'word', 'words'],
  ['headings', 'heading', 'headings'],
  ['tables', 'table', 'tables'],
  ['codeBlocks', 'code block', 'code blocks'],
  ['links', 'link', 'links'],
  ['images', 'image', 'images'],
];

export function DocStats({ stats }: DocStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {LABELS.filter(([key]) => stats[key] > 0).map(([key, one, many]) => (
        <Typography
          key={key}
          variant="span"
          textColor="secondary"
          className="text-xs"
        >
          <span className="font-semibold text-ink-body">{stats[key]}</span>{' '}
          {stats[key] === 1 ? one : many}
        </Typography>
      ))}
    </div>
  );
}
