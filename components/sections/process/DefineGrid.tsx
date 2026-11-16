import CapabilityTile from "@/components/sections/capabilities/CapabilityTile";
import MiniGlobe from "@/components/sections/capabilities/MiniGlobe";
import { GrowthVisual } from "@/components/sections/home/journeyVisuals";
import { CostVisual, InsightVisual, OpportunityVisual, TripPlan } from "./defineVisuals";
import type { DefineContent } from "@/content/process";

interface DefineGridProps {
  content: DefineContent;
  decide: { label: string; text: string };
}

/* Stage 1 in the capabilities-grid style: tiles of different sizes depending on their content,
   plus the dark "You decide" box on the right. Three columns on large screens, one column on phones
   (the decision box goes last there). */
export default function DefineGrid({ content, decide }: DefineGridProps) {
  const shared = { expandLabel: content.expandLabel, closeLabel: content.closeLabel };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      <CapabilityTile tile={content.insight} {...shared} glowAt="95% 10%" className="md:col-span-2">
        <InsightVisual c={content.insight} />
      </CapabilityTile>

      {/* You decide: spans two rows on the right */}
      <article className="group relative order-last flex min-h-[14rem] flex-col justify-end overflow-hidden rounded-2xl border border-psc-ink bg-psc-ink p-6 md:col-span-2 md:p-8 lg:order-none lg:col-span-1 lg:row-span-2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--color-psc-red) 28%, transparent), transparent 60%)" }}
        />
        <span className="cap-pulse absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-psc-red text-psc-bg md:left-8 md:top-8" aria-hidden="true">
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        </span>
        <h4 className="relative mb-2 font-mono text-[12px] uppercase tracking-widest text-psc-red">{decide.label}</h4>
        <p className="relative font-display text-h3 font-medium leading-snug text-psc-bg">{decide.text}</p>
      </article>

      <CapabilityTile tile={content.opportunity} {...shared} glowAt="100% 100%">
        <OpportunityVisual c={content.opportunity} />
      </CapabilityTile>

      <CapabilityTile tile={content.cost} {...shared} glowAt="0% 100%">
        <CostVisual c={content.cost} />
      </CapabilityTile>

      <CapabilityTile tile={content.growth} {...shared} glowAt="100% 0%">
        <div className="px-6 pb-6">
          <GrowthVisual c={content.growth} />
        </div>
      </CapabilityTile>

      <CapabilityTile tile={content.trip} {...shared} glowAt="90% 90%" className="md:col-span-2">
        <div className="flex h-full flex-col items-center gap-2 px-6 pb-4 md:flex-row md:items-end md:px-8">
          <TripPlan c={content.trip} />
          <div className="w-full min-w-0 flex-1">
            <MiniGlobe c={content.trip.globe} reverse />
          </div>
        </div>
      </CapabilityTile>
    </div>
  );
}
