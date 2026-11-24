"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { QuoteFormContent } from "@/content/start";
import type { BuilderContent } from "@/content/home";
import { buildBlueprint } from "@/lib/home/blueprint";
import { useBuilderState } from "@/lib/home/useBuilderState";
import { submitQuote, validateQuote, type QuoteDetails, type QuoteErrors } from "@/lib/start/submitQuote";

interface QuoteFormProps {
  content: QuoteFormContent;
  builder: BuilderContent;
}

type FieldKey = keyof QuoteDetails;

const FIELDS: { key: FieldKey; required: boolean; type: string; autoComplete: string; wide?: boolean }[] = [
  { key: "name", required: true, type: "text", autoComplete: "name" },
  { key: "email", required: true, type: "email", autoComplete: "email" },
  { key: "company", required: true, type: "text", autoComplete: "organization" },
  { key: "country", required: false, type: "text", autoComplete: "country-name" },
  { key: "phone", required: false, type: "tel", autoComplete: "tel" },
  { key: "message", required: false, type: "textarea", autoComplete: "off", wide: true },
];

const EMPTY: QuoteDetails = { name: "", email: "", company: "", country: "", phone: "", message: "" };

/* The visitor's details. The blueprint comes from the shared builder below (same sessionStorage state). */
export default function QuoteForm({ content, builder }: QuoteFormProps) {
  const id = useId();
  const locale = useLocale();
  const [values, setValues] = useState<QuoteDetails>(EMPTY);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "rate-limited">("idle");
  const [state] = useBuilderState();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  // The server rejects submissions that arrive within seconds of the page loading (bots)
  const openedAt = useRef(0);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const services = state.mode === "guided" ? buildBlueprint(state.answers, builder).services : state.manual;
  const count =
    services.length === 1 ? content.blueprintCountOne : content.blueprintCount.replace("{n}", String(services.length));
  const hasErrors = Object.keys(errors).length > 0;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateQuote(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = FIELDS.find((f) => found[f.key]);
      if (first) formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${id}-${first.key}`)}`)?.focus();
      return;
    }
    setStatus("sending");
    const website = (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    const result = await submitQuote(
      { details: values, services, builder: state, locale },
      { website, elapsedMs: Date.now() - openedAt.current },
    );
    if (result.ok) router.push("/start/thanks");
    else setStatus(result.reason);
  };

  const inputClass = (invalid: boolean) =>
    /* Underline fields: no box, so the details read as part of the page rather than a separate card */
    `w-full resize-none border-0 border-b bg-transparent px-0 py-2 font-sans text-[16px] text-psc-ink placeholder:text-psc-gray/70 transition-colors focus:outline-none ${
      invalid ? "border-psc-red" : "border-psc-ink/20 hover:border-psc-ink/40 focus:border-psc-ink"
    }`;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-labelledby={`${id}-heading`} className="relative">
      <h2 id={`${id}-heading`} className="sr-only">
        {content.heading}
      </h2>

      <div className="grid gap-x-8 gap-y-7 md:grid-cols-3">
        {FIELDS.map((f) => {
          const fid = `${id}-${f.key}`;
          const err = errors[f.key];
          const field = content.fields[f.key];
          const common = {
            id: fid,
            name: f.key,
            value: values[f.key],
            placeholder: field.placeholder,
            autoComplete: f.autoComplete,
            required: f.required,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${fid}-error` : undefined,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const v = e.target.value;
              setValues((s) => ({ ...s, [f.key]: v }));
              if (err) setErrors((s) => ({ ...s, [f.key]: undefined }) as QuoteErrors);
            },
            className: inputClass(Boolean(err)),
          };
          return (
            <div key={f.key} className={f.wide ? "md:col-span-3" : undefined}>
              <label htmlFor={fid} className="block font-sans text-[13px] font-medium uppercase tracking-wider text-psc-gray">
                {field.label}
                {!f.required && <span className="ml-2 font-normal normal-case tracking-normal">({content.optionalLabel})</span>}
              </label>
              {f.type === "textarea" ? <textarea rows={2} {...common} /> : <input type={f.type} {...common} />}
              {err && (
                <p id={`${fid}-error`} className="mt-2 flex items-center gap-2 font-sans text-small text-psc-ink">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-psc-red" />
                  {content.errors[err]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Honeypot: hidden from people, filled by bots. Checked server-side in step 2. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Send bar: sits between the details and the builder, so both are in view when sending */}
      <div className="mt-10 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-small text-psc-gray">{count}</p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-psc-red px-8 py-3.5 font-sans text-small font-medium text-psc-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-ink disabled:opacity-60"
        >
          {content.submitLabel}
        </button>
      </div>

      <div aria-live="polite" className="mt-3 min-h-[1.5rem]">
        {hasErrors && <p className="font-sans text-small font-medium text-psc-ink">{content.errors.summary}</p>}
        {(status === "error" || status === "rate-limited") && (
          <p className="font-sans text-small text-psc-ink">{status === "rate-limited" ? content.errors.rateLimited : content.errors.server}</p>
        )}
      </div>
    </form>
  );
}
