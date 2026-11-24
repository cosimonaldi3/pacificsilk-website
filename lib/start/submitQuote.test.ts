import { test } from "node:test";
import assert from "node:assert/strict";
import { validateQuote } from "./submitQuote.ts";

const base = { name: "Ana", email: "ana@example.com", company: "Acme", country: "", phone: "", message: "" };

test("valid details have no errors", () => {
  assert.deepEqual(validateQuote(base), {});
});

test("name, email and company are required; the rest are optional", () => {
  assert.deepEqual(validateQuote({ ...base, name: " ", email: "", company: "" }), {
    name: "required",
    email: "required",
    company: "required",
  });
});

test("malformed email is flagged", () => {
  assert.deepEqual(validateQuote({ ...base, email: "ana@example" }), { email: "email" });
});
