import type { Project, Office } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "tools-machinery-benelux",
    slug: "tools-machinery-benelux",
    impact: { value: "Since 2020", label: "Recurring orders, no China-side hire" },
    name: "Tools & Machinery Sourcing — Benelux",
    type: "sourcing",
    status: "in-progress",
    startDate: "2020-01-01",
    // Client is in Belgium; execution is in Zhejiang Province, China
    city: "Brussels",
    country: "Belgium",
    lat: 50.8503,
    lng: 4.3517,
    countryImage: "/countries/belgium.jpg",
    summary:
      "Long-term sourcing and logistics partnership for a tools and machinery retailer in the Benelux region. Since 2020, PSC has managed every recurring order — factory sourcing, shipment consolidation, and warehousing — giving the client a full China supply chain without a single in-country hire.",
    body: [
      "When this Benelux-based retailer first approached PSC, they were sourcing ad hoc from China through intermediaries — paying a premium, with no visibility into factory quality or lead times. They needed consistency, not just transactions.",
      "PSC, working with Lance Trade and SPL, built a recurring supply chain infrastructure from scratch. Lance Trade identified and vetted qualified factories in Zhejiang Province. SPL established warehousing and consolidation protocols matched to the client's demand cycle — orders batch and ship efficiently rather than moving piecemeal.",
      "Five years in, the client routes all China-sourced inventory through this infrastructure. New product lines are onboarded through the same process. PSC remains the single point of contact for scoping, factory selection, and quality review. The client has never needed a China-side employee.",
    ],
    outcome:
      "A fully operational China supply chain — sourcing, warehousing, and logistics — without a single in-country hire. Demand-based shipment consolidation cut per-unit logistics costs and improved lead time predictability.",
    featured: true,
    alliance: "Lance Trade & SPL",
    // No project images yet — placeholder header shown on card
  },
  {
    id: "agricultural-component-spain",
    slug: "agricultural-component-spain",
    impact: { value: "Mould to sample", label: "Pre-production run in Zhejiang" },
    name: "Agricultural Component Production — Spain",
    type: "manufacturing",
    status: "in-progress",
    startDate: "2025-01-01",
    // Client is in Spain; execution is in Zhejiang Province, China
    city: "Madrid",
    country: "Spain",
    lat: 40.4168,
    lng: -3.7038,
    summary:
      "Manufacturing engagement for a Spanish agricultural business: factory sourcing, quality control, sample elaboration, and mould creation for a trunk injection component targeting European commercialization.",
    body: [
      "The client — a business owner in Spain's agriculture sector — had a specific product: a trunk injection component for commercial use in European markets. The challenge was manufacturing it to the required tolerance and certification standard at a price point that made European distribution viable.",
      "PSC coordinated the full pre-production phase through the Pacific Silk Alliance. Lance Trade identified factories in Zhejiang Province capable of injection moulding at the required spec. PSC Consulting managed client communication, sample review rounds, and specification translation.",
      "Quality control checkpoints were built into each sample round — not bolted on at the end. Moulds were reviewed and revised before any production commitment was made. The client approved each stage before the next began.",
    ],
    outcome:
      "Reduced per-unit manufacturing costs with quality standards that position the product competitively against European-made alternatives — a direct commercialization advantage.",
    featured: true,
    alliance: "Pacific Silk Alliance",
    image: "/projects/agricultural_components/1.jpg",
    bodyImages: [
      "/projects/agricultural_components/2.jpeg",
      "/projects/agricultural_components/3.jpg",
      "/projects/agricultural_components/4.jpg",
    ],
  },
  {
    id: "modular-housing-dominican-republic",
    slug: "modular-housing-dominican-republic",
    impact: { value: "Jiangsu", label: "Factories visited before any quote" },
    name: "Modular Housing Prospection — Dominican Republic",
    type: "sourcing",
    status: "in-progress",
    startDate: "2026-01-01",
    // Client is in Dominican Republic; execution (factory sourcing) in Jiangsu Province, China
    city: "Santo Domingo",
    country: "Dominican Republic",
    lat: 18.4861,
    lng: -69.9312,
    summary:
      "Large-scale modular housing sourcing for private-public clients in the Dominican Republic. PSC identified industry-leading factories in Jiangsu Province, conducted pre-quota factory visits, and built a qualified supplier database covering multiple project formats.",
    body: [
      "The Dominican Republic is seeing a wave of private and public investment in affordable, rapid-deploy housing. The client — a group of private-public promoters — needed suppliers capable of delivering modular units at scale, with quality standards suitable for a non-transparent, fast-moving market.",
      "PSC mapped the modular housing manufacturing landscape in Jiangsu Province, identifying leading factories by output volume, export history, and certification level. Factory visits were conducted by the PSC and Lance Trade teams — inspections ran before any quotation commitment, validating capacity and production conditions firsthand.",
      "A structured supplier database was developed: factories ranked by capability, price band, and delivery lead time. Multiple sub-project formats — private villas, multi-unit developments, public infrastructure — were scoped separately, with tailored quotations for each.",
    ],
    outcome:
      "The client gained direct access to a non-transparent, high-growth segment with a validated supplier database and ready-to-use quotations for multiple public and private sub-projects.",
    featured: true,
    alliance: "PSC & Lance Trade",
    image: "/projects/modular_houses/1.jpg",
    bodyImages: [
      "/projects/modular_houses/2.jpg",
      "/projects/modular_houses/3.jpg",
      "/projects/modular_houses/4.jpg",
      "/projects/modular_houses/5.jpg",
      "/projects/modular_houses/6.jpg",
      "/projects/modular_houses/7.jpg",
      "/projects/modular_houses/8.jpg",
    ],
  },
  {
    id: "market-entry-design-china",
    slug: "market-entry-design-china",
    impact: { value: "0 trips", label: "Market entry run remotely" },
    name: "Market Entry — Design Firm, China",
    type: "market-entry",
    status: "in-progress",
    startDate: "2025-01-01",
    // This project operates IN China — marker at geographic centre
    city: "China",
    country: "China",
    lat: 35.8617,
    lng: 104.1954,
    summary:
      "Market entry engagement for a Spanish design consulting firm. PSC identified local co-promoters and agencies across multiple Chinese cities, enabling the client to build connections and iterate on strategy — entirely remotely.",
    body: [
      "The client is a Spanish design consulting firm with a strong European portfolio but no China relationships. They wanted to explore the Chinese market without committing to a local office or hire — a common constraint for boutique professional services firms.",
      "PSC led the research and outreach phase: mapping the relevant segment of China's design and architecture ecosystem, identifying agencies and co-promoters open to international partnerships, and arranging structured introductions. All coordination ran through PSC, in Mandarin, on the client's behalf.",
      "Strategy iterations were run in real time. As early conversations surfaced which entry angles resonated and which didn't, PSC fed that intelligence back into the outreach — adjusting positioning and target profiles without the client needing to travel.",
    ],
    outcome:
      "Remote access to curated local networks and on-the-ground execution — the client refined their China market entry strategy through real conversations, not market reports.",
    featured: true,
    alliance: "PSC",
    image: "/projects/market_entry_design/1.jpg",
    bodyImages: [
      "/projects/market_entry_design/2.jpg",
      "/projects/market_entry_design/3.jpg",
      "/projects/market_entry_design/4.jpg",
      "/projects/market_entry_design/5.jpg",
    ],
  },
  {
    id: "sister-city-palma-ningbo",
    slug: "sister-city-palma-ningbo",
    impact: { value: "6 months", label: "To a signed agreement" },
    name: "Sister City Agreement — Palma de Mallorca & Ningbo",
    type: "advisory",
    status: "completed",
    startDate: "2025-07-01",
    completedDate: "2025-12-31",
    city: "Palma de Mallorca",
    country: "Spain",
    lat: 39.5696,
    lng: 2.6502,
    countryImage: "/countries/spain.jpg",
    summary:
      "PSC mediated a bilateral cooperation agreement between Palma de Mallorca and Ningbo — navigating two delegations, two regulatory frameworks, and competing institutional priorities across a six-month engagement. The signed agreement positions Palma as the primary gateway for Ningbo investments in Europe.",
    body: [
      "International institutional agreements are rarely complicated by lack of goodwill. They are complicated by each party arriving with a version of success that doesn't match the other's. This project began with two delegations — one from Palma de Mallorca, one from Ningbo — who wanted an agreement but didn't yet understand what the other side needed it to say.",
      "PSC led the mediation and coordination effort, working alongside the Chinese Association of the Balearic Islands and the Government of Ningbo. The scope covered regulatory navigation across both jurisdictions, logistical organisation of the official delegation visit, and structured facilitation of every formal and informal exchange. All communication between the parties ran through PSC.",
      "Miscommunication in high-stakes bilateral negotiations is routine. What breaks these projects is when miscommunication hardens into fixed positions. PSC's work was to stay close enough to both sides to understand what each actually needed — not just what they said they needed — and to find the ground where a real commitment was possible. Over six months, that work produced a signed agreement.",
    ],
    outcome:
      "A signed economic and cultural cooperation agreement between Palma de Mallorca and Ningbo — pending final ratification in the year ahead — that positions Palma as the primary centre for Ningbo's investments in Europe and as a gateway for Chinese capital into Spain.",
    featured: true,
    alliance: "PSC",
    image: "/projects/sister_city_agreement_palma_ningbo/1.jpg",
    bodyImages: [
      "/projects/sister_city_agreement_palma_ningbo/2.jpg",
      "/projects/sister_city_agreement_palma_ningbo/3.JPEG",
      "/projects/sister_city_agreement_palma_ningbo/4.jpg",
      "/projects/sister_city_agreement_palma_ningbo/5.jpg",
    ],
  },
];

