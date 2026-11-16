// Packed density (kg/m³) per HS heading: goods plus cartons and dead space.
// Rough figures used only to turn weight into volume for the freight estimate.
// Internal: never shown to the user.

const GENERIC = 250;

const CHAPTERS: Record<string, number> = {
  "01": 300, "02": 500, "03": 500, "04": 550, "05": 300, "06": 150, "07": 400, "08": 400, "09": 400, "10": 650,
  "11": 550, "12": 500, "13": 500, "14": 200, "15": 800, "16": 700, "17": 700, "18": 600, "19": 350, "20": 700,
  "21": 500, "22": 750, "23": 500, "24": 300, "25": 1100, "26": 1500, "27": 800, "28": 900, "29": 700, "30": 350,
  "31": 900, "32": 900, "33": 450, "34": 600, "35": 550, "36": 400, "37": 400, "38": 750, "39": 300, "40": 450,
  "41": 350, "42": 150, "43": 100, "44": 450, "45": 200, "46": 100, "47": 600, "48": 600, "49": 550, "50": 250,
  "51": 200, "52": 300, "53": 300, "54": 300, "55": 250, "56": 150, "57": 300, "58": 250, "59": 300, "60": 250,
  "61": 150, "62": 150, "63": 150, "64": 130, "65": 70, "66": 120, "67": 60, "68": 1000, "69": 800, "70": 500,
  "71": 1500, "72": 2500, "73": 800, "74": 1500, "75": 2000, "76": 600, "78": 3000, "79": 2500, "80": 2500, "81": 2000,
  "82": 700, "83": 500, "84": 300, "85": 250, "86": 500, "87": 150, "88": 120, "89": 150, "90": 200, "91": 200,
  "92": 120, "93": 400, "94": 120, "95": 130, "96": 200, "97": 150, "99": 250,
};

// Headings that sit far from their chapter's figure.
const HEADINGS: Record<string, number> = {
  "3923": 100,  // plastic packaging, hollow
  "3926": 150,  // other articles of plastics
  "6110": 140,  // knitted jerseys and hoodies
  "6907": 1400, // ceramic tiles, packed flat
  "7304": 2750, // seamless steel tubes
  "7308": 500,  // steel structures
  "8471": 200,  // computers
  "8517": 250,  // telephones
  "8703": 120,  // cars
  "8711": 130,  // motorcycles
  "8712": 90,   // bicycles
  "8806": 133,  // drones
  "9401": 90,   // seats
  "9403": 120,  // other furniture
};

export function densityFor(hs4: string | null): number {
  if (typeof hs4 !== "string") return GENERIC;
  return HEADINGS[hs4] ?? CHAPTERS[hs4.slice(0, 2)] ?? GENERIC;
}
