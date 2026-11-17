import { startContent } from "@/content/start";
import type { FinalCtaContent } from "@/content/home";

export interface CarouselTestimonial {
  kind: "testimonial";
  id: string;
  label: string;
  quote: string;
  name: string;
  title: string;
  photo: string;
}

export interface CarouselReflection {
  kind: "reflection";
  id: string;
  label: string;
  quote: string;
}

export type CarouselItem = CarouselTestimonial | CarouselReflection;

export interface TeamMember {
  name: string;
  title: string;
  company: string;
  bio: string;
  photo: string | null;
  placeholder: boolean;
  initials?: string;
}

export interface AllianceContent {
  headline: string;
  body: string;
  companies: Array<{
    name: string;
    role: string;
    logo: string;
    logoClassName?: string;
    image?: string;
  }>;
}

export interface PresenceAction {
  label: string;
  href: string;
  /* Set to send the link to another locale's home, e.g. the Chinese side */
  locale?: "en" | "es" | "zh";
}

export type PresenceCountryId =
  | "spain"
  | "italy"
  | "mexico"
  | "panama"
  | "peru"
  | "more";

export interface PresenceCountry {
  id: PresenceCountryId;
  chip: string;
  title: string;
  body: string;
  actions: PresenceAction[];
  /* Country name for the map label and "{country}" in the services strings.
     Left out for "more", which has no dot and no services panel. */
  name?: string;
  hqCity?: string;
  servicesIntro?: string;
  services?: string[];
  /* The person shown on the country page. Falls back to PresenceContent.representative. */
  representative?: PresenceRepresentative;
}

export interface PresenceRepresentative {
  name: string;
  title: string;
  company: string;
  bio: string;
  photo: string;
}

export interface PresenceContent {
  label: string;
  headline: string;
  chipsLabel: string;
  globeLabel: string;
  hqLabel: string;
  /** "{country}" is replaced with the country name */
  servicesLink: string;
  /** "{country}" is replaced with the country name */
  servicesTitle: string;
  expandLabel: string;
  /* Country page */
  backLabel: string;
  /** "{country}" is replaced with the country name */
  servicesHeading: string;
  /** "{country}" is replaced with the country name */
  representativeLabel: string;
  /* TEMPLATE: shown on every country page until that country sets its own `representative` */
  representative: PresenceRepresentative;
  countries: PresenceCountry[];
}

export interface ChinaFootholdContent {
  label: string;
  headline: string;
  body: string;
  mapLabel: string;
  hqLabel: string;
  officesLabel: string;
  /* lat/lng place the dots on the map; labelDy nudges a label up (-) or down (+) so close cities don't overlap */
  hq: ChinaCity;
  offices: ChinaCity[];
  actions: PresenceAction[];
}

export interface ChinaCity {
  name: string;
  lat: number;
  lng: number;
  labelSide: "left" | "right";
  labelDy?: number;
}

export interface JoinNetworkTile {
  title: string;
  body: string;
  action: { label: string; href: string };
}

export interface JoinNetworkContent {
  label: string;
  headline: string;
  path: string[];
  tiles: JoinNetworkTile[];
  footnote: string;
}

export interface AboutContent {
  meta: {
    title: string;
    description: string;
  };
  story: {
    label: string;
  };
  team: TeamMember[];
  carousel: { sectionLabel: string; items: CarouselItem[] };
  alliance: AllianceContent;
  chinaFoothold: ChinaFootholdContent;
  presence: PresenceContent;
  joinNetwork: JoinNetworkContent;
  finalCta: FinalCtaContent;
}

