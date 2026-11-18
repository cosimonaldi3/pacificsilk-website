// All visible copy of the Shipping Estimate and Tariff Finder tools.
// Values stay plain strings so the object can cross the server/client boundary;
// "{name}" placeholders are filled by fill() from lib/tools/format.ts.

export const toolsContent = {
  meta: {
    estimate: {
      title: "Shipping Estimate | Pacific Silk Group",
      description:
        "Name a product and a destination. See the route from China, the transit time and an estimated landed cost, with freight, duties and VAT.",
    },
    finder: {
      title: "Tariff Finder | Pacific Silk Group",
      description:
        "Find the customs code for your product, its average import price, and the EU tariff measures on imports from China.",
    },
  },

  subNav: {
    label: "Tools",
    estimate: "Shipping estimate",
    finder: "Tariff finder",
  },

  estimator: {
    eyebrow: "Landed cost estimate",
    headline: "From the factory floor to your door.",
    lede: "Name the product and the route. We estimate what it costs to land it at your door.",
    legendOrigin: "Shipping from Shanghai",
    legendDest: "Destinations",
    legendHint: "Drag to turn",
    productLabel: "What are you buying?",
    productPlaceholder: "Product name, for example: cotton hoodie",
    examples: ["cotton hoodie", "drone", "electric bicycle", "ceramic tiles"],
    classifying: "Looking up the customs classification…",
    classificationLabel: "Customs classification",
    headingPrefix: "HS {heading} · ",
    originLabel: "Made in",
    originChoose: "Choose a region",
    destLabel: "Ship to",
    destChoose: "Choose a destination",
    quantityLabel: "Quantity",
    unitsWord: "units",
    trace: "Trace the route",
    traceAgain: "Trace the route again",
  },

  globe: {
    madeIn: "Made in {label}.",
    noOrigin: "No origin chosen.",
    shippingTo: "Shipping to {label}.",
    noDest: "No destination chosen.",
    hint: "Globe. {origin} {dest} Use the form to choose with the keyboard.",
  },

  route: {
    ariaLabel: "Route",
    eyebrow: "The route",
    to: "to",
    sub: "{from} to {to} · about {days} days door to door",
    exportTitle: "Export from Ningbo or Shanghai port",
    exportSub: "Export clearance",
    days: "{days} days",
    seaTitle: "Sea freight to {port}",
    kmDays: "{km} km · {days} days",
    truckTitle: "Truck to {city}",
    truckSub: "Import clearance in {port}",
    servicesIntro: "Along this route we can handle",
    qualityControl: "Quality control",
    logistics: "Logistics",
    total: "Estimated landed cost",
    via: {
      suez: "via the Strait of Malacca and the Suez Canal",
      pacific: "across the Pacific",
      panama: "across the Pacific and the Panama Canal",
    },
  },

  goods: {
    eyebrow: "Cost of goods",
    forQuantity: "{amount} for {qty} {unit}",
    units: "units",
    reset: "Back to average",
    averageMarker: "avg {price}",
    sliderLabel: "Price per {unit}",
    rangeEnd: "Market price range",
    typicalEnd: "Around the typical price",
    hintFactory: "Who makes it? We find the factory",
    hintNegotiate: "Want a better price? We negotiate it",
  },

  breakEven: {
    title: "Compare with your current price",
    payToday: "What you pay today",
    dragToCompare: "Drag to compare",
    clear: "Clear",
    chinaMarker: "China {price}",
    sliderLabel: "What you pay today, per {unit}",
    notSet: "not set",
    unit: "unit",
    qtyUnits: "{qty} units",
    qtyKg: "{qty} kg",
    qtyOther: "{qty} × {unit}",
    prompt: "Set your current price to see from what quantity buying from China is cheaper.",
    anyQuantity: "Based on your price, buying from China is cheaper at any quantity.",
    cheaperFrom: "Based on your price, buying from China is cheaper from about",
    notCheaper: "Based on your price, buying from China is not cheaper.",
    caveat: "China landed cost including {vat}.",
    caveatEnter: " Enter your price including {vat} too.",
    vat: "VAT",
    salesTax: "sales tax",
  },

  breakdown: {
    eyebrow: "Estimated landed cost",
    perUnit: "per {unit} · {qty} × {product}",
    stackLabel: "Share of each cost in the total",
    total: "Total landed cost",
    hint: "Tariffs and VAT look complicated? We support you",
    caveat:
      "Indicative estimate based on average prices and container rates. Contact us for a quote on your actual order.",
  },

  model: {
    goods: "Goods",
    transport: "Transport",
    insurance: "Insurance",
    tariffs: "Tariffs",
    antidumping: "Anti-dumping",
    vat: "VAT",
    salesTax: "Sales tax",
    tariffWord: "tariff",
    antidumpingWord: "anti-dumping",
    noAntidumping: "No antidumping for this category.",
    rateRange: "Average {name} {rate} · range {min}–{max}",
    vatNote: "{rate} on goods, transport, insurance and duties",
  },

  duty: {
    typical: "Typical rate for this product group",
    typicalWithDatabase: "Typical rate for this product group. Tariff database: {text}",
    stored: "{measure}: {text}",
    ch: "Switzerland abolished tariffs on industrial goods in 2024",
    us: "Base rate only. Additional US tariffs on Chinese goods vary, so set them by hand",
    pe: "Peru applies a 0–11% tariff, approximated from the EU rate; IGV and IPM are charged as VAT",
    do: "Dominican tariff (0–20%) approximated from the EU rate; ITBIS is charged as VAT",
    tr: "EU common tariff; Türkiye adds extra duties on some Chinese goods",
  },

  classify: {
    generic: "Not classified yet: using generic assumptions",
  },

  finder: {
    eyebrow: "Customs classification",
    headline: "Find the code, then the duty.",
    lede: "Type what the product is called. Pick the heading that fits to see its average import price and estimate the value of an order.",
    searchLabel: "Product name",
    searchPlaceholder: "Product name, for example: cotton hoodie",
    examples: ["drone", "cotton hoodie", "phone case", "steel pipe"],
    status: {
      idle: "Try one of these:",
      searching: "Searching for",
      nothing: "Nothing matches",
      nothingHint: "Try the product's everyday name, or fewer words.",
      headingMatches: "heading matches",
      headingsMatch: "headings match",
      pick: "Pick the one that fits.",
    },
    notConnectedTitle: "This page is not connected to a database yet.",
    notConnectedBody:
      "Copy .env.example to .env and fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY.",
    searchFailed: "The search did not answer.",
    details: "Details: {message}",
    alsoCalled: "Also called:",
  },

  current: {
    back: "Back to the results",
    copy: "Copy the code",
    copied: "Copied",
    copyByHand: "Copy by hand: {code}",
    treeFailed: "The code tree did not answer.",
    hint: "Tariffs and VAT look complicated? We support you",
    caveat:
      "The search only suggests where to look. The code is right when the official wording at every level above fits the product, so read the branch before using it on a declaration.",
    finalCodeAria: "Final code {code}",
    codeSoFarAria: "Code so far {code}",
    trailLabel: "Where this code sits",
    pick: "Narrow it down: which of these describes the product?",
    finalTag: "final code",
  },

  price: {
    title: "Average import price",
    loading: "Looking up the average price…",
    failed: "The price could not be loaded ({message}).",
    none: "Price not available for this code.",
    amount: "€ {price} / {basis}",
    average: "{year} average",
    fromParent: "price from {level} {code}, no data for this level",
    forCode: "price for {level} {code}",
    range: "Range € {min} – € {max} / {basis} across {count} CN8 codes",
  },

  importEstimate: {
    title: "Import cost estimate",
    quantity: "Quantity",
    quantityIn: "Quantity in",
    units: "units",
    kg: "kg",
    conversion: "{entered} kg ÷ {perUnit} kg per unit = {qty} units",
    value: "Estimated value of goods (average price)",
    calc: "{qty} {unitWord} × € {price} / {unit}",
    duties: "Duties",
    comingSoon: "coming soon",
    dutiesNote: "Tariffs are shown as text for now; they are not added to the estimate.",
  },

  tariff: {
    title: "EU tariff for imports from China",
    loading: "Loading the tariff…",
    failed: "The tariff could not be loaded ({message}).",
    noneLeaf: "No measure is recorded for this code.",
    noneBranch: "No measure is recorded for this code or the codes below it.",
    china: "China",
    allOrigins: "All origins (erga omnes)",
    group: "Group {code}",
    setAbove: "Set at {code}, applies to everything below",
    onlyFor: "Only for {code}",
    showAll: "Show all {count} measures",
    scopeLeaf: "Measures on this code and on the codes above it, as recorded. Rates are shown as text.",
    scopeBranch:
      "Measures on this code, the codes above it and every code below it. Narrow down to see the ones that apply to the final code.",
  },

  services: {
    contact: "Contact us",
    close: "Close",
    counter: "Service {index} of {total}",
    otherServices: "Other services",
    bandEyebrow: "What comes next",
    bandTitle: "This is an estimate. Your real price starts with a conversation.",
    items: [
      {
        id: "sourcing",
        title: "Sourcing",
        blurb: "Factory identification, vetting, and supplier management.",
        promise:
          "Factory identification, vetting, and supplier management. We find who can make it, at what quality, and at what price.",
        points: [
          "Identify the Chinese region specialised in your product",
          "Shortlist suitable factories",
          "Negotiate directly with the factory",
          "Compare offers against market prices",
          "Agree the price and terms in a contract",
        ],
      },
      {
        id: "manufacturing",
        title: "Manufacturing",
        blurb: "End-to-end production management.",
        promise:
          "End-to-end production management — samples, moulds, quality control, and delivery. Lance Trade on the factory floor.",
        points: [
          "Manage samples and moulds",
          "Inspect the goods at the factory",
          "Check them against your specifications",
          "Report back before the goods ship",
        ],
      },
      {
        id: "market-entry",
        title: "Market Entry",
        blurb: "China market access and local introductions.",
        promise:
          "China market access: local partners, co-promoters, agency introductions. We open the doors and stay in the room.",
        points: [
          "Connect you with local partners",
          "Bring in co-promoters",
          "Introduce you to agencies",
        ],
      },
      {
        id: "logistics",
        title: "Logistics",
        blurb: "Freight, customs, consolidation, warehousing.",
        promise:
          "Freight, customs, consolidation, warehousing. SPL moves your cargo. PS makes the handoff seamless.",
        points: [
          "Warehouse management in China and Europe",
          "Consolidation of cargo from several suppliers",
          "Final delivery through a logistics forwarder",
          "Check the customs classification of your product",
          "Review the tariffs and anti-dumping measures that apply",
          "Support with import duties and VAT",
        ],
      },
    ],
  },
};

export type ToolsContent = typeof toolsContent;

// Tool copy is English on every locale for now (see TODO.md). This is the seam
// where es/zh files plug in, matching the loadContent pattern of the other pages.
export async function loadToolsContent(_locale: string): Promise<ToolsContent> {
  return toolsContent;
}
