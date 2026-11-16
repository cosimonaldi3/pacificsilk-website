import type { ProjectType } from "@/lib/types";

export interface CapabilityLink {
  label: string;
  href: string;
}

export interface CapabilityTileBase {
  title: string;
  body: string;
  link: CapabilityLink;
}

/* Text shown inside the mock UIs. Sample values only: no client, supplier or real figures. */
export interface CapabilitiesContent {
  label: string;
  headline: string;
  expandLabel: string;
  closeLabel: string;
  verify: CapabilityTileBase & {
    cardTitle: string;
    cardRef: string;
    checks: string[];
    status: string;
    networkLabel: string;
  };
  quality: CapabilityTileBase & {
    reportTitle: string;
    reportRef: string;
    checks: string[];
    passLabel: string;
    chartTitle: string;
    originLabel: string;
    destinationLabel: string;
  };
  movement: CapabilityTileBase & {
    from: string;
    to: string;
    status: string;
  };
  paperwork: CapabilityTileBase & {
    docs: string[];
    stamp: string;
  };
  tracking: CapabilityTileBase & {
    projectLabel: string;
    steps: string[];
    current: number;
    updateLabel: string;
  };
}

export type BuildingBlockKey = "find" | "negotiate" | "produce" | "move" | "advise" | "groups";

export interface BuildingBlock {
  key: BuildingBlockKey;
  title: string;
  body: string;
  tags: string[];
}

export type RouteOwner = "china" | "both" | "destination";

export interface RouteStep {
  name: string;
  owner: RouteOwner;
  body: string;
}

export interface ProjectFilter {
  label: string;
  /* Project types this chip shows. null = no filter ("All"). An empty array matches
     nothing yet (no placeholder projects of that kind exist). */
  types: ProjectType[] | null;
}

export interface CapabilitiesPageContent {
  meta: {
    title: string;
    description: string;
  };
  intro: {
    label: string;
    headline: string;
    subline: string;
  };
  blocks: {
    label: string;
    items: BuildingBlock[];
  };
  move: {
    label: string;
    headline: string;
    owners: Record<RouteOwner, string>;
    steps: RouteStep[];
    hint: string;
  };
  finder: {
    label: string;
    headline: string;
    subheadline: string;
    filterLabel: string;
    filters: ProjectFilter[];
    note: string;
  };
  grid: CapabilitiesContent;
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
  };
  projectTypes: {
    label: string;
    headline: string;
    types: Array<{
      key: string;
      label: string;
      description: string;
      count?: number;
    }>;
  };
  projectsGrid: {
    label: string;
    headline: string;
  };
  blogSection: {
    label: string;
    headline: string;
    linkedInLabel: string;
    linkedInUrl: string;
    instagramLabel: string;
    instagramUrl: string;
  };
  finalCta: {
    headline: string;
    body: string;
    cta: { label: string; href: string };
    secondary?: Array<{ label: string; href: string }>;
  };
  detailCta: Record<
    string,
    { headline: string; body: string; cta: { label: string; href: string } }
  >;
}

