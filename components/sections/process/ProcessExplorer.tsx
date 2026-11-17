import Container from "@/components/ui/Container";
import DefineGrid from "./DefineGrid";
import ValidateGrid from "./ValidateGrid";
import ExecuteGrid from "./ExecuteGrid";
import BeyondGrid from "./BeyondGrid";
import type { ProcessPageContent } from "@/content/process";

interface ProcessExplorerProps {
  detail: ProcessPageContent["detail"];
  stages: ProcessPageContent["stages"];
  define: ProcessPageContent["define"];
  validate: ProcessPageContent["validate"];
  execute: ProcessPageContent["execute"];
  beyond: ProcessPageContent["beyond"];
}

const num = (i: number) => String(i + 1).padStart(2, "0");

/* Stage detail: all four stages stacked one under the other, scroll to read them.
   Each stage is a bento of live tiles. */
export default function ProcessExplorer({ detail, stages, define, validate, execute, beyond }: ProcessExplorerProps) {
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

              {i === 0 ? (
                <DefineGrid content={define} />
              ) : i === 1 ? (
                <ValidateGrid content={validate} />
              ) : i === 2 ? (
                <ExecuteGrid content={execute} />
              ) : (
                <BeyondGrid content={beyond} />
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
