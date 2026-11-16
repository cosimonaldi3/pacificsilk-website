import { test } from "node:test";
import assert from "node:assert/strict";
import { RATES, estimate, freightCost, roundUpBig } from "./model.ts";
import type { CostLine, EstimateInput, EstimateResult } from "../types.ts";

const lineOf = (r: EstimateResult, id: string): CostLine => {
  const line = r.lines.find((l) => l.id === id);
  assert.ok(line);
  return line;
};

const km = { cn: 200, sea: 19000, dest: 300 };
// truck CN 230 + sea 3150 + truck dest 480
const BOX40 = 3860;
const BOX20 = BOX40 * RATES.small.factor;
const close = (a: number, b: number): void => assert.ok(Math.abs(a - b) < 1e-6, `${a} is not ${b}`);

test("freightCost: a tiny shipment pays the groupage minimum", () => {
  assert.equal(freightCost(0.01, km), freightCost(1, km));
});

test("freightCost: a remainder too costly for groupage takes a 20'", () => {
  close(freightCost(28, km), BOX20);
});

test("freightCost: above a 20', the remainder takes a 40'", () => {
  close(freightCost(60, km), BOX40);
});

test("freightCost: exactly one 40' has no remainder", () => {
  close(freightCost(67, km), BOX40);
});

test("freightCost: 70 m³ is a 40' plus groupage for the rest", () => {
  close(freightCost(70, km), BOX40 + (freightCost(3, km)));
});

test("freightCost: more volume never costs less", () => {
  let last = 0;
  for (let v = 0.5; v < 300; v += 0.5) {
    const c = freightCost(v, km);
    assert.ok(c >= last - 1e-9, `${v} m³ costs ${c}, less than ${last}`);
    last = c;
  }
});

const input: EstimateInput = {
  qty: 1000, unitPrice: 10, cbm: 0.01, duty: 5, ad: 0, vat: 22,
  route: { km }, dest: { id: "it" },
};

test("estimate: transport is rounded to the nearest €10", () => {
  const t = lineOf(estimate(input), "transport");
  assert.equal(t.amount % RATES.roundTo, 0);
  assert.equal(t.note, undefined);
});

test("estimate: lines add up to the total", () => {
  const r = estimate(input);
  close(r.lines.reduce((s, l) => s + l.amount, 0), r.total);
});

test("estimate: weight does not change the result", () => {
  const withKg = (kg: number): EstimateInput => ({ ...input, kg } as EstimateInput);
  assert.deepEqual(estimate(withKg(1)), estimate(withKg(500)));
});

// per-container limits
test("freightCost: 10 cars at 2 per container need 5 containers", () => {
  close(freightCost(125, km, { qty: 10, perContainer: 2 }), 5 * BOX40);
});

test("freightCost: 9 cars are 4 containers plus a 20' for the odd one", () => {
  close(freightCost(112, km, { qty: 9, perContainer: 2 }), 4 * BOX40 + BOX20);
});

test("freightCost: a lone oversize unit takes a whole 40', never a 20'", () => {
  close(freightCost(1, km, { qty: 1, perContainer: 1 }), BOX40);
});

test("freightCost: a limit never lowers the volume cost", () => {
  assert.equal(freightCost(10, km, { qty: 5, perContainer: 1000 }), freightCost(10, km));
  assert.equal(freightCost(10, km, { qty: 5, perContainer: null }), freightCost(10, km));
});

test("estimate: perContainer raises transport for bulky units", () => {
  const cars = { ...input, qty: 10, cbm: 12.5 };
  const free = lineOf(estimate(cars), "transport").amount;
  const capped = lineOf(estimate({ ...cars, perContainer: 2 }), "transport").amount;
  assert.ok(capped > free);
});

test("roundUpBig: up to 1k untouched, above 1k to the hundred, above 100k to the thousand", () => {
  assert.equal(roundUpBig(720), 720);
  assert.equal(roundUpBig(1000), 1000);
  assert.equal(roundUpBig(1001), 1100);
  assert.equal(roundUpBig(1234), 1300);
  assert.equal(roundUpBig(1300), 1300);
  assert.equal(roundUpBig(10000), 10000);
  assert.equal(roundUpBig(10001), 10100);
  assert.equal(roundUpBig(16950), 17000);
  assert.equal(roundUpBig(17000), 17000);
  assert.equal(roundUpBig(100000), 100000);
  assert.equal(roundUpBig(100001), 101000);
  assert.equal(roundUpBig(632570), 633000);
});

test("estimate: big transport and insurance are rounded up, and the lines still add up", () => {
  const big = { ...input, qty: 1000, unitPrice: 17920, cbm: 12.5, perContainer: 2 };
  const r = estimate(big);
  const t = lineOf(r, "transport").amount;
  const i = lineOf(r, "insurance").amount;
  assert.equal(t % 1000, 0);   // transport is above 100k
  assert.ok(i > 10000 && i < 100000 && i % 100 === 0); // insurance is about 75.6k: to the hundred
  close(r.lines.reduce((s, l) => s + l.amount, 0), r.total);
});
