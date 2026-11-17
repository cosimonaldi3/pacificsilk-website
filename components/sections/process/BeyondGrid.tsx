import DefineBento, { type DefineBentoTile } from "./DefineBento";
import { RecurringVisual, FairVisual, NetworkVisual, EntryOptionsVisual } from "./beyondVisuals";
import type { BeyondContent } from "@/content/process";

interface BeyondGridProps {
  content: BeyondContent;
}

/* Stage 4 in the same bento as Define, Validate and Execute. The repeat order comes first and
   wide: it is the most important pillar. Wide and narrow tiles alternate row by row. */
export default function BeyondGrid({ content }: BeyondGridProps) {
  const wide = "md:col-span-2";
  const row = "lg:h-[22rem]";

  const tiles: DefineBentoTile[] = [
    {
      key: "recurring",
      copy: content.recurring,
      glowAt: "95% 10%",
      className: `${wide} ${row}`,
      visual: <RecurringVisual c={content.recurring} />,
      visualLarge: <RecurringVisual c={content.recurring} large />,
    },
    {
      key: "fairs",
      copy: content.fairs,
      glowAt: "100% 100%",
      className: row,
      visual: <FairVisual c={content.fairs} />,
      visualLarge: <FairVisual c={content.fairs} large />,
    },
    {
      key: "options",
      copy: content.options,
      glowAt: "0% 100%",
      className: row,
      visual: <EntryOptionsVisual c={content.options} />,
      visualLarge: <EntryOptionsVisual c={content.options} large />,
    },
    {
      key: "network",
      copy: content.network,
      glowAt: "100% 0%",
      className: `${wide} ${row}`,
      visual: <NetworkVisual c={content.network} />,
      visualLarge: <NetworkVisual c={content.network} large />,
    },
  ];

  return <DefineBento idBase="beyond" tall tiles={tiles} expandLabel={content.expandLabel} closeLabel={content.closeLabel} />;
}
