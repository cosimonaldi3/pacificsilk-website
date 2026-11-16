import { projects, offices } from "@/content/projects";
import { posts } from "@/content/posts";
import type { Project, Office, Post, CountryMarker } from "@/lib/types";

// V1: reads from content/ files. All functions are async so a future Airtable
// swap (fetch + revalidate) only touches this file — pages never import content/ directly.

export async function getAllProjects(): Promise<Project[]> {
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return projects.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getOffices(): Promise<Office[]> {
  return offices;
}

export async function getPosts(): Promise<Post[]> {
  return posts;
}

// ── Country markers ───────────────────────────────────────────────────────────
// One red dot per country where PSC has featured projects.
// For large countries (China, USA, …) use one dot per distinct region if the
// projects are clearly separated. Currently China has one project at its
// geographic centre — this will naturally fan out as more projects are added.

const FLAG_EMOJIS: Record<string, string> = {
  Belgium: "🇧🇪",
  Spain: "🇪🇸",
  "Dominican Republic": "🇩🇴",
  China: "🇨🇳",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Italy: "🇮🇹",
  Portugal: "🇵🇹",
  "United States": "🇺🇸",
  Mexico: "🇲🇽",
  Brazil: "🇧🇷",
  Peru: "🇵🇪",
  Japan: "🇯🇵",
  "South Korea": "🇰🇷",
  Vietnam: "🇻🇳",
  India: "🇮🇳",
};

// ISO 3166-1 alpha-2 codes — renders correctly on all platforms (Windows, Mac, Linux)
const COUNTRY_CODES: Record<string, string> = {
  Belgium: "BE",
  Spain: "ES",
  "Dominican Republic": "DO",
  China: "CN",
  France: "FR",
  Germany: "DE",
  Italy: "IT",
  Portugal: "PT",
  "United States": "US",
  Mexico: "MX",
  Brazil: "BR",
  Peru: "PE",
  Japan: "JP",
  "South Korea": "KR",
  Vietnam: "VN",
  India: "IN",
};

// Countries large enough to warrant per-region splitting when multiple
// geographically distinct projects exist.
const LARGE_COUNTRIES = new Set(["China", "United States", "Brazil", "India", "Russia"]);

// Images are stored at /public/countries/[slug].jpg
const COUNTRY_IMAGES: Record<string, string> = {
  Belgium: "/countries/belgium.jpg",
  Spain: "/countries/spain.jpg",
  "Dominican Republic": "/countries/dominican-republic.jpg",
  China: "/countries/china.jpg",
  Peru: "/countries/peru.jpg",
};

export async function getCountryMarkers(): Promise<CountryMarker[]> {
  const featured = projects.filter((p) => p.featured);
  const grouped = new Map<string, Project[]>();

  for (const p of featured) {
    // Large countries: group per city so distant regions stay separate
    const key = LARGE_COUNTRIES.has(p.country)
      ? `${p.country}::${p.city}`
      : p.country;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  }

  return Array.from(grouped.entries()).map(([key, group]) => {
    const first = group[0];
    const countryName = first.country;
    return {
      id: key,
      country: countryName,
      flagEmoji: FLAG_EMOJIS[countryName] ?? "🌐",
      countryCode:
        COUNTRY_CODES[countryName] ??
        countryName.slice(0, 2).toUpperCase(),
      lat: first.lat,
      lng: first.lng,
      projects: group,
      // Featured offices in this country — shown as inverted buttons in CountryCard
      offices: offices.filter((o) => o.featured && o.country === countryName),
      countryImage:
        // Project-level image takes precedence, then country-level fallback
        group.find((p) => p.countryImage)?.countryImage ??
        COUNTRY_IMAGES[countryName],
    };
  });
}
