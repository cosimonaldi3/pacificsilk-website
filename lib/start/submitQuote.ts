import type { BuilderState } from "@/lib/home/useBuilderState";

export interface QuoteDetails {
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  message: string;
}

export interface QuotePayload {
  details: QuoteDetails;
  /* Service ids from the blueprint, in the order shown */
  services: string[];
  builder: BuilderState;
  locale: string;
}

export type SubmitResult = { ok: true } | { ok: false; reason: "rate-limited" | "error" };

/* POSTs to /api/quote (stores the request in Supabase and emails the team).
   `website` is the honeypot value and `elapsedMs` the time the visitor spent on the form; the server checks both. */
export async function submitQuote(payload: QuotePayload, extras: { website: string; elapsedMs: number }): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, ...extras }),
    });
    if (res.ok) return { ok: true };
    return { ok: false, reason: res.status === 429 ? "rate-limited" : "error" };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export type QuoteErrors = Partial<Record<keyof QuoteDetails, "required" | "email">>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Pure, so it can be unit tested and reused by the API route later */
export function validateQuote(d: QuoteDetails): QuoteErrors {
  const errors: QuoteErrors = {};
  if (!d.name.trim()) errors.name = "required";
  if (!d.email.trim()) errors.email = "required";
  else if (!EMAIL_RE.test(d.email.trim())) errors.email = "email";
  if (!d.company.trim()) errors.company = "required";
  return errors;
}
