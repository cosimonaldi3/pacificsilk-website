/* Blog content. English only for now: the page chrome (filters, buttons) is translated in
   messages/*.json, the posts are not. See TODO.md.

   To add a post: append one entry to `posts` below and drop its photo in public/. Nothing else
   to wire. Order does not matter: posts are sorted by date, newest first. */

export type BlogCategory = "industry-insights" | "qa" | "technical-notes" | "news";

/* Display order of the category pills */
export const blogCategories: BlogCategory[] = ["industry-insights", "qa", "technical-notes", "news"];

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  /* Q&A posts: a question and its answer, one paragraph per string */
  | { type: "qa"; question: string; answer: string[] };

export interface BlogPost {
  slug: string;
  category: BlogCategory;
  title: string;
  /* One or two sentences: shown on the cards, under the title and in search results */
  dek: string;
  /* ISO date, e.g. "2026-11-12". News posts use the month of the real event. */
  date: string;
  author: string;
  image: { src: string; alt: string };
  /* Tags shown on the card. Capitalised, short. The most used ones feed "Popular topics". */
  topics: string[];
  body: BlogBlock[];
}

/* Fields the index needs. The body stays on the server: the index is a client component. */
export type BlogCard = Omit<BlogPost, "body"> & { readMinutes: number };

const TEAM = "Pacific Silk team";

