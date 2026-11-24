import { validateQuote, type QuoteDetails } from "./submitQuote.ts";

/* Server-side parsing of the POST body. Pure (no I/O) so it is unit tested.
   Never trust the client: every field is re-validated and length-capped here. */

export const LOCALES = ["en", "es", "zh"] as const;
export type QuoteLocale = (typeof LOCALES)[number];

export interface ParsedQuote {
  details: QuoteDetails;
  services: string[];
  builder: Record<string, unknown>;
  locale: QuoteLocale;
}

export type ParseResult =
  | { ok: true; quote: ParsedQuote }
  | { ok: false; reason: "invalid" | "spam" };

const MAX = { name: 200, email: 320, company: 200, country: 200, phone: 60, message: 5000 } as const;
/* Humans need a few seconds to fill the form; bots post instantly */
export const MIN_FILL_MS = 3000;
const MAX_SERVICES = 40;
const MAX_BUILDER_JSON = 6000;

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseQuote(body: unknown): ParseResult {
  if (!isObject(body)) return { ok: false, reason: "invalid" };

  // Honeypot: real visitors never see this field. Pretend success to the bot, store nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") return { ok: false, reason: "spam" };
  const elapsed = typeof body.elapsedMs === "number" ? body.elapsedMs : 0;
  if (elapsed < MIN_FILL_MS) return { ok: false, reason: "spam" };

  const raw = isObject(body.details) ? body.details : {};
  const details: QuoteDetails = {
    name: str(raw.name, MAX.name),
    email: str(raw.email, MAX.email),
    company: str(raw.company, MAX.company),
    country: str(raw.country, MAX.country),
    phone: str(raw.phone, MAX.phone),
    message: str(raw.message, MAX.message),
  };
  if (Object.keys(validateQuote(details)).length > 0) return { ok: false, reason: "invalid" };

  const services = Array.isArray(body.services)
    ? body.services.filter((s): s is string => typeof s === "string" && s.length > 0 && s.length <= 60).slice(0, MAX_SERVICES)
    : [];

  const builder = isObject(body.builder) ? body.builder : {};
  if (JSON.stringify(builder).length > MAX_BUILDER_JSON) return { ok: false, reason: "invalid" };

  const locale = (LOCALES as readonly unknown[]).includes(body.locale) ? (body.locale as QuoteLocale) : "en";

  return { ok: true, quote: { details, services, builder, locale } };
}
