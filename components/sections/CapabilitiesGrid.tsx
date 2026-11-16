import Container from "@/components/ui/Container";
import CapabilityTile from "@/components/sections/capabilities/CapabilityTile";
import MiniGlobe from "@/components/sections/capabilities/MiniGlobe";
import {
  PaperworkVisual,
  QualityVisual,
  TrackingVisual,
  VerifyVisual,
} from "@/components/sections/capabilities/visuals";
import type { CapabilitiesContent } from "@/content/capabilities";
import "@/components/sections/capabilities/capabilities.css";

interface CapabilitiesGridProps {
  content: CapabilitiesContent;
}

/* Stripe-inspired bento grid: one wide + one narrow tile, then three equal tiles.
   Stacks to one column on mobile, two on tablet. */
export default function CapabilitiesGrid({ content }: CapabilitiesGridProps) {
  const shared = { expandLabel: content.expandLabel, closeLabel: content.closeLabel };

  return (
    <section aria-labelledby="capabilities-heading" className="bg-psc-muted py-24 md:py-32">
      <Container>
        <p className="mb-4 font-sans text-small uppercase tracking-widest text-psc-gray">{content.label}</p>
        <h2 id="capabilities-heading" className="mb-12 max-w-2xl font-display text-h2 font-medium leading-tight text-psc-ink md:mb-16">
          {content.headline}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <CapabilityTile tile={content.verify} {...shared} glowAt="95% 10%" className="md:col-span-2 lg:min-h-[28rem]">
            <VerifyVisual c={content.verify} />
          </CapabilityTile>
          <CapabilityTile tile={content.quality} {...shared} glowAt="100% 100%" className="lg:min-h-[28rem]">
            <QualityVisual c={content.quality} />
          </CapabilityTile>
          <CapabilityTile tile={content.movement} {...shared} glowAt="50% 100%">
            <MiniGlobe c={content.movement} />
          </CapabilityTile>
          <CapabilityTile tile={content.paperwork} {...shared} glowAt="0% 100%">
            <PaperworkVisual c={content.paperwork} />
          </CapabilityTile>
          <CapabilityTile tile={content.tracking} {...shared} glowAt="100% 0%" className="md:col-span-2 lg:col-span-1">
            <TrackingVisual c={content.tracking} />
          </CapabilityTile>
        </div>
      </Container>
    </section>
  );
}
