import { NextResponse } from "next/server";
import { parseQuote, type ParsedQuote } from "@/lib/start/parseQuote";
import { clientEmail, teamEmail, type ServiceLabels } from "@/lib/start/emailTemplates";
import { homeContent } from "@/content/home";

/* POST /api/quote — stores a quote request in Supabase and emails the team.
   Secrets are read here only, never in client code. Personal data is never logged. */

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const RESEND_KEY = process.env.RESEND_API_KEY ?? "";
const TO_EMAIL = process.env.QUOTE_TO_EMAIL ?? "";
const FROM_EMAIL = process.env.QUOTE_FROM_EMAIL ?? "";

const MAX_BODY_BYTES = 20_000;

/* Best-effort per-IP limit. In-memory, so it resets per serverless instance:
   it slows casual abuse; the honeypot and size caps do the rest. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const json = (body: Record<string, unknown>, status: number) => NextResponse.json(body, { status });

async function store(q: ParsedQuote): Promise<string | null> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/quote_requests`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      name: q.details.name,
      email: q.details.email,
      company: q.details.company,
      country: q.details.country || null,
      phone: q.details.phone || null,
      message: q.details.message || null,
      services: q.services,
      builder: q.builder,
      locale: q.locale,
    }),
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as { id: string }[];
  return rows[0]?.id ?? null;
}

async function sendEmail(payload: { to: string; subject: string; html: string; reply_to?: string }): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, ...payload }),
  });
  return res.ok;
}

/* Service id → readable name (English: the team reads these) */
const SERVICE_LABELS: ServiceLabels = Object.fromEntries(
  homeContent.builder.groups.flatMap((g) => g.services.map((s) => [s.id, s.label])),
);

/* Email is best effort: the quote is already safely stored, so a mail failure must not fail the visitor's request.
   Templates live in lib/start/emailTemplates.ts; preview them at /api/quote/preview (local dev only). */
async function notify(q: ParsedQuote): Promise<boolean> {
  if (!RESEND_KEY || !TO_EMAIL || !FROM_EMAIL) return false;
  const team = await sendEmail({ to: TO_EMAIL, reply_to: q.details.email, ...teamEmail(q, SERVICE_LABELS) });
  // Replies to the visitor's confirmation reach the team inbox
  await sendEmail({ to: q.details.email, reply_to: TO_EMAIL, ...clientEmail(q, SERVICE_LABELS) });
  return team;
}

export async function POST(request: Request) {
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: "unavailable" }, 503);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json({ error: "rate-limited" }, 429);

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return json({ error: "invalid" }, 413);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ error: "invalid" }, 400);
  }

  const parsed = parseQuote(body);
  // Bots get a normal-looking success so they learn nothing; nothing is stored
  if (!parsed.ok) return parsed.reason === "spam" ? json({ ok: true }, 200) : json({ error: "invalid" }, 400);

  const id = await store(parsed.quote);
  if (!id) return json({ error: "server" }, 500);

  const sent = await notify(parsed.quote);
  if (sent) {
    await fetch(`${SUPABASE_URL}/rest/v1/quote_requests?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email_sent: true }),
    }).catch(() => undefined);
  }
  return json({ ok: true }, 200);
}