export const aboutContent: AboutContent = {
  meta: {
    title: "About — Pacific Silk Consulting",
    description:
      "The people and story behind Pacific Silk Consulting and the Pacific Silk Alliance.",
  },
  story: {
    label: "Who we are",
  },
  team: [
    {
      name: "Jorge Villalonga Moragues",
      title: "Head of Asia Region",
      company: "Pacific Silk Consulting",
      bio: "Jorge manages the China side of every engagement — supplier conversations, factory visits, production holds. He is the reason problems get caught before they reach you.",
      photo: "/team/jorgev-villalonga-jr.png",
      placeholder: false,
    },
    {
      name: "Jorge Villalonga Fuster",
      title: "Head of Europe Region",
      company: "Pacific Silk Consulting",
      bio: "Co-founder of PSC. Jorge runs the European client relationship, drawing on decades of cross-border business between Spain and China.",
      photo: "/team/jorge-villalonga-sr.png",
      placeholder: false,
    },
    {
      name: "顾朱挺 — James Gu",
      title: "CEO",
      company: "Sun Port Logistics (SPL)",
      bio: "James spent over a decade at COSCO Shipping before building SPL. He runs the freight, customs, and delivery side of every PSC project — from China's ports to your door.",
      photo: "/team/james.png",
      placeholder: false,
    },
    {
      name: "企鹅 — Freud Mao",
      title: "CEO",
      company: "Lance Trade",
      bio: "Freud has been inside China's factory ecosystem for over twenty years. He knows which suppliers deliver and which ones promise. Lance Trade is built on those relationships.",
      photo: "/team/freud.png",
      placeholder: false,
    },
  ],
  carousel: {
    sectionLabel: "In our own words",
    items: [
      {
        kind: "testimonial",
        id: "jorge-jr",
        label: "Head of Asia Region",
        quote:
          "The factory floor is where you find out what a supplier is actually capable of. I’ve been in enough of them to know what to look for — and what to walk away from.",
        name: "Jorge Villalonga Moragues",
        title: "Pacific Silk Consulting",
        photo: "/testimonials/factory-floor.jpg",
      },
      {
        kind: "testimonial",
        id: "jorge-sr",
        label: "Head of Europe Region",
        quote:
          "We kept seeing the same problem: every time a company mentioned China, the conversation shifted. Uncertainty. Complexity. Risk. We knew those problems were solvable. We built PSC to solve them.",
        name: "Jorge Villalonga Fuster",
        title: "Pacific Silk Consulting",
        photo: "/testimonials/shipping-documents.jpg",
      },
      {
        kind: "reflection",
        id: "shenzhen-2023",
        label: "Shenzhen, 2023",
        quote:
          "You walk a factory floor at 6am and you understand everything. The machines don’t lie. The workers don’t lie. The dust tells you how long they’ve been running.",
      },
      {
        kind: "reflection",
        id: "on-trust",
        label: "On trust",
        quote:
          "In China, relationships precede contracts. The supplier who calls you back on a Saturday is the one who actually wants the business. We know which ones make that call.",
      },
      {
        kind: "reflection",
        id: "on-speed",
        label: "On speed",
        quote:
          "A factory that moves fast does so because someone on the ground is holding them accountable. Speed is not a factory trait. It’s a management trait.",
      },
    ],
  },
  alliance: {
    headline: "Three companies. One operation.",
    body: "Most firms advise. We execute. PSC is the international face of a three-company joint venture — Pacific Silk Consulting, SPL, and Lance Trade. When you hire us, you access all three through a single contract.",
    companies: [
      {
        name: "Pacific Silk Consulting",
        role: "International consulting, strategy & client relations",
        logo: "psc-horizontal-white",
        image: "/images/alliance/psc.jpeg",
      },
      {
        name: "SPL",
        role: "Logistics, shipping, customs & warehousing",
        logo: "spl-reversed",
        logoClassName: "brightness-0 invert",
        image: "/images/alliance/spl.jpeg",
      },
      {
        name: "Lance Trade",
        role: "Sourcing, supplier vetting & production management",
        logo: "lance-reversed",
        image: "/images/alliance/lance.jpeg",
      },
    ],
  },
  chinaFoothold: {
    label: "China",
    headline: "Our foothold in China",
    body: "Our team on the ground, talking to factories every day. Every China project runs through our headquarters in Ningbo, with offices in Shanghai and Hangzhou.",
    mapLabel: "Map of China with our headquarters in Ningbo and offices in Shanghai and Hangzhou",
    hqLabel: "HQ",
    officesLabel: "Offices",
    hq: { name: "Ningbo", lat: 29.87, lng: 121.55, labelSide: "right", labelDy: 30 },
    offices: [
      { name: "Shanghai", lat: 31.23, lng: 121.47, labelSide: "right", labelDy: -16 },
      { name: "Hangzhou", lat: 30.27, lng: 120.15, labelSide: "left", labelDy: 6 },
    ],
    actions: [
      { label: "Start a project here", href: "/start" },
      { label: "Join us", href: `mailto:${startContent.emailAddress}` },
    ],
  },
  presence: {
    label: "Where we are",
    headline: "Pacific Silk, country by country",
    chipsLabel: "Choose a country",
    globeLabel: "Map of the countries where we work, with the selected one highlighted",
    hqLabel: "HQ",
    servicesLink: "Discover our services in {country}",
    servicesTitle: "Our services in {country}",
    expandLabel: "Show our services in this country",
    backLabel: "All countries",
    servicesHeading: "What we handle in {country}",
    representativeLabel: "Your contact in {country}",
    // TEMPLATE: Jorge stands in until each country has its own representative.
    representative: {
      name: "Jorge Villalonga Moragues",
      title: "Head of Asia Region",
      company: "Pacific Silk Consulting",
      bio: "Jorge manages the China side of every engagement — supplier conversations, factory visits, production holds. He is the reason problems get caught before they reach you.",
      photo: "/team/jorgev-villalonga-jr.png",
    },
    countries: [
      // DRAFT services and intros below: replace with the real ones per country.
      {
        id: "spain",
        chip: "Spain",
        name: "Spain",
        title: "Pacific Silk Spain",
        body: "Your first conversation can happen here, in Spanish, with a team that knows your market.",
        hqCity: "Palma de Mallorca",
        servicesIntro: "Our European headquarters. Spanish companies brief us here, in Spanish, and we run the China side for them.",
        services: [
          "Supplier search and factory visits in China",
          "Samples checked before you pay",
          "Price and contract negotiation in Chinese",
          "Production checks before goods leave the factory",
          "Shipping, customs and delivery to Spain",
        ],
        actions: [{ label: "Start a project here", href: "/start" }, { label: "Join us", href: `mailto:${startContent.emailAddress}` }],
      },
      {
        id: "peru",
        chip: "Peru",
        name: "Peru",
        title: "Pacific Silk Peru",
        body: "Your first conversation can happen here, in Spanish, with a team that knows your market.",
        hqCity: "Lima",
        servicesIntro: "Our regional office for Peru, with support for projects across Latin America.",
        services: [
          "Supplier search and validation in China",
          "Samples checked before you commit",
          "Freight into Callao and customs clearance",
          "Local follow-up in Spanish",
        ],
        actions: [{ label: "Start a project here", href: "/start" }, { label: "Join us", href: `mailto:${startContent.emailAddress}` }],
      },
      {
        id: "mexico",
        chip: "Mexico",
        name: "Mexico",
        title: "Pacific Silk Mexico",
        body: "Your first conversation can happen here, in Spanish, with a team that knows your market.",
        hqCity: "Mexico City",
        servicesIntro: "For Mexican importers and manufacturers buying from China, in Spanish, from first quote to delivery.",
        services: [
          "Supplier search and factory visits in China",
          "Samples and quality checks before shipping",
          "Negotiation in Chinese",
          "Sea freight and customs into Mexico",
        ],
        actions: [{ label: "Start a project here", href: "/start" }, { label: "Join us", href: `mailto:${startContent.emailAddress}` }],
      },
      {
        id: "italy",
        chip: "Italy",
        name: "Italy",
        title: "Pacific Silk Italy",
        body: "Your first conversation can happen here, in Italian, with a team that knows your market.",
        hqCity: "Rome",
        servicesIntro: "Italian manufacturers and brands work with us in Italian, with one contact for the whole China operation.",
        services: [
          "Supplier search for components and finished goods",
          "Factory audits before you sign",
          "Samples and quality checks in China",
          "Shipping and customs into Italy",
        ],
        actions: [{ label: "Start a project here", href: "/start" }, { label: "Join us", href: `mailto:${startContent.emailAddress}` }],
      },
      {
        id: "panama",
        chip: "Panama",
        name: "Panama",
        title: "Pacific Silk Panama",
        body: "Your first conversation can happen here, in Spanish, with a team that knows your market.",
        hqCity: "Panama City",
        servicesIntro: "Panama connects China with the Americas. We use it to move and consolidate goods for clients across the region.",
        services: [
          "Supplier search and factory visits in China",
          "Cargo consolidation through Panama",
          "Freight coordination for Central and South America",
          "Customs paperwork at origin and destination",
        ],
        actions: [{ label: "Start a project here", href: "/start" }, { label: "Join us", href: `mailto:${startContent.emailAddress}` }],
      },
      {
        id: "more",
        chip: "More countries",
        title: "The network keeps growing",
        body: "It grows country by country. Want Pacific Silk where you are?",
        actions: [{ label: "Tell us about your country", href: "/start" }],
      },
    ],
  },
  joinNetwork: {
    label: "The network",
    headline: "From client to collaborator",
    path: ["Client", "Collaborator", "Network"],
    tiles: [
      {
        title: "Become a collaborator",
        body: "For clients who have worked with us on projects and want to grow with the network.",
        action: { label: "Apply", href: "/start" },
      },
      {
        title: "Offer your services",
        body: "For providers who want to be part of projects in their own country.",
        action: { label: "Introduce yourself", href: `mailto:${startContent.emailAddress}` },
      },
    ],
    footnote: "Handled country by country. No terms are published here.",
  },
  finalCta: {
    headline: "Ready to put us to work?",
    body: "Tell us what you need. We'll tell you what's possible.",
    cta: { label: "Start a project", href: "/start" },
  },
};
