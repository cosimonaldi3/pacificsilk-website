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
  // Headline fact for the client impact carousel badge. Only facts stated in the project text.
  impact?: { value: string; label: string };
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
