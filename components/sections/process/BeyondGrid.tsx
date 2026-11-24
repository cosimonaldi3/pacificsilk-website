import DefineBento, { type DefineBentoTile } from "./DefineBento";
import { RecurringVisual, FairVisual, EntryOptionsVisual } from "./beyondVisuals";
import type { BeyondContent } from "@/content/process";

interface BeyondGridProps {
  content: BeyondContent;
}

/* Stage 4: three tiles in one row, under the stage's plus/minus. The network block is rendered
   by ProcessExplorer as the stage footer, so it stays visible when these tiles are folded away. */
export default function BeyondGrid({ content }: BeyondGridProps) {
  const row = "lg:h-[22rem]";

  const tiles: DefineBentoTile[] = [
    {
      key: "recurring",
      copy: content.recurring,
      glowAt: "95% 10%",
      className: row,
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
  ];

  return <DefineBento idBase="beyond" tall tiles={tiles} expandLabel={content.expandLabel} closeLabel={content.closeLabel} />;
}
