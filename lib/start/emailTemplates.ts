import { clientEmailCopy, emailFooter, teamEmailCopy } from "../../content/emails.ts";
import type { ParsedQuote } from "./parseQuote.ts";

/* Pure functions: quote in, { subject, html } out. No I/O, so they can be previewed and tested.
   Email clients ignore CSS variables, classes and web fonts, so colours are literal hex values
   mirroring the site tokens (see CLAUDE.md section 6) and all styling is inline. */
const C = { bg: "#FAFAF7", ink: "#0A0A0A", gray: "#6B6B6B", muted: "#EFECE4", red: "#E71F1F", border: "#E5E3DC" };
const FONT = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";

export interface RenderedEmail {
  subject: string;
  html: string;
}

/* Maps service ids to readable names; unknown ids fall back to the id itself */
export type ServiceLabels = Record<string, string>;

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const withBreaks = (s: string) => escapeHtml(s).replace(/\n/g, "<br>");

function shell(title: string, inner: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:${C.muted}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.muted};padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${C.bg};border:1px solid ${C.border}">
<tr><td style="padding:28px 32px 0 32px;font-family:${FONT};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.red}">${escapeHtml(emailFooter)}</td></tr>
<tr><td style="padding:8px 32px 0 32px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;color:${C.ink}">${escapeHtml(title)}</td></tr>
<tr><td style="padding:24px 32px 32px 32px;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.ink}">${inner}</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function servicesList(services: string[], labels: ServiceLabels, empty: string, line: string = C.border): string {
  if (services.length === 0) return empty ? `<span style="color:${C.gray}">${escapeHtml(empty)}</span>` : "";
  return services
    .map(
      (id, i) =>
        `<div style="padding:6px 0;border-bottom:1px solid ${line}"><span style="color:${C.red};font-size:12px;margin-right:10px">${String(i + 1).padStart(2, "0")}</span>${escapeHtml(labels[id] ?? id)}</div>`,
    )
    .join("");
}

/* The email the team receives */
export function teamEmail(q: ParsedQuote, labels: ServiceLabels): RenderedEmail {
  const t = teamEmailCopy;
  const d = q.details;
  const row = (label: string, valueHtml: string) =>
    `<tr><td style="padding:8px 16px 8px 0;vertical-align:top;color:${C.gray};font-size:13px;text-transform:uppercase;letter-spacing:1px;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:8px 0;vertical-align:top">${valueHtml}</td></tr>`;

  const rows = [
    row(t.labels.name, escapeHtml(d.name)),
    row(t.labels.email, `<a href="mailto:${escapeHtml(d.email)}" style="color:${C.ink}">${escapeHtml(d.email)}</a>`),
    row(t.labels.company, escapeHtml(d.company)),
    d.country && row(t.labels.country, escapeHtml(d.country)),
    d.phone && row(t.labels.phone, escapeHtml(d.phone)),
    row(t.labels.language, escapeHtml(q.locale.toUpperCase())),
    d.message && row(t.labels.message, withBreaks(d.message)),
  ]
    .filter(Boolean)
    .join("");

  const inner = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
<div style="margin-top:24px;padding:20px;background:${C.ink};color:${C.bg}">
<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.bg};opacity:.7;margin-bottom:8px">${escapeHtml(t.labels.services)}</div>
${servicesList(q.services, labels, t.empty, "#333333")}
</div>
<p style="margin:24px 0 0 0;font-size:13px;color:${C.gray}">${escapeHtml(t.replyHint)}</p>`;

  return { subject: t.subject.replace("{company}", d.company), html: shell(t.heading, inner) };
}

/* The confirmation the visitor receives, in their site language */
export function clientEmail(q: ParsedQuote, labels: ServiceLabels): RenderedEmail {
  const c = clientEmailCopy[q.locale];
  const inner = `<p style="margin:0 0 16px 0">${escapeHtml(c.greeting.replace("{name}", q.details.name))}</p>
<p style="margin:0 0 24px 0">${escapeHtml(c.body)}</p>
<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.gray};margin-bottom:4px">${escapeHtml(c.servicesHeading)}</div>
${servicesList(q.services, labels, "")}
<p style="margin:28px 0 0 0;color:${C.gray}">${escapeHtml(c.signoff)}</p>`;
  return { subject: c.subject, html: shell(c.subject, inner) };
}
