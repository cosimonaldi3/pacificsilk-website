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
  leadership?: boolean;
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
  | "peru";

export interface PresenceCountry {
  id: PresenceCountryId;
  chip: string;
  title: string;
  body: string;
  actions: PresenceAction[];
  /* Country name for the map label and "{country}" in the services strings. */
  name?: string;
  /* One line shown in the country card, inviting the visitor to open this country */
  teaser?: string;
  /* Short operational insights shown under the teaser in the country card */
  insights?: string[];
  hqCity?: string;
  servicesIntro?: string;
  services?: string[];
  /* The person shown on the country page. Falls back to PresenceContent.representative.
     null hides the contact block on this country's page. */
  representative?: PresenceRepresentative | null;
}

export interface PresenceRepresentative {
  name: string;
  title: string;
  company: string;
  bio: string;
  photo: string;
}

/* The network view: what shows when no country is selected (the default state).
   Clicking the active country again returns here. */
export interface PresenceNetwork {
  title: string;
  body: string;
  actions: PresenceAction[];
}

export interface PresenceContent {
  label: string;
  headline: string;
  chipsLabel: string;
  /** Last chip in the filter; shows the China panel instead of a country */
  chinaChip: string;
  /** Shown when no country is selected */
  network: PresenceNetwork;
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
  /* Invitation line shown in the China panel's box */
  teaser: string;
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
    peopleLabel: string;
    peopleSubtitle: string;
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
    title: "About — Pacific Silk Group",
    description:
      "The people and story behind Pacific Silk Group and the Pacific Silk Alliance.",
  },
  story: {
    label: "Who we are",
    peopleLabel: "People",
    peopleSubtitle: "Our network around the world",
  },
  team: [
    {
      name: "Jorge Villalonga Moragues",
      title: "Manager Pacific Silk Group",
      company: "Pacific Silk Group",
      bio: "Jorge manages the China side of every engagement — supplier conversations, factory visits, production holds. He is the reason problems get caught before they reach you.",
      photo: "/team/jorgev-villalonga-jr.webp",
      placeholder: false,
    },
    {
      name: "Jorge Villalonga Fuster",
      title: "Co-founder and Head of Europe",
      company: "Pacific Silk Group",
      bio: "Co-founder of PS. Jorge runs the European client relationship, drawing on decades of cross-border business between Spain and China.",
      photo: "/team/jorge-villalonga-sr.webp",
      placeholder: false,
      leadership: true,
    },
    {
      name: "顾朱挺 — James Gu",
      title: "Co-founder and Head of China",
      company: "Pacific Silk Group",
      bio: "James spent over a decade at COSCO Shipping before building SPL. He runs our China operations and specializes in the freight, customs, and delivery side of every project.",
      photo: "/team/james.webp",
      placeholder: false,
      leadership: true,
    },
    {
      name: "企鹅 — Freud Mao",
      title: "Head of China Trading Pacific Silk",
      company: "Pacific Silk China",
      bio: "Freud has been inside China's factory ecosystem for over twenty years. He knows which suppliers deliver and which ones promise. Lance Trade is built on those relationships.",
      photo: "/team/freud.webp",
      placeholder: false,
    },
    {
      name: "Nicolás Robledo",
      title: "Representative for Pacific Silk Group in Mexico",
      company: "Pacific Silk Mexico",
      bio: "Nicolás has deep knowledge of the agro-industrial and sugar sector in Mexico. His experience adds value to projects tied to that market and its supply chain.",
      photo: "/team/nicolas-robledo.webp",
      placeholder: false,
    },
    {
      name: "Cosimo Naldi",
      title: "Representative for Pacific Silk Group in Italy",
      company: "Pacific Silk Italy",
      bio: "Cosimo combines an international business education with a strong technology focus. His strength is process optimization and the use of digital tools and automation.",
      photo: "/team/cosimo-naldi.webp",
      placeholder: false,
    },
    {
      name: "Lorena Hortal",
      title: "Representative for Pacific Silk Group in Spain",
      company: "Pacific Silk Spain",
      bio: "Lorena's main strength is direct knowledge of the Chinese market. Working from China, Lorena understands the business culture and the way local suppliers work, which gives every project security and continuity. The focus is textiles and related industries.",
      photo: "/team/lorena-hortal.webp",
      placeholder: false,
    },
    {
      name: "José Luis Gralla",
      title: "Representative for Pacific Silk Group in Panama",
      company: "Pacific Silk Panama",
      bio: "José Luis brings broad business leadership experience and a strong network of contacts across Latin America, especially in Panama and Mexico. This gives strategic backing to international operations between markets.",
      photo: "/team/jose-luis-gralla.webp",
      placeholder: false,
    },
  ],
  carousel: {
    sectionLabel: "In our own words",
    items: [
      {
        kind: "testimonial",
        id: "jorge-jr",
        label: "Manager Pacific Silk Group",
        quote:
          "The factory floor is where you find out what a supplier is actually capable of. I’ve been in enough of them to know what to look for — and what to walk away from.",
        name: "Jorge Villalonga Moragues",
        title: "Pacific Silk Group",
        photo: "/testimonials/factory-floor.jpg",
      },
      {
        kind: "testimonial",
        id: "jorge-sr",
        label: "Head of Europe Region",
        quote:
          "We kept seeing the same problem: every time a company mentioned China, the conversation shifted. Uncertainty. Complexity. Risk. We knew those problems were solvable. We built PS to solve them.",
        name: "Jorge Villalonga Fuster",
        title: "Pacific Silk Group",
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
    body: "Most firms advise. We execute. PS is the international face of a three-company joint venture — Pacific Silk Group, SPL, and Lance Trade. When you hire us, you access all three through a single contract.",
    companies: [
      {
        name: "Pacific Silk Group",
        role: "International strategy & client relations",
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
    teaser: "Our offices and factory visits sit inside China. We negotiate on the ground, not over email.",
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
    chinaChip: "China",
    // DRAFT network copy: placeholder until the real network text is written
    network: {
      title: "The network keeps growing",
      body: "It grows country by country. Want Pacific Silk where you are?",
      actions: [{ label: "Tell us about your country", href: "/start" }],
    },
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
      title: "Manager Pacific Silk Group",
      company: "Pacific Silk Group",
      bio: "Jorge manages the China side of every engagement — supplier conversations, factory visits, production holds. He is the reason problems get caught before they reach you.",
      photo: "/team/jorgev-villalonga-jr.webp",
    },
    countries: [
      // DRAFT services and intros below: replace with the real ones per country.
      {
        id: "spain",
        chip: "Spain",
        name: "Spain",
        teaser: "Brief us in Spanish. We run the China side, from first quote to the port in Spain.",
        representative: {
          name: "Jorge Villalonga Fuster",
          title: "Co-founder and Head of Europe",
          company: "Pacific Silk Group",
          bio: "Co-founder of PS. Jorge runs the European client relationship, drawing on decades of cross-border business between Spain and China.",
          photo: "/team/jorge-villalonga-sr.webp",
        },
        insights: [
          "Spanish buyers brief us in Spanish. We put your questions to the factory in Chinese, so nothing gets lost in translation.",
          "Samples are checked before you pay the deposit, so you approve the product before the money moves.",
          "Your goods are checked at the factory before they leave China, so problems show up in Spain, not at the port.",
        ],
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
        teaser: "Your project followed in Spanish, from suppliers in China to Callao and customs in Lima.",
        representative: null,
        insights: [
          "Callao receives most of Peru's sea cargo. We route your goods there and plan the customs clearance before the ship arrives.",
          "Documents are ready at origin, so the port in Peru has nothing to hold up.",
          "You follow the whole project in Spanish, from the first supplier call to the release of your goods.",
        ],
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
        teaser: "For importers buying from China, in Spanish. From first quote to delivery in Mexico.",
        representative: {
          name: "Nicolás Robledo",
          title: "Representative for Pacific Silk Group in Mexico",
          company: "Pacific Silk Mexico",
          bio: "Nicolás has deep knowledge of the agro-industrial and sugar sector in Mexico. His experience adds value to projects tied to that market and its supply chain.",
          photo: "/team/nicolas-robledo.webp",
        },
        insights: [
          "We choose the Mexican port that fits your delivery date, from Manzanillo to Veracruz, instead of the one that is simply closest.",
          "Importers talk to us in Spanish. We handle the Chinese side in Chinese, from price talks to production checks.",
          "Customs paperwork is ready before the goods leave the factory, so the border is a formality, not a delay.",
        ],
        title: "Pacific Silk Mexico",
        body: "Your first conversation can happen here, in Spanish, with a team that knows your market.",
        hqCity: "Monterrey",
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
        teaser: "Italian makers get one contact for the whole China operation. Samples checked before you sign.",
        insights: [
          "Small runs of many products are hard to place with a factory alone. We group orders so the minimums stop getting in the way.",
          "Factory audits happen before you sign, not after a bad shipment.",
          "One Italian-speaking contact owns the whole China operation, from first sample to customs in Italy.",
        ],
        title: "Pacific Silk Italy",
        body: "Your first conversation can happen here, in Italian, with a team that knows your market.",
        hqCity: "Milan",
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
        teaser: "Panama connects China with the Americas. We consolidate cargo here and move it across the region.",
        representative: {
          name: "José Luis Gralla",
          title: "Representative for Pacific Silk Group in Panama",
          company: "Pacific Silk Panama",
          bio: "José Luis brings broad business leadership experience and a strong network of contacts across Latin America, especially in Panama and Mexico. This gives strategic backing to international operations between markets.",
          photo: "/team/jose-luis-gralla.webp",
        },
        insights: [
          "Goods from several Chinese suppliers can be combined into one container in Panama, so you pay for one shipment, not five.",
          "The canal route reaches both coasts of the Americas, so one hub serves many markets.",
          "One contact coordinates freight for Central and South America, from the factory gate to the final destination.",
        ],
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
