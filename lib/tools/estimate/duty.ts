import { toolsContent } from "../../../content/tools.ts";
import { getHs4TariffStats, getTariffs, isConfigured } from "../api.ts";
import { fill } from "../format.ts";
import type { Destination, DutyInfo, DutyLookup } from "../types.ts";

export type DutyNotes = typeof toolsContent.duty;

const ERGA_OMNES = "1011";
const CHINA = "CN";
// geo_group values in tariffs_hs4
const GROUP_ERGA_OMNES = "ERGA_OMNES";
const GROUP_CHINA = "CHINA";

// Import duty and anti-dumping (%) for a heading at a destination: { duty, ad }.
// EU destinations use tariffs_hs4: the erga omnes average is the tariff, the
// China average the anti-dumping, each with its min and max over the leaves of
// the heading. A China row whose leaves are all zero filled means no anti-dumping. ad is null when unknown (outside the EU, no database).
// Otherwise an estimate.
export async function lookupDuty(
  heading: string | null,
  dest: Destination,
  fallback: number,
  notes: DutyNotes = toolsContent.duty,
): Promise<DutyLookup> {
  if (dest.eu && heading && isConfigured) {
    const hs4 = heading.slice(0, 4);
    try {
      const stats = await getHs4TariffStats(hs4, [GROUP_ERGA_OMNES, GROUP_CHINA]);
      const duty: DutyInfo = stats[GROUP_ERGA_OMNES]
        ? { ...stats[GROUP_ERGA_OMNES], source: "database" }
        : await thirdCountryDuty(heading, fallback, notes);
      const ad: DutyInfo =
        stats[GROUP_CHINA] && !stats[GROUP_CHINA].none
          ? { ...stats[GROUP_CHINA], source: "database" }
          : { rate: 0, source: "database", none: true, hs4 };
      return { duty, ad };
    } catch {
      /* fall through to the estimate */
    }
  }
  return { duty: estimateDuty(dest, fallback, notes), ad: null };
}

// Stored percentage of the third country duty; rate_text is never parsed, only quoted.
async function thirdCountryDuty(heading: string, fallback: number, notes: DutyNotes): Promise<DutyInfo> {
  try {
    const rows = await getTariffs(heading, { origin: CHINA });
    const duty = rows.find((r) => r.geo_code === ERGA_OMNES && r.measure === "Third country duty");
    if (duty?.rate_perc != null) {
      return {
        rate: duty.rate_perc,
        source: "database",
        note: fill(notes.stored, { measure: duty.measure, text: duty.rate_text }),
      };
    }
    if (duty) {
      return { rate: fallback, source: "estimate", note: fill(notes.typicalWithDatabase, { text: duty.rate_text }) };
    }
  } catch {
    /* the estimate below */
  }
  return { rate: fallback, source: "estimate", note: notes.typical };
}

function estimateDuty(dest: Destination, fallback: number, notes: DutyNotes): DutyInfo {
  switch (dest.id) {
    case "ch":
      return { rate: 0, source: "estimate", note: notes.ch };
    case "us":
      return { rate: fallback, source: "estimate", note: notes.us };
    case "pe":
      return { rate: fallback, source: "estimate", note: notes.pe };
    case "do":
      return { rate: fallback, source: "estimate", note: notes.do };
    case "tr":
      return { rate: fallback, source: "estimate", note: notes.tr };
    default:
      return { rate: fallback, source: "estimate", note: notes.typical };
  }
}
