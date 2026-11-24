import { test } from "node:test";
import assert from "node:assert/strict";
import { clientEmail, teamEmail } from "./emailTemplates.ts";
import type { ParsedQuote } from "./parseQuote.ts";

const quote: ParsedQuote = {
  details: { name: "Ana", email: "ana@example.com", company: "Acme <b>", country: "", phone: "", message: "<script>alert(1)</script>\nline two" },
  services: ["definition", "unknown-id"],
  builder: {},
  locale: "es",
};
const labels = { definition: "Project definition" };

test("team email escapes visitor input and shows readable service names", () => {
  const { subject, html } = teamEmail(quote, labels);
  assert.equal(subject, "New quote request: Acme <b>");
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(html.includes("Project definition"));
  assert.ok(html.includes("unknown-id"));
  assert.ok(html.includes("<br>"));
});

test("client email follows the visitor's locale", () => {
  assert.equal(clientEmail(quote, labels).subject, "Hemos recibido tu proyecto");
  assert.equal(clientEmail({ ...quote, locale: "zh" }, labels).subject, "我们已收到您的项目");
  assert.equal(clientEmail({ ...quote, locale: "en" }, labels).subject, "We received your project");
});
