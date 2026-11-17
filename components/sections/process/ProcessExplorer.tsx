import Container from "@/components/ui/Container";
import DefineGrid from "./DefineGrid";
import ValidateGrid from "./ValidateGrid";
import ExecuteGrid from "./ExecuteGrid";
import BeyondGrid from "./BeyondGrid";
import BeyondNetwork from "./BeyondNetwork";
import StageGroup from "./StageGroup";
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

/* Stage detail: all four stages stacked one under the other. Each stage's bento of live tiles
   folds open and shut with its own plus/minus, so the page stays short until a stage is wanted. */
export default function ProcessExplorer({ detail, stages, define, validate, execute, beyond }: ProcessExplorerProps) {
  return (
    <section aria-labelledby="stage-detail-heading" className="bg-psc-bg py-16 md:py-20">
      <Container>
        <p id="stage-detail-heading" className="mb-10 font-sans text-small uppercase tracking-widest text-psc-gray">
          {detail.label}
        </p>

        <ol className="space-y-14 md:space-y-16">
          {stages.map((stage, i) => (
            <StageGroup
              key={stage.name}
              index={i + 1}
              number={num(i)}
              name={stage.name}
              span={stage.span}
              showLabel={detail.showStage}
              hideLabel={detail.hideStage}
              /* Beyond's network sits under the toggled tiles, always visible */
              footer={i === 3 ? <BeyondNetwork content={beyond.network} /> : undefined}
            >
              {i === 0 ? (
                <DefineGrid content={define} />
              ) : i === 1 ? (
                <ValidateGrid content={validate} />
              ) : i === 2 ? (
                <ExecuteGrid content={execute} />
              ) : (
                <BeyondGrid content={beyond} />
              )}
            </StageGroup>
          ))}
        </ol>
      </Container>
    </section>
  );
}
