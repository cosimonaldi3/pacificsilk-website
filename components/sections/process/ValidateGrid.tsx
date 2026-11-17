import DefineBento, { type DefineBentoTile } from "./DefineBento";
import { CommsVisual, GoldenSampleVisual, LogisticsVisual, QuotationVisual, SupplierVisual } from "./validateVisuals";
import type { ValidateContent } from "@/content/process";

interface ValidateGridProps {
  content: ValidateContent;
}

/* Stage 2 in the same bento as Define (DefineBento owns the open/close overlay). The tiles
   follow the stage in order: find the supplier, talk to them, plan the route, approve the
   golden sample, and end on the binding quotation, which spans the full row. */
export default function ValidateGrid({ content }: ValidateGridProps) {
  const wide = "md:col-span-2";
  /* The top two rows share one small height on desktop: the tiles are sized to it, not the reverse */
  const row = "lg:h-[22rem]";

  const tiles: DefineBentoTile[] = [
    {
      key: "comms",
      copy: content.comms,
      glowAt: "100% 100%",
      className: `${wide} ${row}`,
      visual: <CommsVisual c={content.comms} />,
      visualLarge: <CommsVisual c={content.comms} large />,
    },
    {
      key: "suppliers",
      copy: content.suppliers,
      glowAt: "95% 10%",
      className: row,
      visual: <SupplierVisual c={content.suppliers} />,
      visualLarge: <SupplierVisual c={content.suppliers} large />,
    },
    {
      key: "logistics",
      copy: content.logistics,
      glowAt: "50% 100%",
      className: row,
      visual: <LogisticsVisual c={content.logistics} />,
      visualLarge: <LogisticsVisual c={content.logistics} large />,
    },
    {
      key: "sample",
      copy: content.sample,
      glowAt: "0% 100%",
      className: `${wide} ${row}`,
      visual: <GoldenSampleVisual />,
      visualLarge: <GoldenSampleVisual large />,
    },
    {
      key: "quote",
      copy: content.quote,
      glowAt: "100% 0%",
      className: `${wide} lg:col-span-3`,
      visual: <QuotationVisual c={content.quote} />,
      visualLarge: <QuotationVisual c={content.quote} large />,
    },
  ];

  return <DefineBento idBase="validate" tall tiles={tiles} expandLabel={content.expandLabel} closeLabel={content.closeLabel} />;
}
