import type { FinalCtaContent } from "@/content/home";
import type { CapabilitiesContent, CapabilityTileBase } from "@/content/capabilities";

export interface ProcessStage {
  name: string;
  /* When the stage runs, e.g. "Until the right partner is selected" */
  span: string;
  local: string;
  china: string;
  youGet: string;
  youDecide: string;
}

/* A Define tile: the shared tile copy plus the points shown when the tile is opened */
export type DefineTileCopy = CapabilityTileBase & { points: string[] };

/* Stage 1 (Define) is shown as a bento grid of animated tiles, in the capabilities style.
   Sample labels only: no client names and no invented figures. */
export interface DefineContent {
  expandLabel: string;
  closeLabel: string;
  insight: DefineTileCopy & {
    cardTitle: string;
    /* Product names are read by screen readers only: the map shows icons without labels */
    products: { electronics: string; machinery: string; textiles: string; footwear: string; tea: string; ceramics: string; batteries: string };
    /* Sample trend lines, no figures: which categories are moving up in China's output */
    trending: { cardTitle: string; note: string };
  };
  opportunity: DefineTileCopy & {
    cardTitle: string;
    /* Fill is the sample level (0-100) of each gauge; the tick marks the minimum that makes sense */
    factors: { label: string; fill: number; tick: number }[];
    tickLabel: string;
    verdict: string;
  };
  /* The contract: fees, structure, timelines and services, stated before you commit */
  cost: DefineTileCopy & { cardTitle: string; terms: { label: string; value: string }[]; note: string };
  /* Saved for the Validate stage: the stacked cost bar (BreakdownVisual). Not shown yet. */
  breakdown: { cardTitle: string; segments: string[]; note: string };
  trip: DefineTileCopy & {
    cardTitle: string;
    items: string[];
    globe: { from: string; to: string; status: string };
    /* Split-flap departures board: one row per city, letters flip into place */
    board: { title: string; cities: string[] };
  };
}

/* Stage 2 (Validate) uses the same bento as Define. The licence, chat, quotation and sample
   values are invented samples: no real company, person, address or registration number. */
export interface LicenceField {
  label: string;
  value: string;
}

export interface ValidateContent {
  expandLabel: string;
  closeLabel: string;
  suppliers: DefineTileCopy & {
    /* A sample Chinese business licence (营业执照), recreated as a mock document */
    licence: {
      /* Read by screen readers instead of the mock document's text */
      srLabel: string;
      title: string;
      copy: string;
      codeLabel: string;
      code: string;
      serial: string;
      /* Left column, then right column, as on the real document */
      left: LicenceField[];
      right: LicenceField[];
      issuerLabel: string;
      issued: string;
      seal: string;
      watermark: string;
      qrNote: string;
    };
  };
  comms: DefineTileCopy & {
    /* hour and minute set the hands of each sample clock */
    clocks: { label: string; time: string; hour: number; minute: number }[];
    senders: { you: string; us: string; factory: string };
    messages: { from: "you" | "us" | "factory"; text: string; zh?: boolean }[];
    note: string;
  };
  logistics: DefineTileCopy & {
    globe: { from: string; to: string; status: string };
  };
  sample: DefineTileCopy;
  quote: DefineTileCopy & {
    cardTitle: string;
    ref: string;
    tag: string;
    rows: LicenceField[];
    price: { label: string; value: string; unit: string };
    total: { label: string; value: string };
    stamp: string;
  };
}

/* Stage 3 (Execute), same bento. Tracking, quality and paperwork reuse the capability tile
   visuals, so their copy has the capabilities shape plus the points for the opened card. */
export interface ExecuteContent {
  expandLabel: string;
  closeLabel: string;
  tracking: CapabilitiesContent["tracking"] & { points: string[] };
  quality: CapabilitiesContent["quality"] & { points: string[] };
  paperwork: CapabilitiesContent["paperwork"] & { points: string[] };
  /* The route sketch: factory, port, ship, port, door. Labels sit under the stops that have one. */
  support: DefineTileCopy & { stops: string[] };
  services: DefineTileCopy & {
    /* The bullet list beside the container sketch */
    items: string[];
    /* The name painted on the container's side */
    containerMark: string;
  };
  issues: DefineTileCopy & {
    cardTitle: string;
    ref: string;
    steps: { status: string; text: string }[];
    note: string;
  };
}

