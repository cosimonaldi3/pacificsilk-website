import DefineBento, { type DefineBentoTile } from "./DefineBento";
import { QualityCompactVisual, SupportVisual, IssuesVisual, ServicesVisual } from "./executeVisuals";
import { PaperworkVisual, QualityVisual, TrackingVisual } from "@/components/sections/capabilities/visuals";
import type { ExecuteContent } from "@/content/process";

interface ExecuteGridProps {
  content: ExecuteContent;
}

/* The capability visuals have no large size: in the opened card they sit in a wider frame */
function Wide({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[32rem]">{children}</div>;
}

/* Stage 3 in the same bento as Define and Validate. Tracking, quality and paperwork are the
   capability tiles, reused; Incoterms, the add-on logistics services and issue handling are
   new. Wide and narrow tiles alternate row by row. */
export default function ExecuteGrid({ content }: ExecuteGridProps) {
  const wide = "md:col-span-2";
  /* Every tile is the same small height on desktop, as in Validate: the tiles are sized to it */
  const row = "lg:h-[22rem]";

  const tiles: DefineBentoTile[] = [
    {
      key: "tracking",
      copy: content.tracking,
      glowAt: "95% 10%",
      className: `${wide} ${row}`,
      visual: <TrackingVisual c={content.tracking} />,
      visualLarge: <Wide><TrackingVisual c={content.tracking} /></Wide>,
    },
    {
      key: "quality",
      copy: content.quality,
      glowAt: "100% 100%",
      className: row,
      visual: <QualityCompactVisual c={content.quality} />,
      visualLarge: <Wide><QualityVisual c={content.quality} /></Wide>,
    },
    {
      key: "paperwork",
      copy: content.paperwork,
      glowAt: "0% 100%",
      className: row,
      visual: <div className="px-6 pb-6"><PaperworkVisual c={content.paperwork} /></div>,
      visualLarge: <Wide><PaperworkVisual c={content.paperwork} /></Wide>,
    },
    {
      key: "support",
      copy: content.support,
      glowAt: "100% 0%",
      className: `${wide} ${row}`,
      visual: <SupportVisual c={content.support} />,
      visualLarge: <SupportVisual c={content.support} large />,
    },
    {
      key: "services",
      copy: content.services,
      glowAt: "0% 0%",
      className: `${wide} ${row}`,
      visual: <ServicesVisual c={content.services} />,
      visualLarge: <ServicesVisual c={content.services} large />,
    },
    {
      key: "issues",
      copy: content.issues,
      glowAt: "100% 100%",
      className: row,
      visual: <IssuesVisual c={content.issues} />,
      visualLarge: <IssuesVisual c={content.issues} large />,
    },
  ];

  return <DefineBento idBase="execute" tall tiles={tiles} expandLabel={content.expandLabel} closeLabel={content.closeLabel} />;
}
