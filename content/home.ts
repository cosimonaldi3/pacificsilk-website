import { BOOKING_URL } from "@/content/start";
import type { LogoVariant } from "@/components/Logo";

export interface CtaLink {
  label: string;
  href: string;
}

export interface HeroContent {
  /* Text eyebrow, or a logo variant shown in its place */
  eyebrow?: string;
  logo?: LogoVariant;
  headline: string;
  subheadline: string;
  cta: CtaLink;
  secondaryCta?: CtaLink;
}

/* Used by ProcessPreview (no longer on the homepage) */
export interface ProcessContent {
  label: string;
  headline: string;
  steps: Array<{ number: string; title: string; body: string }>;
  cta: CtaLink;
}

/* ---------- Journey: five stages on one thread ---------- */

export interface JourneyStageBase {
  label: string;
  title: string;
  body: string;
}

export interface JourneyContent {
  label: string;
  headline: string;
  local: JourneyStageBase & {
    chatName: string;
    chatStatus: string;
    messages: { from: "you" | "team"; text: string }[];
  };
  china: JourneyStageBase & {
    factoryLabel: string;
    factoryNote: string;
    relayLabel: string;
    relayNote: string;
  };
  project: JourneyStageBase & {
    routes: { name: string; line: string }[];
  };
  ladder: JourneyStageBase & {
    steps: string[];
  };
  network: JourneyStageBase & {
    path: string[];
    networkLabel: string;
  };
}

/* ---------- Benefits ---------- */

export interface BenefitsContent {
  label: string;
  lead: { title: string; body: string; image: string; imageAlt: string };
  /* Four items; each gets its own animated glyph, in this order:
     language, quality, friction, network */
  items: { title: string; body: string }[];
}

/* ---------- Comparison ---------- */

export interface ComparisonContent {
  label: string;
  headline: string;
  note: string;
  /* Exactly three: doing it yourself, a chain of intermediaries, Pacific Silk */
  columns: { title: string; sub: string }[];
  rows: { label: string; values: [string, string, string] }[];
}

/* ---------- Project Builder ---------- */

export interface BuilderOption {
  id: string;
  label: string;
}

export interface BuilderContent {
  label: string;
  headline: string;
  modes: { guided: string; manual: string };
  questions: {
    type: { question: string; options: BuilderOption[] };
    today: { question: string; options: BuilderOption[] };
    dest: { question: string; placeholder: string };
    worry: { question: string; options: BuilderOption[] };
  };
  groups: { title: string; services: BuilderOption[] }[];
  /* Service always recommended once the visitor answers anything */
  firstService: string;
  /* Option id → service ids. Edit freely: no component change needed. */
  map: {
    type: Record<string, string[]>;
    today: Record<string, string[]>;
    worry: Record<string, string[]>;
  };
  blueprintTitle: string;
  /* {pct} and {n} are replaced at runtime */
  progressLabel: string;
  selectedLabel: string;
  selectedLabelOne: string;
  destinationLabel: string;
  emptyGuided: string;
  emptyManual: string;
  quote: CtaLink;
  call: CtaLink;
  send: { label: string; email: string; subject: string; intro: string };
}

export interface FinalCtaContent {
  headline: string;
  body: string;
  cta: CtaLink;
  secondary?: CtaLink[];
}

export interface HomeContent {
  hero: HeroContent;
  journey: JourneyContent;
  benefits: BenefitsContent;
  comparison: ComparisonContent;
  builder: BuilderContent;
  finalCta: FinalCtaContent;
}

