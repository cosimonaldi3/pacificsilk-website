import Container from "@/components/ui/Container";
import DefineGrid from "./DefineGrid";
import type { ProcessPageContent } from "@/content/process";

interface ProcessExplorerProps {
  detail: ProcessPageContent["detail"];
  stages: ProcessPageContent["stages"];
  define: ProcessPageContent["define"];
}

const num = (i: number) => String(i + 1).padStart(2, "0");
const v = (i: number) => ({ "--i": i }) as React.CSSProperties;
const glow = (at: string) => ({
  background: `radial-gradient(circle at ${at}, color-mix(in srgb, var(--color-psc-red) 14%, transparent), transparent 60%)`,
});

/* Stage detail: all four stages stacked one under the other, scroll to read them.
   Each stage has four cards: who does what, what you get, what you decide. */
export default function ProcessExplorer({ detail, stages, define }: ProcessExplorerProps) {
  return (
    <section aria-labelledby="stage-detail-heading" className="bg-psc-bg py-16 md:py-20">
      <Container>
        <p id="stage-detail-heading" className="mb-10 font-sans text-small uppercase tracking-widest text-psc-gray">
          {detail.label}
        </p>

        <ol className="space-y-14 md:space-y-16">
          {stages.map((stage, i) => (
            <li key={stage.name} id={`stage-${i + 1}`} className="scroll-mt-24">
              <h2 className="font-display text-h2 font-medium leading-tight text-psc-ink">
                <span className="mr-3 font-mono text-base text-psc-red">{num(i)}</span>
                {stage.name}
              </h2>
              <p className="mb-6 mt-1 font-sans text-body text-psc-gray">{stage.span}</p>

              {/* Stage 1 uses the capabilities-grid style; the others keep the four cards */}
              {i === 0 ? (
                <>
                  <p className="mb-6 font-sans text-body leading-body text-psc-gray">{define.intro}</p>
                  <DefineGrid content={define} decide={{ label: detail.cards.youDecide, text: stage.youDecide }} />
                </>
              ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                {[
                  { label: detail.cards.local, text: stage.local, glyph: <ChatGlyph />, at: "0% 0%" },
                  { label: detail.cards.china, text: stage.china, glyph: <ChinaGlyph />, at: "100% 0%" },
                  { label: detail.cards.youGet, text: stage.youGet, glyph: <ChecklistGlyph />, at: "0% 100%" },
                  { label: detail.cards.youDecide, text: stage.youDecide, glyph: <DecideGlyph />, at: "100% 100%", dark: true },
                ].map((c) => (
                  <article
                    key={c.label}
                    className={`group relative overflow-hidden rounded-2xl border p-6 ${
                      c.dark ? "border-psc-ink bg-psc-ink" : "border-psc-border bg-psc-bg"
                    }`}
                  >
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" style={glow(c.at)} />
                    <div className="relative mb-5 flex h-12 items-center">{c.glyph}</div>
                    <h3 className={`relative mb-2 font-mono text-[12px] uppercase tracking-widest ${c.dark ? "text-psc-red" : "text-psc-gray"}`}>{c.label}</h3>
                    <p className={`relative font-sans text-body leading-body ${c.dark ? "text-psc-bg" : "text-psc-ink"}`}>{c.text}</p>
                  </article>
                ))}
              </div>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ---------- Small looping glyphs (home.css / capabilities.css classes) ---------- */

function ChatGlyph() {
  return (
    <div className="flex items-end gap-1.5" aria-hidden="true">
      <span className="rounded-2xl rounded-bl-sm bg-psc-muted px-3 py-2">
        <span className="hm-typing flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} style={v(i)} className="h-1.5 w-1.5 rounded-full bg-psc-ink" />
          ))}
        </span>
      </span>
      <span className="mb-1 h-2 w-2 rounded-full bg-psc-red" />
    </div>
  );
}

function ChinaGlyph() {
  return (
    <div className="relative h-11 w-11 font-display text-3xl leading-none text-psc-ink" aria-hidden="true">
      <span lang="zh" className="hm-swap-a absolute inset-0 flex items-center justify-center rounded-lg bg-psc-muted">工</span>
      <span className="hm-swap-b absolute inset-0 flex items-center justify-center rounded-lg bg-psc-muted text-psc-red">✓</span>
    </div>
  );
}

function ChecklistGlyph() {
  return (
    <ul className="space-y-1" aria-hidden="true">
      {[56, 40, 48].map((w, i) => (
        <li key={i} className="cap-check flex items-center gap-2" style={v(i)}>
          <span className="cap-check-mark h-2.5 w-2.5 rounded-full bg-psc-red" />
          <span className="h-1.5 rounded-full bg-psc-border" style={{ width: w }} />
        </li>
      ))}
    </ul>
  );
}

function DecideGlyph() {
  return (
    <span className="cap-pulse inline-flex h-10 w-10 items-center justify-center rounded-full bg-psc-red text-psc-bg" aria-hidden="true">
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
    </span>
  );
}
