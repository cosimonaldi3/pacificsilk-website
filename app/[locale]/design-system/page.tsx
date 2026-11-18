import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Design System — PS Internal",
  description: "Internal design system reference for typography and color tokens.",
  robots: { index: false, follow: false },
};

const swatches = [
  { token: "psc-bg", hex: "#FAFAF7", bg: "bg-psc-bg", border: true },
  { token: "psc-ink", hex: "#0A0A0A", bg: "bg-psc-ink", border: false },
  { token: "psc-gray", hex: "#6B6B6B", bg: "bg-psc-gray", border: false },
  { token: "psc-muted", hex: "#EFECE4", bg: "bg-psc-muted", border: false },
  { token: "psc-red", hex: "#E71F1F", bg: "bg-psc-red", border: false },
  { token: "psc-border", hex: "#E5E3DC", bg: "bg-psc-border", border: false },
];

export default function DesignSystemPage() {
  return (
    <main className="bg-psc-bg min-h-screen py-24">
      <Container>
        <h1 className="font-sans text-small text-psc-gray uppercase tracking-widest mb-16">
          PS Design System — Internal Reference
        </h1>

        {/* Section 1: Typography */}
        <section className="mb-24">
          <h2 className="font-sans text-small text-psc-gray mb-10 border-b border-psc-border pb-3">
            Typography
          </h2>

          <div className="space-y-12">
            <div className="flex items-start gap-8">
              <span className="font-sans text-small text-psc-gray w-16 shrink-0 pt-2">
                Display
              </span>
              <p className="font-display text-display leading-display font-medium text-psc-ink">
                The Modern Silk Road
              </p>
            </div>

            <div className="flex items-start gap-8">
              <span className="font-sans text-small text-psc-gray w-16 shrink-0 pt-2">
                H1
              </span>
              <p className="font-display text-h1 leading-tight font-medium text-psc-ink">
                We get your product made in China.
              </p>
            </div>

            <div className="flex items-start gap-8">
              <span className="font-sans text-small text-psc-gray w-16 shrink-0 pt-1">
                H2
              </span>
              <p className="font-display text-h2 font-medium text-psc-ink">
                One contract. Three companies.
              </p>
            </div>

            <div className="flex items-start gap-8">
              <span className="font-sans text-small text-psc-gray w-16 shrink-0 pt-1">
                H3
              </span>
              <p className="font-display text-h3 font-medium text-psc-ink">
                Sourcing &amp; Supplier Management
              </p>
            </div>

            <div className="flex items-start gap-8">
              <span className="font-sans text-small text-psc-gray w-16 shrink-0 pt-1">
                Body
              </span>
              <p className="font-sans text-body leading-body text-psc-ink max-w-2xl">
                PS and the Pacific Silk Alliance give international companies
                privileged access to China&apos;s sourcing, production, and logistics
                infrastructure.
              </p>
            </div>

            <div className="flex items-start gap-8">
              <span className="font-sans text-small text-psc-gray w-16 shrink-0 pt-0.5">
                Small
              </span>
              <p className="font-sans text-small text-psc-gray">
                Updated April 2026 · Internal reference
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Color swatches */}
        <section>
          <h2 className="font-sans text-small text-psc-gray mb-10 border-b border-psc-border pb-3">
            Colors
          </h2>

          <div className="flex flex-wrap gap-6">
            {swatches.map(({ token, hex, bg, border }) => (
              <div key={token} className="flex flex-col gap-2 w-28">
                <div
                  className={`h-20 rounded-sm ${bg} ${border ? "border border-psc-border" : ""}`}
                />
                <span className="font-sans text-small text-psc-ink">{token}</span>
                <span className="font-sans text-small text-psc-gray">{hex}</span>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
