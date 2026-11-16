import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assertCode, breadcrumbCodes, errorMessage, levelOf, markLeaves, normalizeQuery, searchHs4, toPrice, toPriceRange, toRateStats,
} from "./api.ts";

test("breadcrumbCodes: chapter down to the code itself", () => {
  assert.deepEqual(breadcrumbCodes("0703200000"), ["07", "0703", "070320", "07032000", "0703200000"]);
  assert.deepEqual(breadcrumbCodes("070320"), ["07", "0703", "070320"]);
  assert.deepEqual(breadcrumbCodes("07"), ["07"]);
});

test("breadcrumbCodes keeps leading zeros", () => {
  assert.deepEqual(breadcrumbCodes("0101"), ["01", "0101"]);
});

test("codes must be text of 2/4/6/8/10 digits", () => {
  assert.throws(() => assertCode(703 as unknown as string), TypeError);
  assert.throws(() => assertCode("703"), TypeError);
  assert.throws(() => assertCode("07a3"), TypeError);
  assert.throws(() => assertCode("070320000000"), TypeError);
  assert.equal(assertCode("0703"), "0703");
});

test("levelOf follows code length", () => {
  assert.equal(levelOf("07"), "chapter");
  assert.equal(levelOf("0703"), "hs4");
  assert.equal(levelOf("07032000"), "cn8");
  assert.equal(levelOf("0703200000"), "taric10");
});

const row = {
  code: "07032000", year: 2025, reporter: "EU", partner: "CN",
  avg_price: 1.7323, price_basis: "kg" as const, eur_per_unit: null, eur_per_kg: 1.7323, kg_per_unit: null,
};

test("toPrice: price from a parent is a fallback", () => {
  const p = toPrice(row, "0703200000");
  assert.ok(p);
  assert.equal(p.isFallback, true);
  assert.equal(p.code, "07032000");
  assert.equal(p.level, "cn8");
  assert.equal(p.basis, "kg");
  assert.equal(p.avgPrice, 1.7323);
});

test("toPrice: price on the requested code is not a fallback", () => {
  assert.equal(toPrice(row, "07032000")?.isFallback, false);
});

test("toPrice: no row or no price -> null", () => {
  assert.equal(toPrice(undefined, "0703"), null);
  assert.equal(toPrice({ ...row, avg_price: null }, "07032000"), null);
});

test("toPriceRange: maps a spread, hides no-range cases", () => {
  assert.deepEqual(toPriceRange({ min_price: 0.8, max_price: 4.2, n_codes: 12 }), { minPrice: 0.8, maxPrice: 4.2, count: 12 });
  assert.equal(toPriceRange(undefined), null);
  assert.equal(toPriceRange({ min_price: null, max_price: null, n_codes: 0 }), null);
  assert.equal(toPriceRange({ min_price: 2, max_price: 2, n_codes: 3 }), null);
  assert.equal(toPriceRange({ min_price: 2, max_price: 5, n_codes: 1 }), null);
});

test("toRateStats: avg, min, max and leaf count; null without an average", () => {
  assert.deepEqual(toRateStats({ rate_avg: 23.5, rate_min: 0, rate_max: 71.9, n_leaves: 43, n_leaves_zero_filled: 0 }),
    { rate: 23.5, min: 0, max: 71.9, count: 43, none: false });
  assert.equal(toRateStats(undefined), null);
  assert.equal(toRateStats({ rate_avg: null }), null);
});

test("toRateStats: all leaves zero filled -> none, rate 0", () => {
  const s = toRateStats({ rate_avg: 0, rate_min: 0, rate_max: 0, n_leaves: 15, n_leaves_zero_filled: 15 });
  assert.ok(s);
  assert.equal(s.none, true);
  assert.equal(s.rate, 0);
  assert.equal(toRateStats({ rate_avg: 2, rate_min: 0, rate_max: 4, n_leaves: 15, n_leaves_zero_filled: 3 })?.none, false);
});

test("markLeaves: hasChildren from the grandchildren's parents", () => {
  const out = markLeaves([{ code: "070310" }, { code: "070320" }], ["070310", "070310"]);
  assert.deepEqual(out.map((c) => c.hasChildren), [true, false]);
});

test("normalizeQuery: blank or < 2 characters -> null", () => {
  assert.equal(normalizeQuery(""), null);
  assert.equal(normalizeQuery("  a "), null);
  assert.equal(normalizeQuery(undefined), null);
  assert.equal(normalizeQuery("  tv "), "tv");
});

test("searchHs4: short query returns [] without calling the database", async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error("fetch must not be called"); };
  try {
    assert.deepEqual(await searchHs4(""), []);
    assert.deepEqual(await searchHs4(" x "), []);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("errorMessage is readable", () => {
  assert.equal(
    errorMessage("getNode", 400, { message: "column nomenclature.nope does not exist", hint: "Perhaps you meant code" }),
    "getNode: database error 400: column nomenclature.nope does not exist (Perhaps you meant code)",
  );
  assert.equal(errorMessage("price_for", 502, null), "price_for: database error 502");
});