export const offices: Office[] = [
  {
    id: "eur",
    name: "PSC — Europe",
    city: "Palma de Mallorca",
    country: "Spain",
    countryCode: "ES",
    lat: 39.5696,
    lng: 2.6502,
    featured: true,
    officeImage: "/countries/office-spain.jpg",
    description:
      "Our European headquarters directs Pacific Silk Consulting's strategic operations and provides governance across all regional offices. Based in Spain, our HQ team oversees consulting initiatives across Europe, Latin America, and Asia, ensuring coordinated execution of sourcing and trade corridor projects. We serve as the operational backbone and decision-making center for the Pacific Silk Alliance.",
  },
  {
    id: "cn-hq",
    name: "PSC — China HQ",
    city: "Ningbo",
    country: "China",
    countryCode: "CN",
    lat: 29.8683,
    lng: 121.544,
    featured: true,
    // officeImage: "/countries/office-china.jpg" — add when photo is ready; shows black until then
    description:
      "Our China operations center manages large-scale sourcing, supplier quality, and logistics coordination for all China-based activities. With an extensive on-ground team, we deliver end-to-end project support, supply chain intelligence, and critical information to our international branches. This hub ensures seamless execution of trade and sourcing initiatives across our global network.",
  },
  {
    id: "cn-hz",
    name: "PSC — China",
    city: "Hangzhou",
    country: "China",
    countryCode: "CN",
    lat: 30.2741,
    lng: 120.1551,
    // featured: false — black dot only, no card, does not appear in country card
  },
  {
    id: "pe",
    name: "PSC — Peru",
    city: "Lima",
    country: "Peru",
    countryCode: "PE",
    lat: -12.0464,
    lng: -77.0428,
    featured: true,
    // officeImage: "/countries/office-peru.jpg" — add when photo is ready; shows black until then
    description:
      "Our Peru office serves as PSC's regional headquarters for the Peruvian market, supporting local supplier identification, sourcing projects, and trade initiatives. We provide targeted market expertise and when needed, offer support to broader LATAM projects. Our team focuses on building strong supply chain partnerships within Peru.",
  },
];
