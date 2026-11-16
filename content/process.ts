import type { FinalCtaContent } from "@/content/home";
import type { CapabilityTileBase } from "@/content/capabilities";

export interface ProcessStage {
  name: string;
  /* When the stage runs, e.g. "Until the right partner is selected" */
  span: string;
  local: string;
  china: string;
  youGet: string;
  youDecide: string;
}

/* Stage 1 (Define) is shown as a bento grid of animated tiles, in the capabilities style.
   Sample labels only: no client names and no invented figures. */
export interface DefineContent {
  intro: string;
  expandLabel: string;
  closeLabel: string;
  insight: CapabilityTileBase & {
    cardTitle: string;
    legendHub: string;
    legendRegion: string;
    cities: { shenzhen: string; shanghai: string };
    products: { electronics: string; machinery: string; textiles: string; footwear: string; tea: string };
  };
  opportunity: CapabilityTileBase & { center: string; chips: string[] };
  cost: CapabilityTileBase & { cardTitle: string; segments: string[]; note: string };
  growth: CapabilityTileBase & { steps: string[] };
  trip: CapabilityTileBase & {
    cardTitle: string;
    items: string[];
    globe: { from: string; to: string; status: string };
  };
}

export interface ProcessPageContent {
  meta: { title: string; description: string };
  intro: { label: string; headline: string; subline: string; image: string; imageAlt: string };
  lanes: {
    label: string;
    headline: string;
    localLabel: string;
    localSub: string;
    chinaLabel: string;
    chinaSub: string;
    hint: string;
  };
  detail: {
    label: string;
    cards: { local: string; china: string; youGet: string; youDecide: string };
  };
  /* Exactly four: Define, Validate, Execute, Beyond */
  stages: ProcessStage[];
  define: DefineContent;
  finalCta: FinalCtaContent;
}

export const processContent: ProcessPageContent = {
  meta: {
    title: "Process — Pacific Silk Group",
    description:
      "From idea to delivery in four stages. Two teams work side by side, one in your country and one in China. You only talk to one.",
  },
  intro: {
    label: "Process",
    headline: "From idea to delivery.",
    subline: "Four stages. Two teams working side by side. One team talking to you.",
    image: "/images/home/process-bridge.jpg",
    imageAlt: "A long sea bridge curving toward a distant suspension bridge at sunset",
  },
  lanes: {
    label: "Two teams, one path",
    headline: "Your country and China, moving together.",
    localLabel: "Local",
    localSub: "Your country team",
    chinaLabel: "China",
    chinaSub: "Our team on the ground",
    hint: "Select a stage to see who does what.",
  },
  detail: {
    label: "Stage detail",
    cards: {
      local: "Your country team",
      china: "China team",
      youGet: "You get",
      youDecide: "You decide",
    },
  },
  stages: [
    {
      name: "Define",
      span: "From zero to a go or no-go decision",
      local: "Listens and scopes your project in your language.",
      china: "Checks on the ground what the factories can really do.",
      youGet: "A clear scope and a first proposal.",
      youDecide: "Whether to go ahead. Nothing moves before you say so.",
    },
    {
      name: "Validate",
      span: "Until the right partner is selected",
      local: "Keeps you informed in your language and aligns the project with what your market requires.",
      china: "Finds candidates, negotiates in Chinese, visits and validates.",
      youGet: "A validated partner and the information to decide.",
      youDecide: "The partner and the samples.",
    },
    {
      name: "Execute",
      span: "From order to shipment",
      local: "Prepares the destination side: documents, customs and reception.",
      china: "Follows production, checks quality and prepares the shipment.",
      youGet: "Production followed and checked, shipment with the paperwork in order.",
      youDecide: "The go-ahead before anything ships.",
    },
    {
      name: "Beyond",
      span: "Delivery and the next project",
      local: "Receives and checks the goods on arrival, and supports delivery and import questions.",
      china: "Keeps the relationship with the maker ready for the next order.",
      youGet: "Goods checked on arrival and a team ready for the next project.",
      youDecide: "What comes next.",
    },
  ],
  define: {
    intro:
      "You talk to people from our network in your region, with local and industry knowledge. Together you see what your project can reach by working in or with China.",
    expandLabel: "Show details",
    closeLabel: "Hide details",
    insight: {
      title: "Insight on your market in China",
      body: "Which products China makes, how strong each industry is and where it is. Explained by people with local and industry knowledge, in your language.",
      link: { label: "Start a project", href: "/start" },
      cardTitle: "Where China makes it",
      legendHub: "Major hub",
      legendRegion: "Regional cluster",
      cities: { shenzhen: "Shenzhen", shanghai: "Shanghai" },
      products: { electronics: "Electronics", machinery: "Machinery", textiles: "Textiles", footwear: "Footwear", tea: "Tea" },
    },
    opportunity: {
      title: "Business opportunities",
      body: "What your project can reach with China: the products, the partners and the markets it opens up.",
      link: { label: "Start a project", href: "/start" },
      center: "Your project",
      chips: ["Products", "Partners", "Markets"],
    },
    cost: {
      title: "Transparent costs",
      body: "A clear breakdown of what the project will cost before you commit: product, production, freight and duties.",
      link: { label: "Start a project", href: "/start" },
      cardTitle: "Cost breakdown",
      segments: ["Product", "Production", "Freight", "Duties"],
      note: "Every line explained",
    },
    growth: {
      title: "How it can grow",
      body: "See the path from a first project to cooperation, joint ventures and new markets.",
      link: { label: "Start a project", href: "/start" },
      steps: ["Individual project", "Cooperation", "Joint venture", "New markets"],
    },
    trip: {
      title: "Prospection trip",
      body: "Travel to China with us: meet the people and see the places that matter before you decide.",
      link: { label: "Start a project", href: "/start" },
      cardTitle: "Trip plan",
      items: ["Meet the people", "Visit the sites", "See it working"],
      globe: { from: "Your country", to: "China", status: "Trip planned" },
    },
  },
  finalCta: {
    headline: "See what your path would look like.",
    body: "Answer four questions and get a first view of your project. Free, no commitment.",
    cta: { label: "Build your project path", href: "/#builder" },
    secondary: [{ label: "Start a project", href: "/start" }],
  },
};