/* Stage 4 (Beyond), same bento. Four pillars, most important first. */
export interface BeyondContent {
  expandLabel: string;
  closeLabel: string;
  /* The repeat order: this year's purchase order on top of the earlier ones, filled in and stamped */
  recurring: DefineTileCopy & {
    poTitle: string;
    /* Tags on the cards behind, oldest first, then the tag on the front card */
    pastTags: string[];
    currentTag: string;
    rows: { label: string; value: string }[];
    stamp: string;
  };
  /* A sketched visitor pass for a fair */
  fairs: DefineTileCopy & { passLabel: string; fairName: string; place: string; sessions: string[] };
  /* The network graph with the roles you can take in it */
  network: DefineTileCopy & { roles: string[] };
  /* Ways into China as rising steps: buying (today) at the bottom, each step deeper in */
  options: DefineTileCopy & { items: string[]; currentLabel: string; deeperLabel: string };
}

export interface ProcessPageContent {
  meta: { title: string; description: string };
  intro: { label: string; headline: string; subline: string; scrollCue: string; image: string; imageAlt: string };
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
  validate: ValidateContent;
  execute: ExecuteContent;
  beyond: BeyondContent;
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
    scrollCue: "Scroll",
    image: "/images/home/process-bridge.jpg",
    imageAlt: "A long concrete sea bridge curving past a coastal city with mountains behind at dusk",
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
    expandLabel: "Show details",
    closeLabel: "Hide details",
    insight: {
      title: "Insight on your market in China",
      body: "Which products China makes, how strong each industry is and where it is. Explained by people with local and industry knowledge, in your language.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "Where each industry is concentrated, province by province",
        "Which categories are growing and which are crowded",
        "What it means for your product, explained in your language",
      ],
      cardTitle: "Where China makes it",
      products: { electronics: "Electronics", machinery: "Machinery", textiles: "Textiles", footwear: "Footwear", tea: "Tea", ceramics: "Ceramics", batteries: "Batteries" },
      trending: { cardTitle: "Trending now", note: "Sample view" },
    },
    opportunity: {
      title: "Does it make sense to work from China?",
      body: "Every project has to pay for itself. We measure your landed savings, your yearly gain and your payback time against a minimum threshold. Clear it and we start. Miss it and we tell you straight, before you spend anything.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "Landed cost compared with what you pay today",
        "Yearly gain and payback time worked out for your volumes",
        "A clear go or no-go before you spend anything",
      ],
      cardTitle: "Project gain check",
      factors: [
        { label: "Landed savings", fill: 78, tick: 55 },
        { label: "Yearly gain", fill: 84, tick: 62 },
        { label: "Payback time", fill: 70, tick: 45 },
      ],
      tickLabel: "Minimum gain to proceed",
      verdict: "Clears the threshold",
    },
    cost: {
      title: "Transparent costs",
      body: "Before you commit, you get one contract. It states our fees, how the work is structured, the timeline of each stage and exactly which services are included. It binds us as much as it binds you.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "Our fees fixed in writing before work starts",
        "A timeline for every stage, from first quote to delivery",
        "Every included service listed. Nothing implied",
      ],
      cardTitle: "Our commitment",
      terms: [
        { label: "Fees", value: "Fixed, in writing" },
        { label: "Structure", value: "One contract, one contact" },
        { label: "Timelines", value: "Set for each stage" },
        { label: "Services", value: "Listed, nothing implied" },
      ],
      note: "Binding once signed",
    },
    breakdown: {
      cardTitle: "Cost breakdown",
      segments: ["Product", "Production", "Freight", "Duties"],
      note: "Every line explained",
    },
    trip: {
      title: "Prospection trip",
      body: "Travel to China with us: meet the people and see the places that matter before you decide.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "We plan the route, the meetings and the factory visits",
        "We travel with you and translate on site",
        "You meet the people and see the work before you decide",
      ],
      cardTitle: "Trip plan",
      items: ["Meet the people", "Visit the sites", "See it working"],
      globe: { from: "Your country", to: "China", status: "Trip planned" },
      board: { title: "Departures", cities: ["Shanghai", "Ningbo", "Shenzhen"] },
    },
  },
  validate: {
    expandLabel: "Show details",
    closeLabel: "Hide details",
    suppliers: {
      title: "Find and verify suppliers",
      body: "We search, shortlist and check every factory: its business licence, its export rights and its floor. In China, the licence tells you whether a factory is a real factory. We read it for you. You only meet the suppliers that pass.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "A shortlist of factories that can make your product",
        "Business licence and export rights checked against the official registry",
        "Factory floor visited by our team before you meet anyone",
      ],
      licence: {
        srLabel: "A sample Chinese business licence, the document that shows a company is registered. All names and numbers are invented.",
        title: "营业执照",
        copy: "（副本）",
        codeLabel: "统一社会信用代码",
        code: "91000000SAMPLE0000X",
        serial: "编号：S000000000000(1-1)",
        left: [
          { label: "名称", value: "示例精密制造有限公司" },
          { label: "类型", value: "有限责任公司（示例）" },
          { label: "法定代表人", value: "张示例" },
          { label: "经营范围", value: "五金制品、电子元件的生产与销售（示例）" },
        ],
        right: [
          { label: "注册资本", value: "壹佰万元（人民币）" },
          { label: "成立日期", value: "2000年01月01日" },
          { label: "营业期限", value: "2000年01月01日 至 长期" },
          { label: "住所", value: "示例工业园区00号" },
        ],
        issuerLabel: "登记机关",
        issued: "2000年01月01日",
        seal: "示例样本 · 仅供展示 ·",
        watermark: "SAMPLE",
        qrNote: "扫描二维码查询",
      },
    },
    comms: {
      title: "Two languages, two time zones",
      body: "We speak your language and we speak Chinese. While you sleep, we are talking to the factory. You wake up to answers, not questions. We understand what you need and what the factory means, and we say it the right way to both.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "One team in your country, one in China, covering both working days",
        "Every message translated and explained, not just passed on",
        "Answers the same day, in your language",
      ],
      clocks: [
        { label: "Your time", time: "09:00", hour: 9, minute: 0 },
        { label: "China time", time: "16:00", hour: 16, minute: 0 },
      ],
      senders: { you: "You", us: "PSC", factory: "Factory" },
      messages: [
        { from: "you", text: "Can the finish be matte black?" },
        { from: "us", text: "表面可以做哑光黑吗？", zh: true },
        { from: "factory", text: "可以，新样品周五寄出。", zh: true },
        { from: "us", text: "Yes. The new sample ships Friday." },
      ],
      note: "Answered the same day",
    },
    logistics: {
      title: "The right route for your goods",
      body: "Sea, rail or air. We compare cost, transit time and risk for your order, and we help you choose the logistics that fit your product, your volumes and your deadline.",
      link: { label: "Estimate a shipment", href: "/tools/shipping-estimate" },
      points: [
        "Sea, rail and air compared for your volumes",
        "Transit time and cost set against your deadline",
        "One route recommended, with the reasons in writing",
      ],
      globe: { from: "China", to: "Your market", status: "Route defined" },
    },
    sample: {
      title: "Define the golden sample",
      body: "Nothing goes to production until a sample matches your spec. We test it for you, point by point. Once you approve it, it becomes the golden sample: every unit made after it is checked against it.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "Samples tested against your spec by our team in China",
        "You approve the sample before anything is produced",
        "The approved sample becomes the standard for production",
      ],
    },
    quote: {
      title: "A quotation you can rely on",
      body: "You leave this stage with a detailed quotation: the FOB price, the product specs, the quantities, the lead time and the terms. Binding, and ready to sign.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "FOB price per unit, fixed in writing",
        "Product specs tied to the approved golden sample",
        "Quantities, lead time, packaging and payment terms stated",
      ],
      cardTitle: "Quotation",
      ref: "Ref. Q-0000",
      tag: "Sample quotation",
      rows: [
        { label: "Product", value: "Aluminium desk lamp, matte black" },
        { label: "Specs", value: "As the approved golden sample" },
        { label: "Order quantity", value: "3,000 units" },
        { label: "Minimum order", value: "1,000 units" },
        { label: "Lead time", value: "35 days after deposit" },
        { label: "Packaging", value: "Retail box, 12 per carton" },
        { label: "Payment", value: "30% deposit, 70% before shipment" },
        { label: "Valid for", value: "30 days" },
      ],
      price: { label: "FOB price", value: "USD 4.20", unit: "per unit, FOB Ningbo" },
      total: { label: "Order total", value: "USD 12,600" },
      stamp: "Binding",
    },
  },
  execute: {
    expandLabel: "Show details",
    closeLabel: "Hide details",
    tracking: {
      title: "Track every project",
      body: "One shared view of where your project stands, what is next and what we need from you. We follow production closely and you see every step as it happens.",
      link: { label: "About the portal", href: "/portal" },
      points: [
        "Every stage of production followed by our team in China",
        "Updates in your language, without having to ask",
        "What we need from you, flagged before it holds anything up",
      ],
      projectLabel: "Sample project",
      steps: ["Define", "Validate", "Produce", "Ship", "Deliver"],
      current: 2,
      updateLabel: "Production check booked",
    },
    quality: {
      title: "Quality, checked on both ends",
      body: "We inspect at the factory before it ships, and again when it lands. One standard, written down, applied twice.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "Inspection at the factory, against the golden sample",
        "A second check when the goods arrive",
        "A written report for every lot",
      ],
      reportTitle: "Inspection report",
      reportRef: "Sample lot",
      checks: ["Dimensions", "Finish", "Packaging", "Labels"],
      passLabel: "Pass",
      chartTitle: "Checks per lot",
      originLabel: "Origin",
      destinationLabel: "Destination",
    },
    paperwork: {
      title: "Paperwork and customs",
      body: "Export papers in China, customs codes and clearance at destination. We prepare it, check it and file it.",
      link: { label: "Find your customs code", href: "/tools/tariff-finder" },
      points: [
        "Export documents prepared and checked in China",
        "The right customs code for your product",
        "Clearance at destination filed for you",
      ],
      docs: ["Packing list", "Commercial invoice", "Customs declaration"],
      stamp: "Cleared",
    },
    support: {
      title: "Adaptable logistics support",
      body: "Depending on the Incoterm you choose and your supply chain capabilities, we support you however you want, thanks to our logistics partners and logistics services.",
      link: { label: "Estimate a shipment", href: "/tools/shipping-estimate" },
      points: [
        "From the factory gate to your door, or any part of it",
        "Your forwarder, ours, or a mix of both",
        "One team coordinating every handover along the way",
      ],
      stops: ["Factory", "Origin port", "Destination port", "Your door"],
    },
    services: {
      title: "Additional logistics services",
      body: "Moving the container is one part. We also take care of what happens around it: consolidation and warehousing in China, warehousing in your country, and insurance for the goods on the way.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "Consolidation and warehouse in China",
        "Warehouse in your country",
        "Insurance for your goods in transit",
      ],
      /* Painted on the side of the container sketch. A brand name, the same in every language. */
      containerMark: "PACIFIC SILK",
      items: [
        "Consolidation and warehouse in China",
        "Warehouse in your country",
        "Insurance",
      ],
    },
    issues: {
      title: "Problems fixed on the spot",
      body: "Something always comes up in production. We are in China, so when it does, we are at the factory, often the same day. You hear about it from us, with the fix, not from a delay.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "Problems caught at the factory, before the goods ship",
        "Our team on site, often the same day",
        "You are told what happened and how it was fixed",
      ],
      cardTitle: "Issue log",
      ref: "Sample",
      steps: [
        { status: "Found", text: "Carton labels misprinted" },
        { status: "On site", text: "At the factory the same day" },
        { status: "Fixed", text: "Labels reprinted and re-checked" },
      ],
      note: "You are told, with the fix",
    },
  },
  beyond: {
    expandLabel: "Show details",
    closeLabel: "Hide details",
    recurring: {
      title: "Buy again, every year",
      body: "The first order is the hard part. After it, we keep the relationship with your supplier alive for you and run the same order again every year, at the same standard, without starting over.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "Your supplier relationship kept warm between orders",
        "The repeat order placed, followed and checked each year",
        "Prices and terms reviewed before every new order",
      ],
      poTitle: "Purchase order",
      pastTags: ["Year 1", "Year 2"],
      currentTag: "Year 3 · Reorder",
      rows: [
        { label: "Supplier", value: "Same as last year" },
        { label: "Standard", value: "Same golden sample" },
        { label: "Price", value: "Reviewed with you" },
      ],
      stamp: "Placed for you",
    },
    fairs: {
      title: "Trade fairs in China",
      body: "Want to be at the Canton Fair or another fair in China? We get you in, as a visitor or an exhibitor, and plan who to meet and what to see.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "Which fair fits your product, and which session",
        "Registration, booth and travel handled",
        "Meetings with suppliers set up before you land",
      ],
      passLabel: "Visitor pass",
      fairName: "Canton Fair",
      place: "Guangzhou, Guangdong",
      sessions: ["Spring session", "Autumn session"],
    },
    network: {
      title: "Become part of the network",
      body: "Our clients do not stay clients only. Join the network as a partner, plan your next steps in China, or help us bring Chinese products to Europe.",
      link: { label: "About the network", href: "/about#network" },
      points: [
        "Become a partner of the network",
        "Plan further expansion into China with us",
        "Help bring Chinese products to Europe",
      ],
      roles: ["Partner", "Expansion in China", "Chinese products to Europe"],
    },
    options: {
      title: "Other ways into China",
      body: "If buying is not enough, we look at the bigger moves with you: investing in China, your own production facility, or buying into a company there.",
      link: { label: "Start a project", href: "/start" },
      points: [
        "Foreign direct investment, weighed against buying",
        "Your own production facility, from site to permits",
        "Mergers and acquisitions, with partners we know",
      ],
      deeperLabel: "Deeper into China",
      items: ["Buying from China", "Foreign direct investment", "Your own facility", "Mergers and acquisitions"],
      currentLabel: "Today",
    },
  },
  finalCta: {
    headline: "See what your path would look like.",
    body: "Answer four questions and get a first view of your project. Free, no commitment.",
    cta: { label: "Build your project path", href: "/#builder" },
    secondary: [{ label: "Start a project", href: "/start" }],
  },
};
