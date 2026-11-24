import { NextResponse } from "next/server";
import { clientEmail, teamEmail, type ServiceLabels } from "@/lib/start/emailTemplates";
import { LOCALES, type ParsedQuote, type QuoteLocale } from "@/lib/start/parseQuote";
import { homeContent } from "@/content/home";

/* Local-only preview of the quote emails with sample data.
   Open http://localhost:3000/api/quote/preview?kind=team|client&locale=en|es|zh while `npm run dev` runs.
   Disabled in production: it returns 404 there. Nothing is sent. */

const LABELS: ServiceLabels = Object.fromEntries(
  homeContent.builder.groups.flatMap((g) => g.services.map((s) => [s.id, s.label])),
);

export function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new NextResponse("Not found", { status: 404 });

  const params = new URL(request.url).searchParams;
  const locale = (LOCALES as readonly string[]).includes(params.get("locale") ?? "") ? (params.get("locale") as QuoteLocale) : "en";
  const kind = params.get("kind") === "client" ? "client" : "team";

  const sample: ParsedQuote = {
    details: {
      name: "Ana García",
      email: "ana@example.com",
      company: "Acme Home Goods",
      country: "Spain",
      phone: "+34 600 000 000",
      message: "We want to produce 5,000 ceramic mugs.\nTarget landed cost under 2 EUR. First shipment in Q2.",
    },
    services: Object.keys(LABELS).slice(0, 4),
    builder: {},
    locale,
  };

  const { html } = kind === "client" ? clientEmail(sample, LABELS) : teamEmail(sample, LABELS);
  const nav = LOCALES.flatMap((l) => (["team", "client"] as const).map((k) => `<a href="?kind=${k}&locale=${l}" style="margin-right:12px;font:13px sans-serif">${k} · ${l}</a>`)).join("");
  return new NextResponse(`<div style="padding:12px 16px;background:#fff;border-bottom:1px solid #ddd">${nav}</div>${html}`, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
