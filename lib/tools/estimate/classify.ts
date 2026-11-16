import { toolsContent } from "../../../content/tools.ts";
import { isConfigured, searchHs4 } from "../api.ts";
import type { ClassifyOption } from "../types.ts";

// Product name -> candidate HS headings from searchHs4(), best first.
// Never throws: without an answer the estimate uses generic assumptions.
export async function classify(text: string, genericLabel: string = toolsContent.classify.generic): Promise<ClassifyOption[]> {
  const generic: ClassifyOption = { heading: null, description: genericLabel, source: "generic" };
  if (!isConfigured) return [generic];
  try {
    const rows = await searchHs4(text);
    if (rows.length) {
      return rows.map((r) => ({
        heading: r.code,
        description: r.description,
        chapter: r.code.slice(0, 2),
        source: "database",
      }));
    }
  } catch {
    /* offline: generic assumptions */
  }
  return [generic];
}
