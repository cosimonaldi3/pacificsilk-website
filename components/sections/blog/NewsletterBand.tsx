"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";

type Status = "idle" | "invalid" | "pending";

/* Email sign-up block. UI only for now: no provider is chosen yet (see TODO.md), so a valid
   address is not stored or sent anywhere and the visitor is told so. When a provider is picked,
   replace the "pending" branch in onSubmit with the real request. */
export default function NewsletterBand() {
  const t = useTranslations("blog.newsletter");
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setStatus(valid ? "pending" : "invalid");
  }

  return (
    <section className="bg-psc-ink py-20 md:py-24" aria-labelledby={`${id}-title`}>
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <div>
          <h2 id={`${id}-title`} className="font-display text-h2 font-medium leading-tight text-psc-bg">
            {t("headline")}
          </h2>
          <p className="mt-4 max-w-md font-sans text-body leading-body text-psc-bg/70">{t("body")}</p>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <label htmlFor={`${id}-email`} className="sr-only">
            {t("emailLabel")}
          </label>
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              id={`${id}-email`}
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle");
              }}
              placeholder={t("placeholder")}
              aria-invalid={status === "invalid"}
              aria-describedby={`${id}-status`}
              className="min-w-0 flex-1 border-b border-psc-bg/40 bg-transparent py-3 font-sans text-body text-psc-bg placeholder:text-psc-bg/40 focus-visible:border-psc-bg focus-visible:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-psc-bg px-6 py-3 font-sans text-small font-medium text-psc-ink transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-bg"
            >
              {t("button")}
            </button>
          </div>
          <p id={`${id}-status`} role="status" className="mt-3 min-h-6 font-sans text-small text-psc-bg/70">
            {status === "invalid" && t("invalid")}
            {status === "pending" && t("pending")}
          </p>
        </form>
      </Container>
    </section>
  );
}
