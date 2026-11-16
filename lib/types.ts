export type ProjectType =
  | "sourcing"
  | "logistics"
  | "consulting"
  | "market-entry"
  | "advisory"
  | "manufacturing";

export type ProjectStatus = "in-progress" | "completed";

export interface Project {
  id: string;
  slug: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  startDate: string;
  completedDate?: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  summary: string;
  body: string[];
  outcome?: string;
  client?: string;
  featured: boolean;
  alliance?: string;
  image?: string;
  bodyImages?: string[];
  countryImage?: string; // e.g. "/countries/belgium.jpg" — set when a photo exists
}

export interface CountryMarker {
  id: string;          // unique key, e.g. "Belgium" or "China::Shanghai"
  country: string;
  flagEmoji: string;
  countryCode: string; // ISO 3166-1 alpha-2, e.g. "BE" — reliable on all platforms
  lat: number;
  lng: number;
  projects: Project[];
  offices: Office[];   // featured offices in this country (shown in country card)
  countryImage?: string;
}

export interface Office {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;  // ISO 3166-1 alpha-2
  lat: number;
  lng: number;
  featured?: boolean;   // if true: clicking the globe dot opens an office card
  description?: string; // office description shown in the office card
  officeImage?: string; // /countries/office-[country].jpg — falls back to black
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  url: string;
  platform?: "linkedin" | "instagram";
  image?: string;
}
