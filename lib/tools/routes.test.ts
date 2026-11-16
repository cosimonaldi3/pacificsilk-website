import { test } from "node:test";
import assert from "node:assert/strict";
import { DESTINATIONS, DEST_PORTS, ORIGINS } from "./places.ts";
import { buildRoute } from "./routes.ts";

// Regression: Romania's port had a sea lane but no DEST_PORTS entry, so choosing it crashed the page.
test("every destination has a known port and a drawable route from every origin", () => {
  for (const dest of DESTINATIONS) {
    assert.ok(DEST_PORTS[dest.port], `${dest.country}: no port "${dest.port}"`);
    for (const origin of ORIGINS) {
      const route = buildRoute(origin, dest);
      assert.equal(route.legs.length, 3);
      assert.ok(route.km.sea > 0, `${origin.city} to ${dest.city} has no sea distance`);
    }
  }
});
