import { test } from "node:test";
import assert from "node:assert/strict";
import { parseQuote, MIN_FILL_MS } from "./parseQuote.ts";

const body = {
  details: { name: " Ana ", email: "ana@example.com", company: "Acme", country: "", phone: "", message: "Hi" },
  services: ["definition", "shipping"],
  builder: { mode: "guided" },
  locale: "es",
  website: "",
  elapsedMs: MIN_FILL_MS + 1000,
};

test("accepts a valid body and trims fields", () => {
  const r = parseQuote(body);
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.quote.details.name, "Ana");
    assert.equal(r.quote.locale, "es");
    assert.deepEqual(r.quote.services, ["definition", "shipping"]);
  }
});

test("honeypot filled is treated as spam", () => {
  assert.deepEqual(parseQuote({ ...body, website: "http://spam" }), { ok: false, reason: "spam" });
});

test("submitting too fast is treated as spam", () => {
  assert.deepEqual(parseQuote({ ...body, elapsedMs: 200 }), { ok: false, reason: "spam" });
});

test("missing required details are invalid", () => {
  assert.deepEqual(parseQuote({ ...body, details: { ...body.details, company: "" } }), { ok: false, reason: "invalid" });
});

test("non-object bodies are invalid", () => {
  assert.deepEqual(parseQuote("nope"), { ok: false, reason: "invalid" });
  assert.deepEqual(parseQuote(null), { ok: false, reason: "invalid" });
});

test("unknown locale falls back to en and bad services are dropped", () => {
  const r = parseQuote({ ...body, locale: "fr", services: ["ok", 5, "", "x".repeat(100)] });
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.quote.locale, "en");
    assert.deepEqual(r.quote.services, ["ok"]);
  }
});

test("oversized builder payload is rejected", () => {
  assert.deepEqual(parseQuote({ ...body, builder: { blob: "x".repeat(7000) } }), { ok: false, reason: "invalid" });
});