export const homeContent: HomeContent = {
  hero: {
    logo: "psc-horizontal-white",
    headline: "The bridge between China\nand your market.",
    subheadline: "One language. One team. You never deal with the Chinese side.",
    cta: { label: "Build your project path", href: "#builder" },
    secondaryCta: { label: "See how it works", href: "#journey" },
  },
  journey: {
    label: "How it works",
    headline: "One path, from your country to China and back.",
    local: {
      label: "Your country",
      title: "Start with a local team",
      body: "Your project begins in your language, with people near you. From the first conversation to delivery, this is the only team you talk to.",
      chatName: "Your project lead",
      chatStatus: "Replies in your language",
      messages: [
        { from: "you", text: "We need 2,000 units of our cotton tote by spring." },
        { from: "team", text: "Understood. We'll shortlist three factories and come back with samples." },
      ],
    },
    china: {
      label: "China",
      title: "China, handled for you",
      body: "Our team in China speaks to the factories in Chinese, understands how they really work, and brings everything back to you in your own language.",
      factoryLabel: "Factory note",
      factoryNote: "样品周五寄出，大货交期 35 天。",
      relayLabel: "What you read",
      relayNote: "Samples ship Friday. Production takes 35 days.",
    },
    project: {
      label: "Your project",
      title: "Whatever the project, same path",
      body: "Start with what you need. The model stays the same.",
      routes: [
        { name: "Individual project", line: "One product, one need, one clear route." },
        { name: "Cooperation", line: "Work together with partners in China and in your market." },
        { name: "Investment", line: "Back projects with a team that can run them on the ground." },
        { name: "Cluster or association", line: "One group, one project, shared." },
      ],
    },
    ladder: {
      label: "Growth",
      title: "Grow with your project",
      body: "As the project deepens, the same team keeps supporting you, taking the friction out of doing business with China.",
      steps: ["Individual project", "Cooperation", "Joint venture", "New markets"],
    },
    network: {
      label: "The network",
      title: "From client to collaborator",
      body: "After a few projects together, you can join us as a collaborator and become part of a worldwide network of project accelerator clusters.",
      path: ["Client", "Collaborator", "Network"],
      networkLabel: "A verified network, both ends",
    },
  },
  benefits: {
    label: "What you get by working this way",
    lead: {
      title: "One language. One team. Zero dealing with China.",
      body: "You speak with your own team, in your own language. We handle the Chinese side: the factories, the negotiation, the follow-up.",
      image: "/images/home/shanghai-skyline.jpg",
      imageAlt: "Shanghai skyline across the Huangpu river",
    },
    items: [
      { title: "Factories, understood", body: "We speak Chinese with them and relay it clearly." },
      { title: "Same standard at both ends", body: "Checked in China and again when the goods arrive." },
      { title: "Less friction, fewer surprises", body: "We absorb the advisory, import and logistics work." },
      { title: "A network that grows with you", body: "Start as a client, go deeper, join the network." },
    ],
  },
  comparison: {
    label: "Why it works",
    headline: "Three ways to do it.",
    note: "Typical patterns, side by side.",
    columns: [
      { title: "Doing it yourself", sub: "You to the factory, alone" },
      { title: "A chain of intermediaries", sub: "You, then layer after layer" },
      { title: "Pacific Silk", sub: "You, one team on both ends" },
    ],
    rows: [
      { label: "Who you deal with", values: ["Factories directly, alone", "A chain of agents and distributors", "One team, in your language"] },
      { label: "Language and culture", values: ["You bridge it yourself", "Lost at each handoff", "Handled on both ends"] },
      { label: "Trust and verification", values: ["You verify from far away", "Each layer checks only its own part", "Verified at source and on arrival"] },
      { label: "Quality", values: ["Checked only if you can travel", "Depends on who is paid to check", "Same standard at both ends"] },
      { label: "Accountability", values: ["Entirely yours", "Spread across layers, easy to lose", "One team, end to end"] },
      { label: "What you see", values: ["Only what you can reach", "Filtered by each layer", "Direct, clear, in your language"] },
    ],
  },
  builder: {
    label: "Project Builder",
    headline: "Build your project and see what you need.",
    modes: { guided: "Help me find it", manual: "I know what I need" },
    questions: {
      type: {
        question: "What kind of project is it?",
        options: [
          { id: "individual", label: "Individual project" },
          { id: "cooperation", label: "Cooperation" },
          { id: "investment", label: "Investment" },
          { id: "cluster", label: "Cluster or association" },
        ],
      },
      today: {
        question: "Where are you today?",
        options: [
          { id: "idea", label: "I have an idea" },
          { id: "specs", label: "I have specs" },
          { id: "supplier", label: "I have a supplier" },
          { id: "importing", label: "I already import" },
        ],
      },
      dest: { question: "Where does it end?", placeholder: "Destination country" },
      worry: {
        question: "What worries you most?",
        options: [
          { id: "language", label: "Language" },
          { id: "trust", label: "Trust" },
          { id: "quality", label: "Quality" },
          { id: "logistics", label: "Logistics" },
        ],
      },
    },
    groups: [
      {
        title: "Find and validate",
        services: [
          { id: "definition", label: "Project definition (free)" },
          { id: "feasibility", label: "Feasibility and advisory" },
          { id: "search", label: "Supplier search and validation" },
          { id: "verification", label: "Supplier verification" },
          { id: "matching", label: "Partner matching" },
        ],
      },
      {
        title: "Produce and check",
        services: [
          { id: "negotiation", label: "Negotiation in Chinese" },
          { id: "followup", label: "Production follow-up" },
          { id: "inspection", label: "Quality inspection" },
        ],
      },
      {
        title: "Move and support",
        services: [
          { id: "shipping", label: "Shipping and customs" },
          { id: "destination", label: "Destination support" },
          { id: "coordination", label: "Group coordination" },
          { id: "assessment", label: "Project assessment" },
        ],
      },
    ],
    firstService: "definition",
    map: {
      type: {
        individual: [],
        cooperation: ["matching"],
        investment: ["assessment"],
        cluster: ["coordination"],
      },
      today: {
        idea: ["feasibility"],
        specs: ["search", "negotiation"],
        supplier: ["verification", "followup"],
        importing: ["inspection", "shipping", "destination"],
      },
      worry: {
        language: ["negotiation"],
        trust: ["verification"],
        quality: ["inspection"],
        logistics: ["shipping", "destination"],
      },
    },
    blueprintTitle: "Your blueprint",
    progressLabel: "Blueprint {pct}% complete",
    selectedLabel: "{n} services selected",
    selectedLabelOne: "1 service selected",
    destinationLabel: "Destination",
    emptyGuided: "Answer a question and your recommended services appear here.",
    emptyManual: "Pick the services you need.",
    quote: { label: "Get a quote", href: "/start" },
    call: { label: "Book a call", href: BOOKING_URL },
    send: {
      label: "Send this to my team",
      email: "",
      subject: "Our China project blueprint",
      intro: "Here is the project blueprint from Pacific Silk:",
    },
  },
  finalCta: {
    headline: "Tell us what you need.\nWe'll show you the path.",
    body: "No commitment. No pop-ups. Just a clear first proposal.",
    cta: { label: "Build your project path", href: "#builder" },
    secondary: [
      { label: "Book a call", href: BOOKING_URL },
      { label: "Join the network", href: "/about#network" },
    ],
  },
};
