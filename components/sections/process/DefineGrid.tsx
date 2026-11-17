import DefineBento, { type DefineBentoTile } from "./DefineBento";
import SplitFlapBoard from "./SplitFlapBoard";
import { CostVisual, InsightVisual, OpportunityVisual } from "./defineVisuals";
import type { DefineContent } from "@/content/process";

interface DefineGridProps {
  content: DefineContent;
}

/* Stage 1 in the capabilities-grid style: a bento of four live tiles, wide and narrow in turn.
   The visuals render here on the server (the China map stays out of the client bundle) and are
   handed to DefineBento, which owns the open/close state. Each visual is passed twice: at tile
   size, and larger for the overlay that covers the grid when a tile is opened. */
export default function DefineGrid({ content }: DefineGridProps) {
  const wide = "md:col-span-2";

  const tiles: DefineBentoTile[] = [
    {
      key: "insight",
      copy: content.insight,
      glowAt: "95% 10%",
      className: wide,
      visual: <InsightVisual c={content.insight} />,
      visualLarge: <InsightVisual c={content.insight} large />,
    },
    {
      key: "opportunity",
      copy: content.opportunity,
      glowAt: "100% 100%",
      visual: <OpportunityVisual c={content.opportunity} />,
      visualLarge: <OpportunityVisual c={content.opportunity} large />,
    },
    {
      key: "trip",
      copy: content.trip,
      glowAt: "90% 90%",
      visual: (
        <div className="flex justify-center px-6 pb-6">
          <SplitFlapBoard c={content.trip.board} />
        </div>
      ),
      visualLarge: (
        <div className="pd-large flex justify-center">
          <SplitFlapBoard c={content.trip.board} />
        </div>
      ),
    },
    {
      key: "cost",
      copy: content.cost,
      glowAt: "0% 100%",
      className: wide,
      visual: <CostVisual c={content.cost} />,
      visualLarge: <CostVisual c={content.cost} large />,
    },
  ];

  return <DefineBento idBase="define" tiles={tiles} expandLabel={content.expandLabel} closeLabel={content.closeLabel} />;
}
