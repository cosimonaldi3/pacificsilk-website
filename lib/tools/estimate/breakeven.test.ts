import { test } from "node:test";
import assert from "node:assert/strict";
import { roundQty } from "./breakeven.ts";

test("roundQty: up to 2 significant figures above 100, untouched below", () => {
  assert.equal(roundQty(1), 1);
  assert.equal(roundQty(81), 81);
  assert.equal(roundQty(100), 100);
  assert.equal(roundQty(101), 110);
  assert.equal(roundQty(337), 340);
  assert.equal(roundQty(340), 340);
  assert.equal(roundQty(1234), 1300);
  assert.equal(roundQty(9990), 10000);
  assert.equal(roundQty(48210), 49000);
});

test("roundQty: never below the real break-even", () => {
  for (let n = 1; n < 20000; n += 7) assert.ok(roundQty(n) >= n);
});
