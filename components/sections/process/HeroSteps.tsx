import type { ProcessStage } from "@/content/process";

interface HeroStepsProps {
  stages: ProcessStage[];
}

const v = (i: number) => ({ "--i": i }) as React.CSSProperties;

/* Four-stage sketch over the hero image: a line draws in, the dots pop up one by one,
   then a red dot keeps travelling the line. Decorative: the stages are described in full below. */
export default function HeroSteps({ stages }: HeroStepsProps) {
  return (
    <ol aria-label={stages.map((s) => s.name).join(", ")} className="relative mt-12 grid max-w-3xl grid-cols-4 md:mt-16">
      {/* Line runs between the centres of the first and last column */}
      <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[7px] h-px">
        <div className="pr-hero-line h-full w-full origin-left bg-psc-bg/60" />
        <span className="pr-hero-travel absolute -top-[3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-psc-red" />
      </div>

      {stages.map((s, i) => (
        <li key={s.name} className="relative flex flex-col items-center text-center" style={v(i)}>
          <span className="pr-hero-dot relative z-10 h-[15px] w-[15px] rounded-full border-2 border-psc-bg bg-psc-ink/40 backdrop-blur-sm" style={v(i)} />
          <span className="pr-hero-label mt-3 font-mono text-[11px] uppercase tracking-widest text-psc-bg/80 [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]" style={v(i)}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="pr-hero-label mt-1 font-display text-lg font-medium text-psc-bg [text-shadow:0_1px_10px_rgb(0_0_0/0.6)] md:text-2xl" style={v(i)}>
            {s.name}
          </span>
        </li>
      ))}
    </ol>
  );
}
