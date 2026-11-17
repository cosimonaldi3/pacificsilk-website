import type { BuilderContent } from "@/content/home";

export interface GuidedAnswers {
  type: string | null;
  today: string | null;
  dest: string;
  worries: string[];
}

export interface Blueprint {
  /* Service ids, in recommendation order, no duplicates */
  services: string[];
  /* 0–100: one quarter per answered question */
  progress: number;
}

/* Pure: answers + the editable mapping in content → recommended services. */
export function buildBlueprint(answers: GuidedAnswers, config: BuilderContent): Blueprint {
  const out: string[] = [];
  const add = (ids: string[] | undefined) => ids?.forEach((id) => !out.includes(id) && out.push(id));

  const answered = [
    answers.type !== null,
    answers.today !== null,
    answers.dest.trim().length > 0,
    answers.worries.length > 0,
  ].filter(Boolean).length;

  /* Always shown, so the free definition is visible before the visitor clicks anything */
  add([config.firstService]);
  if (answers.type) add(config.map.type[answers.type]);
  if (answers.today) add(config.map.today[answers.today]);
  answers.worries.forEach((w) => add(config.map.worry[w]));

  return { services: out, progress: answered * 25 };
}
