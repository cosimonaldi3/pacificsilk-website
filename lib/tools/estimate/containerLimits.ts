// Most units that fit in one 40' container, for goods too bulky or too
// indivisible to pack to their volume. Only headings counted in units can have one;
// everything not listed is priced by volume alone. Internal: never shown to the user.

const LIMITS: Record<string, number> = {
  // road vehicles: whole vehicles, nothing stacks on them
  "8703": 2,   // cars
  "8704": 2,   // goods vehicles, pick-ups
  "8706": 2,   // chassis with engines
  "8701": 3,   // tractors
  "8705": 1,   // special-purpose vehicles (cranes, concrete mixers)
  "8711": 30,  // motorcycles, crated
  "8712": 300, // bicycles, boxed

  // heavy machinery, one crate each
  "8427": 2,   // fork-lift trucks
  "8429": 1,   // bulldozers, graders
  "8457": 1,   // machining centres
  "8462": 1,   // metal forging and pressing machines

  // Oversize: these do not fit a container at all. Priced as one 40' each,
  // which understates the real cost (flat racks, special vessels). Placeholder.
  "8702": 1,   // buses
  "8601": 1, "8603": 1, "8604": 1, "8605": 1, "8606": 1, // rail locomotives, coaches, wagons
  "8802": 1,   // aircraft
  "8901": 1, "8903": 1, "8905": 1, "8906": 1,             // ships, yachts, vessels
};

export function unitsPerContainer(hs4: string | null): number | null {
  return typeof hs4 === "string" ? LIMITS[hs4] ?? null : null;
}