export const posts: BlogPost[] = [
  /* ------------------------------------------------------------------ Industry insights */
  {
    slug: "factory-floor-tells-you-what-paperwork-cannot",
    category: "industry-insights",
    title: "A factory floor tells you what the paperwork cannot",
    dek: "Every supplier sends a catalogue, a certificate and a polite quotation. None of them show how the product is actually made. We walk the floor first.",
    date: "2026-11-12",
    author: TEAM,
    image: {
      src: "/gallery/6.jpeg",
      alt: "A Pacific Silk team member photographs an assembly line at a plastic injection manufacturer in Shenzhen",
    },
    topics: ["Sourcing", "Quality", "Manufacturing"],
    body: [
      {
        type: "p",
        text: "Most sourcing mistakes are made before the first order, at the moment someone picks a supplier from a screen. The catalogue looks right. The certificates are attached. The quotation is on time. And none of it tells you whether the line that will make your product exists.",
      },
      {
        type: "p",
        text: "So the first thing we do with a shortlist is visit. Not to be polite, and not to take photographs for the client, although we do both. We go to see how the work is organised when nobody is expecting a buyer.",
      },
      { type: "h2", text: "What we look at first" },
      {
        type: "list",
        items: [
          "Whether the line in the sample photo is the line that will run your order.",
          "How materials are stored, labelled and moved. A tidy floor is rarely an accident.",
          "Who is responsible for each area. In well-run plants it is written on the wall, with a name.",
          "How defects are recorded: on paper, on a screen, or not at all.",
          "Whether the people we are told about are the people who turn up.",
        ],
      },
      { type: "h2", text: "Why this comes before the quotation" },
      {
        type: "p",
        text: "A quotation is a number a supplier is willing to write down. A visit tells you whether they can hold it. If the plant runs three other customers on the same line, your lead time is a hope, not a promise. If the mould room is a rented corner, your tooling is exposed.",
      },
      {
        type: "p",
        text: "We would rather lose a supplier at this stage than lose a client's season at a later one. Visiting is cheap. Changing factories halfway through production is not.",
      },
      {
        type: "quote",
        text: "The question is never whether the factory can make a sample. It is whether it can make the ten-thousandth unit the same way.",
      },
      {
        type: "p",
        text: "When a client is in Europe or Latin America, this is the part they cannot do from a desk. It is also the part they should not have to do themselves. Our team in China visits, reports in your language, and you decide.",
      },
    ],
  },
  {
    slug: "china-makes-30-percent-of-the-worlds-goods",
    category: "industry-insights",
    title: "China makes around 30% of the world's manufactured goods. Where it makes them matters more.",
    dek: "More than the United States, Japan and Germany combined. The number is less useful than the map behind it: whole regions run as one connected factory.",
    date: "2026-04-18",
    author: TEAM,
    image: {
      src: "/gallery/4.jpeg",
      alt: "A machinery and manufacturing equipment exhibition hall in Hefei, Anhui Province",
    },
    topics: ["Sourcing", "Manufacturing", "Trade data"],
    body: [
      {
        type: "p",
        text: "China produces around 30% of the world's manufactured goods. That is more than the United States, Japan and Germany combined. It is a figure that gets repeated until it stops meaning anything.",
      },
      {
        type: "p",
        text: "What it hides is how the production is arranged. Entire manufacturing regions operate as highly integrated production environments: thousands of specialised suppliers concentrated in the same geographic area, each doing one step of the job, all within a short drive of each other.",
      },
      { type: "h2", text: "A region is a supply chain" },
      {
        type: "p",
        text: "If you make electrical products, the nearest component maker, the mould shop, the packaging printer and the freight consolidator may all be in the same province. A change to your design is a conversation across town, not a shipment across an ocean. That is the real advantage, and it is why price alone is a poor reason to choose a factory.",
      },
      {
        type: "p",
        text: "It also means the right factory for your product is rarely the one with the best website. It is the one inside the right cluster, close to the suppliers that make your product possible.",
      },
      { type: "h2", text: "What we do with it" },
      {
        type: "list",
        items: [
          "Map where your product category is concentrated, province by province.",
          "Identify which clusters are growing and which are crowded.",
          "Build the shortlist inside the right cluster, then visit before anyone quotes.",
        ],
      },
      {
        type: "p",
        text: "This is the first stage of every project we run. It is also the part clients most often skip when they source alone, because the data is in Chinese and the clusters do not show up in a search result.",
      },
    ],
  },
  {
    slug: "where-is-sourcing-from-china-growing-fastest",
    category: "industry-insights",
    title: "Where is sourcing from China growing fastest?",
    dek: "Latin America grew 13.0% year on year in China's exports in 2024. North America grew 4.8%. Europe 3.7%. The commercial opportunity follows the trade.",
    date: "2026-05-13",
    author: TEAM,
    image: {
      src: "/gallery/12.jpeg",
      alt: "The air-cargo terminal and customs area at Callao International Airport in Lima, Peru",
    },
    topics: ["Latin America", "Trade data", "Logistics"],
    body: [
      {
        type: "p",
        text: "In 2024, China's exports to Latin America grew by 13.0% year on year. North America grew by 4.8%. Europe by 3.7%. Latin America remains the fastest-growing destination for China's trade, and the commercial opportunity follows it.",
      },
      {
        type: "p",
        text: "For a company based in the region, this reads two ways. Competitors are already buying more from China. And the infrastructure that supports that trade, from ports to customs brokers to consolidators, is being built around them.",
      },
      { type: "h2", text: "What changes when volumes grow" },
      {
        type: "p",
        text: "More volume means more routes, and more routes mean more ways to get the landed cost wrong. A shipment that clears quickly through one port can sit for weeks at another. Duty treatment differs by country and by product code. The freight rate is the smallest part of the question.",
      },
      {
        type: "p",
        text: "We work on both ends of that trade. Our team in Latin America handles the receiving side; our teams in China prepare the goods and the paperwork before they leave the factory. The client sees one plan, in their language, with the whole route priced on the same terms.",
      },
      {
        type: "p",
        text: "If you are considering sourcing from China for a Latin American market, the first question is not which factory. It is which route, under which terms, and what lands at your door.",
      },
    ],
  },
  {
    slug: "modular-housing-visit-the-factory-before-you-ask-for-a-quote",
    category: "industry-insights",
    title: "Modular housing: visit the factory before you ask for a quote",
    dek: "A fast-moving market with little transparency. How we mapped modular housing producers in Jiangsu Province for a group of private and public promoters in the Dominican Republic.",
    date: "2026-09-24",
    author: TEAM,
    image: {
      src: "/projects/modular_houses/1.jpg",
      alt: "A modular housing unit at a manufacturing facility in Jiangsu Province",
    },
    topics: ["Manufacturing", "Latin America", "Sourcing"],
    body: [
      {
        type: "p",
        text: "The Dominican Republic is seeing a wave of private and public investment in affordable, rapid-deploy housing. A group of private-public promoters there needed suppliers that could deliver modular units at scale, in a market where claims are hard to check and timelines move fast.",
      },
      { type: "h2", text: "Map first, ask later" },
      {
        type: "p",
        text: "We mapped the modular housing manufacturing landscape in Jiangsu Province and ranked factories by output volume, export history and certification level. Only then did we ask anyone for a price.",
      },
      {
        type: "p",
        text: "The Pacific Silk and Lance Trade teams visited the shortlisted factories before any quotation was requested. Capacity and production conditions were validated firsthand, on the floor, not in a brochure.",
      },
      {
        type: "image",
        src: "/projects/modular_houses/2.jpg",
        alt: "A finished modular housing unit with glazed walls on a factory floor in Jiangsu Province",
        caption: "Inspections ran before any quotation commitment.",
      },
      { type: "h2", text: "One database, several projects" },
      {
        type: "p",
        text: "The result was a structured supplier database: factories ranked by capability, price band and delivery lead time. Different formats, from private villas to multi-unit developments to public infrastructure, were scoped separately, each with its own quotation.",
      },
      {
        type: "p",
        text: "The client now holds a validated list of producers and ready quotations for several sub-projects. The next time a project opens, the groundwork is already done.",
      },
    ],
  },

  /* ------------------------------------------------------------------ Q&A */
  {
    slug: "qa-how-do-you-know-a-chinese-factory-is-real",
    category: "qa",
    title: "Q&A: How do you know a Chinese factory is a real factory?",
    dek: "Trading companies, sub-contractors and shell entities all send convincing quotations. Three questions on how our team separates the maker from the middleman.",
    date: "2026-11-05",
    author: "Pacific Silk sourcing team",
    image: {
      src: "/gallery/3.jpg",
      alt: "Inside an electric manufacturing plant in Shanghai during a production facility review",
    },
    topics: ["Sourcing", "Quality", "Manufacturing"],
    body: [
      {
        type: "qa",
        question: "Why is this such a common problem?",
        answer: [
          "Because it is easy to look like a factory. A trading company can send photos of someone else's line. A small workshop can quote for work it will quietly pass on. The buyer ends up paying a margin to a party that adds nothing, and has no control over who actually makes the product.",
        ],
      },
      {
        type: "qa",
        question: "What do you check first?",
        answer: [
          "The business licence and the export rights, against the official registry. In China the licence tells you whether a company exists, what it is registered to do and where. We read it for you, in Chinese, before anyone is contacted on a client's behalf.",
          "A licence alone is not proof. Plenty of trading companies hold perfectly valid ones. So it is the first filter, not the last.",
        ],
      },
      {
        type: "qa",
        question: "And after the paperwork?",
        answer: [
          "We visit. The floor is the second filter, and the one that matters. We check that the machines are there, that the product on the table is made on them, and that the people described in the email are the people on site.",
          "Clients only meet the suppliers that pass both. That usually means a shorter list than they expected, which is the point.",
        ],
      },
    ],
  },
  {
    slug: "qa-what-happens-when-production-goes-wrong",
    category: "qa",
    title: "Q&A: What happens when production goes wrong?",
    dek: "Something always comes up in production. A conversation about what we do in the first hours, and why being in the country changes the answer.",
    date: "2026-10-08",
    author: "Pacific Silk operations team",
    image: {
      src: "/gallery/15.jpeg",
      alt: "The BOTON food and beverage production facility in Shenzhen during a factory visit",
    },
    topics: ["Quality", "Manufacturing", "Logistics"],
    body: [
      {
        type: "qa",
        question: "Does it really go wrong that often?",
        answer: [
          "Something always comes up. A raw material is late, a mould needs adjusting, a batch comes off the line outside tolerance. That is normal manufacturing. The difference between a delay and a disaster is how fast someone who understands the product is in the room.",
        ],
      },
      {
        type: "qa",
        question: "What do you do first?",
        answer: [
          "We go to the factory, often the same day. Not an email, not a video call: we are in China, so we are on site. We see the problem, agree the fix with the factory, and write it down.",
          "The client hears about it from us, in their language, with the fix already proposed.",
        ],
      },
      {
        type: "qa",
        question: "How do you stop it happening again?",
        answer: [
          "By checking against the standard that was agreed, not the one remembered. Every unit is compared to the approved golden sample. When something drifts, the sample is the reference and the argument ends quickly.",
          "Problems are caught at the factory, before the goods ship. Finding a defect in a warehouse eight weeks later is a different, and far more expensive, conversation.",
        ],
      },
      {
        type: "qa",
        question: "What does the client have to do?",
        answer: [
          "Decide. We flag what we need from you before it holds anything up, and nothing leaves the factory without your approval.",
        ],
      },
    ],
  },
  {
    slug: "qa-can-i-run-a-china-project-without-travelling",
    category: "qa",
    title: "Q&A: Can I run a China project without ever travelling?",
    dek: "A Spanish design firm entered the Chinese market without an office, a hire or a flight. What that took, and where it does not work.",
    date: "2026-08-27",
    author: "Pacific Silk team",
    image: {
      src: "/projects/market_entry_design/1.jpg",
      alt: "A meeting during a market entry engagement for a design firm in China",
    },
    topics: ["Market entry", "Europe"],
    body: [
      {
        type: "qa",
        question: "Is it realistic to enter China without being there?",
        answer: [
          "For many projects, yes. A Spanish design consulting firm with a strong European portfolio and no China relationships wanted to explore the market without opening an office. We ran the research and outreach on its behalf, in Mandarin, and it never needed to travel.",
        ],
      },
      {
        type: "qa",
        question: "What did that look like in practice?",
        answer: [
          "We mapped the relevant part of China's design and architecture ecosystem, identified agencies and co-promoters open to international partnerships in several cities, and arranged structured introductions. Everything was coordinated through us.",
          "As early conversations showed which angles resonated and which did not, we fed that back into the outreach and adjusted positioning and target profiles. The strategy improved through real conversations, not market reports.",
        ],
      },
      {
        type: "qa",
        question: "When should you still go?",
        answer: [
          "When the relationship is the product. A first meeting with a long-term partner, a signing, a fair. For those we get you in and plan who to meet and what to see. The rest of the time, the team in China does the travelling so you do not have to.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ Technical notes */
  {
    slug: "the-golden-sample-one-approved-unit-sets-the-standard",
    category: "technical-notes",
    title: "The golden sample: how one approved unit sets the standard",
    dek: "Quality problems usually start with a gap between the sample and the spec. How we close that gap before production starts, and keep it closed.",
    date: "2026-10-29",
    author: TEAM,
    image: {
      src: "/projects/agricultural_components/1.jpg",
      alt: "Moulded sample components being weighed and inspected on a table at a factory in Zhejiang",
    },
    topics: ["Quality", "Manufacturing", "Sourcing"],
    body: [
      {
        type: "p",
        text: "Quality problems rarely begin on the production line. They begin earlier, in the gap between the sample the client approved and the specification the factory was given. If those two things differ, every unit that follows will differ with them.",
      },
      { type: "h2", text: "Nothing goes to production until the sample matches the spec" },
      {
        type: "p",
        text: "We test samples in China, where tests run faster than shipping a sample to your market and waiting for a verdict. Every gap against the spec is found before production, not after the goods have shipped. Where the sample is wrong, the factory corrects it and we test again.",
      },
      { type: "h2", text: "Once approved, it becomes the standard" },
      {
        type: "p",
        text: "When the client approves a sample, it is no longer a sample. It becomes the golden sample: the reference against which every unit made afterwards is checked. It is stored, documented and travels with the project.",
      },
      {
        type: "list",
        items: [
          "Inspections at the factory happen at the key points of production, against the golden sample.",
          "Disagreements are settled by the sample, not by memory.",
          "A new order a year later is made to the same standard, without starting over.",
        ],
      },
      { type: "h2", text: "Why we build it into every round" },
      {
        type: "p",
        text: "On the agricultural component project for a Spanish client, quality checkpoints were built into each sample round, not added at the end. Moulds were reviewed and revised before any production commitment was made, and the client approved each stage before the next began.",
      },
      {
        type: "p",
        text: "It is slower on paper. In practice it is the cheapest quality control there is, because the expensive mistakes are the ones found last.",
      },
    ],
  },
  {
    slug: "how-to-read-a-chinese-business-licence",
    category: "technical-notes",
    title: "How to read a Chinese business licence",
    dek: "The licence is the first document we ask a supplier for. What each field tells you, and what it cannot.",
    date: "2026-09-10",
    author: TEAM,
    image: {
      src: "/gallery/1.jpg",
      alt: "An electrical products manufacturing facility in Zhejiang Province during a supplier assessment",
    },
    topics: ["Sourcing", "Quality"],
    body: [
      {
        type: "p",
        text: "In China, a company's business licence (营业执照) is the public record that it exists. Every registered business has one, and the details can be checked against the official registry. We read it before we contact a supplier on a client's behalf.",
      },
      { type: "h2", text: "The fields that matter" },
      {
        type: "list",
        items: [
          "Unified social credit code. An 18-character identifier unique to the company. It is what you search in the registry.",
          "Company name. It must match the name on the quotation, the contract and the bank account. A mismatch is a reason to stop.",
          "Legal representative. The person who can bind the company. It should be a person you can be introduced to.",
          "Registered capital and date of establishment. A new company with very little capital is not necessarily a problem, but it is a question.",
          "Registered address. Does it match the factory you were shown?",
          "Business scope. What the company is allowed to do. Look for manufacturing, not only trading.",
        ],
      },
      { type: "h2", text: "What the licence cannot tell you" },
      {
        type: "p",
        text: "It cannot tell you whether the company owns the line that will make your product. Trading companies hold valid licences too, and many are good at what they do. They are simply not factories. The licence is a first filter, and a necessary one. It is the floor visit that closes the question.",
      },
      {
        type: "p",
        text: "We also check export rights: whether the company can sell abroad directly, or only through another entity. That affects who issues the export documents and who is responsible if something goes wrong at customs.",
      },
      {
        type: "p",
        text: "The result is a short list of suppliers that are real, can make the product and can export it. Clients meet only those.",
      },
    ],
  },
  {
    slug: "sea-rail-or-air-reading-a-route-comparison",
    category: "technical-notes",
    title: "Sea, rail or air: how to read a route comparison",
    dek: "Freight is the smallest line in most landed-cost calculations. Comparing routes on the same terms is what makes the numbers worth checking.",
    date: "2026-07-16",
    author: TEAM,
    image: {
      src: "/gallery/17.jpg",
      alt: "Pacific Silk's warehouse and climate-controlled storage area in Ningbo",
    },
    topics: ["Logistics", "Customs"],
    body: [
      {
        type: "p",
        text: "A route comparison that lists three freight prices is not a comparison. It is three numbers measured against different things. One quote may include origin charges and another may not. One may assume you clear customs yourself. One may stop at the port.",
      },
      { type: "h2", text: "Start with the Incoterm" },
      {
        type: "p",
        text: "The Incoterm says who pays for what, and where the risk changes hands. Under FOB, the buyer takes over at the port of departure. Under DDP, the seller delivers to the door with duties paid. Everything between those two points is either your cost or someone else's, so quotes written under different terms cannot be set side by side.",
      },
      { type: "h2", text: "Compare on the same terms" },
      {
        type: "p",
        text: "For each order, we price sea, rail and air under the Incoterm you need, and we put the same lines in each column: freight, origin handling, transit time, tariffs, and import and export procedures. That way, a difference in the total is a real difference.",
      },
      {
        type: "list",
        items: [
          "Sea is usually the lowest cost per unit and the slowest.",
          "Air is the fastest and the most expensive, and is worth it when a launch date depends on it.",
          "Rail sits between them on both, where the lane exists for your destination.",
        ],
      },
      { type: "h2", text: "What you should see before you pay" },
      {
        type: "p",
        text: "A recommended route for your Incoterm, with the reasons written down, and comparable cost lines for each option. You see the full outlook before you pay or hire any freight, not after.",
      },
    ],
  },
  {
    slug: "customs-codes-why-the-code-decides-the-duty",
    category: "technical-notes",
    title: "Customs codes: why the code decides the duty",
    dek: "Two products that look alike can carry different duty rates. How classification works, and why we settle it before the goods leave the factory.",
    date: "2026-06-18",
    author: TEAM,
    image: {
      src: "/gallery/13.jpeg",
      alt: "A meeting at COSCO Shipping's offices in Lima, Peru",
    },
    topics: ["Customs", "Logistics"],
    body: [
      {
        type: "p",
        text: "Every product that crosses a border is classified under a customs code, usually from the Harmonized System. The first six digits are shared internationally. Countries add more digits to apply their own duty rates and rules.",
      },
      { type: "h2", text: "A code is a decision" },
      {
        type: "p",
        text: "It is easy to treat the code as a form field. In practice it is a judgement about what the product is, what it is made of and what it is for. The same hoodie described two ways can land in different headings, and a different heading can mean a different duty rate.",
      },
      { type: "h2", text: "Why we settle it early" },
      {
        type: "p",
        text: "On the China side, we prepare the export papers and the customs codes, check them and file them before the goods leave the factory. The code on the export declaration has to be consistent with the one used at import. If the two disagree, the shipment is the one that waits.",
      },
      {
        type: "list",
        items: [
          "Export documents prepared and checked in China, before dispatch.",
          "The right customs code for your product, agreed with you in writing.",
          "Duty and procedure included in the landed-cost view, not discovered at the port.",
        ],
      },
      {
        type: "image",
        src: "/gallery/12.jpeg",
        alt: "The cargo terminal and customs hall at Callao International Airport in Lima",
        caption: "Callao International Airport, Lima. An on-site logistics assessment for a client import operation routed through Peru.",
      },
      {
        type: "p",
        text: "A wrong code is rarely noticed on the day. It is noticed weeks later, in a clearance delay or an audit. Settling it before departure costs an hour. Fixing it afterwards costs a shipment.",
      },
    ],
  },

  /* ------------------------------------------------------------------ PSC news */
  {
    slug: "canadian-delegation-inside-geely-group",
    category: "news",
    title: "A Canadian trade delegation goes inside Geely Group",
    dek: "Access to Zeekr, Polestar and Lynk & Co production lines, arranged and guided by Pacific Silk.",
    date: "2026-05-20",
    author: "Pacific Silk",
    image: {
      src: "/gallery/2.jpg",
      alt: "A Pacific Silk team member explains a vehicle to members of a Canadian trade delegation at Geely Group",
    },
    topics: ["Events", "Manufacturing"],
    body: [
      {
        type: "p",
        text: "In May, a Canadian trade delegation toured Geely Group's production facilities in China, including the lines for Zeekr, Polestar and Lynk & Co. Pacific Silk arranged and guided the visit.",
      },
      {
        type: "p",
        text: "Access of this kind is not a matter of asking. It depends on relationships built over time with the people who run these sites, and on someone in the room who can explain what is being shown, in both languages, and why it matters to the visitors.",
      },
      {
        type: "p",
        text: "It is the same capability we use for client projects, applied at a larger scale: open the right doors, translate what is behind them, and leave the decisions to the people who will make them.",
      },
    ],
  },
  {
    slug: "palma-de-mallorca-and-ningbo-sign-cooperation-agreement",
    category: "news",
    title: "Palma de Mallorca and Ningbo sign a cooperation agreement",
    dek: "Six months of mediation between two delegations ended in a signed economic and cultural agreement, pending final ratification.",
    date: "2025-12-19",
    author: "Pacific Silk",
    image: {
      src: "/projects/sister_city_agreement_palma_ningbo/1.jpg",
      alt: "Representatives of Palma de Mallorca and Ningbo at the sister city agreement",
    },
    topics: ["Events", "Europe", "Market entry"],
    body: [
      {
        type: "p",
        text: "Palma de Mallorca and Ningbo have signed an economic and cultural cooperation agreement. The agreement is pending final ratification in the year ahead.",
      },
      {
        type: "p",
        text: "International institutional agreements are rarely held up by a lack of goodwill. They are held up because each side arrives with a version of success that does not match the other's. Pacific Silk led the mediation and coordination over six months, alongside the Chinese Association of the Balearic Islands and the Government of Ningbo.",
      },
      {
        type: "image",
        src: "/projects/sister_city_agreement_palma_ningbo/2.jpg",
        alt: "A man in a dark suit and red tie gives an interview to a television crew",
      },
      {
        type: "p",
        text: "The work covered regulatory navigation across both jurisdictions, the logistics of the delegation visit and structured facilitation of every formal and informal exchange. All communication between the parties ran through our team.",
      },
      {
        type: "p",
        text: "The agreement positions Palma as the primary centre for Ningbo's investments in Europe, and as a gateway for Chinese capital into Spain.",
      },
    ],
  },
  {
    slug: "mexican-chamber-of-commerce-opens-in-anhui",
    category: "news",
    title: "The Mexican Chamber of Commerce opens in Anhui Province",
    dek: "Pacific Silk built the connections and groundwork behind the inauguration, and kept working with the chamber afterwards.",
    date: "2025-08-28",
    author: "Pacific Silk",
    image: {
      src: "/gallery/8.jpg",
      alt: "The inauguration of the Mexican Chamber of Commerce in Anhui Province, China",
    },
    topics: ["Events", "Latin America"],
    body: [
      {
        type: "p",
        text: "In August 2025, the Mexican Chamber of Commerce was inaugurated in Anhui Province, China. Pacific Silk facilitated the connections and the groundwork behind the opening.",
      },
      {
        type: "p",
        text: "It is part of our ongoing work connecting Latin American business interests with Chinese manufacturing and market access. A chamber on the ground gives Mexican companies a standing presence in the province, and gives local partners a single place to meet them.",
      },
      {
        type: "image",
        src: "/gallery/5.jpeg",
        alt: "A working session with the Mexican Chamber of Commerce",
        caption: "A working session with the chamber, September 2025.",
      },
      {
        type: "p",
        text: "Since the opening we have held working sessions with the chamber. The aim is practical: more Mexican products made in China to a standard buyers can rely on, and more Chinese partners with a way into the Mexican market.",
      },
    ],
  },
  {
    slug: "pacific-silk-at-the-silk-road-international-art-exhibition",
    category: "news",
    title: "Pacific Silk at the Silk Road International Art Exhibition",
    dek: "In Palma de Mallorca, a place where our name, our heritage and our work meet.",
    date: "2025-05-22",
    author: "Pacific Silk",
    image: {
      src: "/gallery/16.jpg",
      alt: "Pacific Silk at the 2025 Silk Road International Art Exhibition in Palma de Mallorca",
    },
    topics: ["Events", "Europe"],
    body: [
      {
        type: "p",
        text: "In May 2025, Pacific Silk took part in the Silk Road International Art Exhibition in Palma de Mallorca.",
      },
      {
        type: "p",
        text: "The Silk Road was the historic trade route between China and the world. It is where our name comes from, and it is a fair description of what we do now: an infrastructure of people, relationships and operations that moves value between China and international markets.",
      },
      {
        type: "p",
        text: "An art exhibition is an unusual place for a company that sources, ships and negotiates. It was also a natural one. Trade has always carried more than goods, and the people who work between East and West tend to meet in rooms like this one.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ Helpers */

/* Newest first. Ties keep the order of the list above. */
export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/* Words in the body, at 200 words a minute. Never below one minute. */
export function readMinutes(post: BlogPost): number {
  const words = post.body
    .map((b) => {
      if (b.type === "list") return b.items.join(" ");
      if (b.type === "qa") return [b.question, ...b.answer].join(" ");
      if (b.type === "image") return b.caption ?? "";
      return b.text;
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function toCard(post: BlogPost): BlogCard {
  const { body: _body, ...rest } = post;
  void _body;
  return { ...rest, readMinutes: readMinutes(post) };
}

/* Same category first, then shared topics, then newest. Never the post itself. */
export function getRelated(post: BlogPost, count = 3): BlogPost[] {
  const score = (p: BlogPost) =>
    (p.category === post.category ? 10 : 0) + p.topics.filter((t) => post.topics.includes(t)).length;
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => score(b) - score(a) || b.date.localeCompare(a.date))
    .slice(0, count);
}

/* Most used tags first, for the "Popular topics" list. */
export function getPopularTopics(count = 8): string[] {
  const tally = new Map<string, number>();
  for (const p of posts) for (const t of p.topics) tally.set(t, (tally.get(t) ?? 0) + 1);
  return [...tally.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, count)
    .map(([t]) => t);
}
