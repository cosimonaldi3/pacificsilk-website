import { test } from "node:test";
import assert from "node:assert/strict";
import { densityFor } from "./density.ts";
import { unitsPerContainer } from "./containerLimits.ts";
import { defaultsFor } from "./productDefaults.ts";

test("densityFor: heading beats chapter, unknown gets the generic figure", () => {
  assert.equal(densityFor("8703"), 120);
  assert.equal(densityFor("8708"), 150); // chapter 87
  assert.equal(densityFor("7700"), 250); // no chapter 77
  assert.equal(densityFor(null), 250);
});

test("densityFor: codes stay text, leading zeros count", () => {
  assert.equal(densityFor("0703"), 400); // chapter 07, not 70
});

const unitPrice = { code: "8806", year: 2025, basis: "unit" as const, avgPrice: 100, isFallback: false };

test("defaultsFor: unit basis uses the data's kg per unit", () => {
  const d = defaultsFor("8806", { ...unitPrice, kgPerUnit: 2.66 });
  assert.equal(d.kg, 2.66);
  assert.ok(Math.abs(d.cbm - 2.66 / 133) < 1e-9);
});

test("defaultsFor: without stored kg per unit, the two prices give the weight (hs4 rows)", () => {
  const d = defaultsFor("8703", { ...unitPrice, code: "8703", kgPerUnit: null, eurPerUnit: 15000, eurPerKg: 10 });
  assert.equal(d.kg, 1500);
  assert.equal(d.cbm, 1500 / 120);
});

test("defaultsFor: unit basis without kg per unit falls back to the typical weight", () => {
  const d = defaultsFor("8806", { ...unitPrice, kgPerUnit: null });
  assert.equal(d.kg, 1.6);
  assert.ok(Math.abs(d.cbm - 1.6 / 133) < 1e-9);
});

test("defaultsFor: kg basis is one over the density", () => {
  const d = defaultsFor("0703", { code: "0703", year: 2025, basis: "kg", avgPrice: 1.73, isFallback: false });
  assert.equal(d.unit, "kg");
  assert.equal(d.kg, 1);
  assert.equal(d.cbm, 1 / 400);
});

test("defaultsFor: no price still gives a volume", () => {
  const d = defaultsFor("0703", null);
  assert.equal(d.cbm, 0.5 / 400);
});

test("unitsPerContainer: listed headings only, codes stay text", () => {
  assert.equal(unitsPerContainer("8703"), 2);
  assert.equal(unitsPerContainer("8601"), 1);
  assert.equal(unitsPerContainer("6110"), null);
  assert.equal(unitsPerContainer("0101"), null);
  assert.equal(unitsPerContainer(null), null);
});

test("defaultsFor: the limit follows unit goods and never kg goods", () => {
  assert.equal(defaultsFor("8703", { ...unitPrice, code: "8703", kgPerUnit: 1500 }).perContainer, 2);
  assert.equal(defaultsFor("8703", null).perContainer, 2);
  assert.equal(defaultsFor("6110", { ...unitPrice, code: "6110", kgPerUnit: 0.3 }).perContainer, null);
  assert.equal(defaultsFor("8462", { code: "8462", year: 2025, basis: "kg", avgPrice: 5, isFallback: false }).perContainer, null);
});