export const capabilitiesContent: CapabilitiesPageContent = {
  meta: {
    title: "Client impact — Pacific Silk Group",
    description:
      "See where PSC operates and what we have built. Projects across sourcing, manufacturing, logistics, and market entry — run remotely, delivered on the ground.",
  },
  intro: {
    label: "Client impact",
    headline: "What the bridge can carry",
    subline:
      "Everything runs through one team in your language. These are the building blocks of a project.",
  },
  blocks: {
    label: "Building blocks",
    items: [
      {
        key: "find",
        title: "Find and validate",
        body: "Partners you can trust, verified before you commit.",
        tags: ["Supplier search and validation", "Supplier verification", "Partner matching"],
      },
      {
        key: "negotiate",
        title: "Negotiate and communicate",
        body: "Everything said in Chinese, brought back in your language.",
        tags: ["Negotiation in Chinese"],
      },
      {
        key: "produce",
        title: "Produce and control quality",
        body: "Production followed and checked at the source.",
        tags: ["Production follow-up", "Quality inspection"],
      },
      {
        key: "move",
        title: "Move and clear",
        body: "From the factory gate to your door, paperwork in order.",
        tags: ["Shipping and customs", "Destination support"],
      },
      {
        key: "advise",
        title: "Advise and assess",
        body: "A clear view before you invest time or money.",
        tags: ["Feasibility and advisory", "Project assessment"],
      },
      {
        key: "groups",
        title: "Coordinate groups",
        body: "One project shared by many members.",
        tags: ["Group coordination"],
      },
    ],
  },
  move: {
    label: "Move and support",
    headline: "From the factory gate to your door",
    owners: { china: "China team", both: "Both teams", destination: "Destination team" },
    steps: [
      { name: "Factory", owner: "china", body: "Production checked before it leaves." },
      { name: "Export", owner: "china", body: "Export paperwork and loading prepared." },
      { name: "Transit", owner: "both", body: "Shipment tracked, and you stay informed in your language." },
      { name: "Customs", owner: "destination", body: "Clearance and local requirements handled." },
      { name: "Delivery", owner: "destination", body: "Goods received, checked on arrival, then delivered." },
    ],
    hint: "Select a step to see who handles it.",
  },
  finder: {
    label: "Projects",
    headline: "Find a project like yours",
    subheadline: "Filter by the kind of project, then open a marker to see the work.",
    filterLabel: "Filter projects by type",
    filters: [
      { label: "All", types: null },
      { label: "Individual projects", types: ["sourcing", "manufacturing", "logistics"] },
      { label: "Cooperation", types: ["consulting", "advisory"] },
      { label: "Investment", types: ["market-entry"] },
      { label: "Clusters and associations", types: [] },
    ],
    note: "Illustrative placeholders. Real projects are anonymized and approved by clients.",
  },
  grid: {
    label: "What we run",
    headline: "Every step between China and your market.",
    expandLabel: "Show details",
    closeLabel: "Hide details",
    verify: {
      title: "Find and verify suppliers",
      body: "We shortlist factories, check their licences, visit the floor and test samples. You only meet suppliers that passed.",
      link: { label: "How we source", href: "/capabilities" },
      cardTitle: "Supplier profile",
      cardRef: "Ref. SUP-0000",
      checks: ["Business licence", "Export licence", "Factory visit", "Sample approved"],
      status: "Verified",
      networkLabel: "Verified network, both ends",
    },
    quality: {
      title: "Quality, checked on both ends",
      body: "We inspect at the factory before it ships, and again when it lands. One standard, written down, applied twice.",
      link: { label: "See the process", href: "/process" },
      reportTitle: "Inspection report",
      reportRef: "Sample lot",
      checks: ["Dimensions", "Finish", "Packaging", "Labels"],
      passLabel: "Pass",
      chartTitle: "Checks per lot",
      originLabel: "Origin",
      destinationLabel: "Destination",
    },
    movement: {
      title: "Move it, door to door",
      body: "Freight, consolidation and delivery planned as one route. You see where your goods are and when they arrive.",
      link: { label: "Estimate a shipment", href: "/tools/shipping-estimate" },
      from: "Shanghai",
      to: "Rotterdam",
      status: "In transit",
    },
    paperwork: {
      title: "Paperwork and customs",
      body: "Export papers in China, customs codes and clearance at destination. We prepare it, check it and file it.",
      link: { label: "Find your customs code", href: "/tools/tariff-finder" },
      docs: ["Packing list", "Commercial invoice", "Customs declaration"],
      stamp: "Cleared",
    },
    tracking: {
      title: "Track every project",
      body: "One shared view of where your project stands, what is next and what we need from you.",
      link: { label: "About the portal", href: "/portal" },
      projectLabel: "Sample project",
      steps: ["Define", "Validate", "Produce", "Ship", "Deliver"],
      current: 2,
      updateLabel: "Production check booked",
    },
  },
  hero: {
    eyebrow: "Where we operate",
    headline: "Executed.\nNot proposed.",
    subheadline:
      "Every marker is a project we have run or a presence we have built. This is not a slide deck — it is a map of work done.",
  },
  projectTypes: {
    label: "What we run",
    headline: "Four capabilities. One coordinated operation.",
    types: [
      {
        key: "sourcing",
        label: "Sourcing",
        description:
          "Factory identification, vetting, and supplier management. We find who can make it, at what quality, and at what price.",
      },
      {
        key: "manufacturing",
        label: "Manufacturing",
        description:
          "End-to-end production management — samples, moulds, quality control, and delivery. Lance Trade on the factory floor.",
      },
      {
        key: "market-entry",
        label: "Market Entry",
        description:
          "China market access: local partners, co-promoters, agency introductions. We open the doors and stay in the room.",
      },
      {
        key: "logistics",
        label: "Logistics",
        description:
          "Freight, customs, consolidation, warehousing. SPL moves your cargo. PSC makes the handoff seamless.",
      },
    ],
  },
  projectsGrid: {
    label: "Some of our projects",
    headline: "See something familiar?",
  },
  blogSection: {
    label: "From the field",
    headline: "What we learn running China projects.",
    linkedInLabel: "Follow on LinkedIn",
    linkedInUrl: "https://www.linkedin.com/company/pacific-silk-consulting",
    instagramLabel: "Follow on Instagram",
    instagramUrl: "https://www.instagram.com/pacificsilkconsulting/",
  },
  finalCta: {
    headline: "Ready to run a project?",
    body: "Tell us what you need. We will tell you what is possible and what it costs.",
    cta: { label: "Build your project path", href: "/#builder" },
    secondary: [{ label: "Start a project", href: "/start" }],
  },
  detailCta: {
    sourcing: {
      headline: "Need something sourced from China?",
      body: "We find the right factory, negotiate the terms, and manage the relationship — so you do not have to build it from scratch.",
      cta: { label: "Start a project", href: "/start" },
    },
    manufacturing: {
      headline: "Ready to run production?",
      body: "Lance Trade manages the factory floor. PSC manages you. First sample to final delivery.",
      cta: { label: "Start a project", href: "/start" },
    },
    logistics: {
      headline: "Need to move cargo from China?",
      body: "SPL handles freight, customs, and delivery coordination. No surprises at the port.",
      cta: { label: "Start a project", href: "/start" },
    },
    "market-entry": {
      headline: "Looking to enter the Chinese market?",
      body: "We identify local partners, co-promoters, and agencies — and make the introductions on your behalf.",
      cta: { label: "Start a project", href: "/start" },
    },
    advisory: {
      headline: "Working through a China challenge?",
      body: "We have seen most of it before. Tell us what you are facing.",
      cta: { label: "Start a project", href: "/start" },
    },
    consulting: {
      headline: "Working through a China challenge?",
      body: "We have seen most of it before. Tell us what you are facing.",
      cta: { label: "Start a project", href: "/start" },
    },
  },
};
