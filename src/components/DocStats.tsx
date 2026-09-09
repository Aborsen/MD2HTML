import { useT } from '@/lib/i18n/context';
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

/*
 * Which counts are shown, in this order, and the catalogue keys for the noun beside each.
 *
 * Two keys per row because a count of one reads differently from a count of many, and the number
 * is a separate element on the line — it is set in a heavier weight — so the word is translated on
 * its own rather than as part of a sentence.
 */
const LABELS: Array<[keyof Stats, string, string]> = [
  ['words', 'converter.stats.word', 'converter.stats.words'],
  ['headings', 'converter.stats.heading', 'converter.stats.headings'],
  ['tables', 'converter.stats.table', 'converter.stats.tables'],
  ['codeBlocks', 'converter.stats.codeblock', 'converter.stats.codeblocks'],
  ['links', 'converter.stats.link', 'converter.stats.links'],
  ['images', 'converter.stats.image', 'converter.stats.images'],
];

export function DocStats({ stats }: DocStatsProps) {
  const t = useT();

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
          {stats[key] === 1 ? t(one) : t(many)}
        </Typography>
      ))}
    </div>
  );
}
