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

export interface PresenceCountry {
  id: "spain" | "peru" | "china" | "more";
  chip: string;
  title: string;
  body: string;
  actions: PresenceAction[];
}

export interface PresenceContent {
  label: string;
  headline: string;
  chipsLabel: string;
  globeLabel: string;
  countries: PresenceCountry[];
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
    headline: string;
    body: string;
  };
  team: TeamMember[];
  carousel: { sectionLabel: string; items: CarouselItem[] };
  alliance: AllianceContent;
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
    headline: "Built for the complexity\nof China.",
    body: "For most international companies, the word 'China' triggers the same reaction: uncertainty. Wrong suppliers. Quality problems. Logistics delays. Communication breakdowns. We built PSC to eliminate all of it — not with advice, but with an operation.",
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
  presence: {
    label: "Where we are",
    headline: "Pacific Silk, country by country",
    chipsLabel: "Choose a country",
    globeLabel: "Globe showing the selected country",
    countries: [
      {
        id: "spain",
        chip: "Spain",
        title: "Pacific Silk Spain",
        body: "Your first conversation can happen here, in Spanish, with a team that knows your market.",
        actions: [{ label: "Start a project here", href: "/start" }],
      },
      {
        id: "peru",
        chip: "Peru",
        title: "Pacific Silk Peru",
        body: "Your first conversation can happen here, in Spanish, with a team that knows your market.",
        actions: [{ label: "Start a project here", href: "/start" }],
      },
      {
        id: "china",
        chip: "China",
        title: "Pacific Silk China",
        body: "Our team on the ground, talking to factories every day. Chinese companies and suppliers have their own section.",
        actions: [
          { label: "Go to the Chinese side", href: "/", locale: "zh" },
          { label: "Start a project here", href: "/start" },
        ],
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
