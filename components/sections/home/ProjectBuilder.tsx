"use client";

import { useId, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import type { BuilderContent, BuilderOption } from "@/content/home";
import { buildBlueprint, type GuidedAnswers } from "@/lib/home/blueprint";

interface ProjectBuilderProps {
  content: BuilderContent;
}

type Mode = "guided" | "manual";

/* Two ways in: answer four questions (guided) or pick services directly (manual).
   The blueprint updates live. Nothing is stored or sent: the CTAs lead to /start,
   the booking page, or the visitor's own email client. */
export default function ProjectBuilder({ content }: ProjectBuilderProps) {
  const [mode, setMode] = useState<Mode>("guided");
  const [answers, setAnswers] = useState<GuidedAnswers>({ type: null, today: null, dest: "", worries: [] });
  const [manual, setManual] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const destId = useId();
  const otherId = useId();

  const labels = useMemo(() => {
    const m: Record<string, string> = {};
    content.groups.forEach((g) => g.services.forEach((s) => (m[s.id] = s.label)));
    return m;
  }, [content.groups]);
  const totalServices = Object.keys(labels).length;

  const guided = buildBlueprint(answers, content);
  const services = mode === "guided" ? guided.services : manual;
  const pct = mode === "guided" ? guided.progress : Math.round((manual.length / totalServices) * 100);
  const status =
    mode === "guided"
      ? content.progressLabel.replace("{pct}", String(pct))
      : manual.length === 1
        ? content.selectedLabelOne
        : content.selectedLabel.replace("{n}", String(manual.length));

  const toggleIn = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const mailto = (() => {
    const lines = services.map((id) => `- ${labels[id]}`);
    if (mode === "guided" && answers.dest.trim()) lines.push(`${content.destinationLabel}: ${answers.dest.trim()}`);
    if (mode === "guided" && answers.type === "other" && otherText.trim()) lines.push(`${content.questions.other.label}: ${otherText.trim()}`);
    const body = `${content.send.intro}\n\n${lines.join("\n")}`;
    return `mailto:${content.send.email}?subject=${encodeURIComponent(content.send.subject)}&body=${encodeURIComponent(body)}`;
  })();

  /* "Where are you today?" depends on the project type; Other and no pick use the default list */
  const todayOptions = content.questions.today.byType?.[answers.type ?? ""] ?? content.questions.today.options;
  const questions: { key: "type" | "today" | "worry"; question: string; options: BuilderOption[] }[] = [
    { key: "type", ...content.questions.type },
    { key: "today", question: content.questions.today.question, options: todayOptions },
    { key: "worry", ...content.questions.worry },
  ];
  const done = {
    type: answers.type !== null,
    today: answers.today !== null,
    dest: answers.dest.trim().length > 0,
    worry: answers.worries.length > 0,
  };

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-2 font-sans text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red ${
      on ? "border-psc-red bg-psc-red text-psc-bg" : "border-psc-border bg-psc-bg text-psc-ink hover:border-psc-ink"
    }`;
  const num = (on: boolean) =>
    `flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[12px] transition-colors ${
      on ? "border-psc-red bg-psc-red text-psc-bg" : "border-psc-border text-psc-gray"
    }`;

  const renderQuestion = (q: (typeof questions)[number], n: number) => {
    const multi = q.key === "worry";
    return (
      <fieldset key={q.key} className="border-t border-psc-border pt-6">
        <legend className="mb-4 flex items-center gap-3 font-display text-xl font-medium text-psc-ink">
          <span className={num(done[q.key])}>{n}</span>
          {q.question}
        </legend>
        <div className="flex flex-wrap gap-2 pl-10">
          {q.options.map((o) => {
            const on = multi ? answers.worries.includes(o.id) : answers[q.key as "type" | "today"] === o.id;
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={on}
                className={chip(on)}
                onClick={() =>
                  setAnswers((a) =>
                    multi
                      ? { ...a, worries: toggleIn(a.worries, o.id) }
                      : {
                          ...a,
                          [q.key]: a[q.key as "type" | "today"] === o.id ? null : o.id,
                          /* A different project type has different "today" options, so the old pick no longer applies */
                          ...(q.key === "type" ? { today: null } : {}),
                        },
                  )
                }
              >
                {o.label}
              </button>
            );
          })}
        </div>
        {q.key === "type" && answers.type === "other" && (
          <div className="mt-5 pl-10">
            <label htmlFor={otherId} className="mb-3 block font-display text-lg font-medium text-psc-ink">
              {content.questions.other.label}
            </label>
            <input
              id={otherId}
              type="text"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder={content.questions.other.placeholder}
              className="w-full max-w-sm rounded-lg border border-psc-border bg-psc-bg px-4 py-2.5 font-sans text-[14px] text-psc-ink placeholder:text-psc-gray focus:border-psc-red focus:outline-none"
            />
          </div>
        )}
      </fieldset>
    );
  };

  return (
    <section id="builder" aria-labelledby="builder-heading" className="scroll-mt-16 bg-psc-muted py-16 md:py-20">
      <Container>
        <p className="mb-4 font-mono text-[12px] uppercase tracking-widest text-psc-red">{content.label}</p>
        <h2 id="builder-heading" className="mb-8 max-w-2xl font-display text-h2 font-medium leading-tight text-psc-ink">
          {content.headline}
        </h2>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
          {/* Left: questions or service picker */}
          <div className="rounded-2xl border border-psc-border bg-psc-bg p-6 md:p-8">
            <div role="tablist" className="mb-6 inline-flex rounded-full bg-psc-muted p-1">
              {(["guided", "manual"] as const).map((m) => (
                <button
                  key={m}
                  role="tab"
                  type="button"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={`rounded-full px-4 py-2 font-sans text-[13px] font-medium transition-colors ${
                    mode === m ? "bg-psc-ink text-psc-bg" : "text-psc-gray hover:text-psc-ink"
                  }`}
                >
                  {content.modes[m]}
                </button>
              ))}
            </div>

            {mode === "guided" ? (
              <div className="space-y-5">
                {renderQuestion(questions[0], 1)}
                {renderQuestion(questions[1], 2)}
                <div className="border-t border-psc-border pt-6">
                  <label htmlFor={destId} className="mb-4 flex items-center gap-3 font-display text-xl font-medium text-psc-ink">
                    <span className={num(done.dest)}>3</span>
                    {content.questions.dest.question}
                  </label>
                  <div className="pl-10">
                    <input
                      id={destId}
                      type="text"
                      autoComplete="country-name"
                      value={answers.dest}
                      onChange={(e) => setAnswers((a) => ({ ...a, dest: e.target.value }))}
                      placeholder={content.questions.dest.placeholder}
                      className="w-full max-w-sm rounded-lg border border-psc-border bg-psc-bg px-4 py-2.5 font-sans text-[14px] text-psc-ink placeholder:text-psc-gray focus:border-psc-red focus:outline-none"
                    />
                  </div>
                </div>
                {renderQuestion(questions[2], 4)}
              </div>
            ) : (
              <div className="space-y-5">
                {content.groups.map((g) => (
                  <fieldset key={g.title} className="border-t border-psc-border pt-6">
                    <legend className="mb-4 font-mono text-[12px] uppercase tracking-widest text-psc-gray">{g.title}</legend>
                    <div className="flex flex-wrap gap-2">
                      {g.services.map((s) => {
                        const on = manual.includes(s.id);
                        return (
                          <button key={s.id} type="button" aria-pressed={on} className={chip(on)} onClick={() => setManual((l) => toggleIn(l, s.id))}>
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            )}
          </div>

          {/* Right: live blueprint */}
          <aside aria-live="polite" className="relative self-start overflow-hidden rounded-2xl bg-psc-ink p-6 text-psc-bg md:p-8 lg:sticky lg:top-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--color-psc-red) 30%, transparent), transparent 55%)" }}
            />
            <div className="relative">
              <p className="font-mono text-[12px] uppercase tracking-widest text-psc-bg/60">{content.blueprintTitle}</p>
              <p className="mt-2 font-sans text-small text-psc-bg/80">{status}</p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-psc-bg/15">
                <div className="h-full rounded-full bg-psc-red transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
              </div>

              <ol className="mt-6 min-h-[8rem] space-y-2">
                {services.length === 0 ? (
                  <li className="font-sans text-small text-psc-bg/50">{mode === "guided" ? content.emptyGuided : content.emptyManual}</li>
                ) : (
                  services.map((id, i) => (
                    <li key={id} className="hm-service flex items-center gap-3 border-b border-psc-bg/10 pb-2 font-sans text-[14px]">
                      <span className="font-mono text-[11px] text-psc-red">{String(i + 1).padStart(2, "0")}</span>
                      {labels[id]}
                    </li>
                  ))
                )}
                {mode === "guided" && answers.dest.trim() && (
                  <li className="pt-2 font-mono text-[12px] uppercase tracking-wider text-psc-bg/60">
                    {content.destinationLabel}: <span className="text-psc-bg">{answers.dest.trim()}</span>
                  </li>
                )}
              </ol>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={content.quote.href} className="bg-psc-red px-5 py-3 font-sans text-small font-medium text-psc-bg transition-opacity hover:opacity-90">
                  {content.quote.label}
                </Link>
                <a
                  href={content.call.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-psc-bg/30 px-5 py-3 font-sans text-small font-medium text-psc-bg transition-colors hover:border-psc-bg"
                >
                  {content.call.label}
                </a>
              </div>
              {services.length > 0 && (
                <a href={mailto} className="mt-4 inline-block font-sans text-small text-psc-bg/70 underline underline-offset-4 hover:text-psc-bg">
                  {content.send.label}
                </a>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
