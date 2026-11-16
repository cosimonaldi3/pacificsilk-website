export interface GalleryItem {
  id: number;
  src: string; // /public path, e.g. "/gallery/7.jpg"
  alt: string; // descriptive alt text for accessibility
  location: string;
  description: string;
  date: string; // e.g. "March 2025"
}

/**
 * To add a photo: drop the file in public/gallery/ named by number,
 * then append one entry here. The id should match the filename.
 * Photos 9 and 10 are not available — omitted to keep the strip gapless.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/gallery/1.jpg",
    alt: "Electrical products manufacturing facility, Zhejiang Province",
    location: "Zhejiang Province, China",
    description:
      "Supplier assessment at an electrical products manufacturer in Zhejiang. Part of an active sourcing brief for a European client.",
    date: "May 2026",
  },
  {
    id: 2,
    src: "/gallery/2.jpg",
    alt: "Canadian trade delegation at Geely Group production facilities",
    location: "Geely Group, China",
    description:
      "A Canadian trade delegation touring Geely Group's production lines — Zeekr, Polestar, and Lynk & Co. Access arranged and guided by Pacific Silk.",
    date: "May 2026",
  },
  {
    id: 3,
    src: "/gallery/3.jpg",
    alt: "Electric manufacturing plant, Shanghai",
    location: "Shanghai, China",
    description:
      "Production facility review at an electric manufacturing plant in Shanghai. Capacity and quality assessment conducted on behalf of a client sourcing brief.",
    date: "August 2025",
  },
  {
    id: 4,
    src: "/gallery/4.jpeg",
    alt: "Manufacturing equipment and machinery exhibition, Hefei",
    location: "Hefei, Anhui Province, China",
    description:
      "Industry exhibition covering manufacturing equipment and machinery in Hefei. Scouting for suppliers and technology relevant to active client projects.",
    date: "2025",
  },
  {
    id: 5,
    src: "/gallery/5.jpeg",
    alt: "Working session with the Mexican Chamber of Commerce",
    location: "China",
    description:
      "Working session with the Mexican Chamber of Commerce. Part of Pacific Silk's ongoing work connecting Latin American business interests with Chinese manufacturing and market access.",
    date: "September 2025",
  },
  {
    id: 6,
    src: "/gallery/6.jpeg",
    alt: "Plastic injection manufacturing facility, Shenzhen",
    location: "Shenzhen, China",
    description:
      "Factory visit to a plastic injection manufacturer in Shenzhen. Production lines reviewed for a packaging sourcing project.",
    date: "September 2025",
  },
  {
    id: 7,
    src: "/gallery/7.jpeg",
    alt: "Strategic meeting with Spain's Secretary of State for Tourism",
    location: "Spain",
    description:
      "Strategic advisory session with Rosario Sánchez, Spain's Secretary of State for Tourism. Developing market entry strategies for attracting high-value Chinese tourism to Spain.",
    date: "2025",
  },
  {
    id: 8,
    src: "/gallery/8.jpg",
    alt: "Inauguration of the Mexican Chamber of Commerce, Anhui Province",
    location: "Anhui Province, China",
    description:
      "Inauguration of the Mexican Chamber of Commerce in Anhui Province. Pacific Silk facilitated the connections and groundwork behind this opening.",
    date: "August 2025",
  },
  // Photos 9 and 10 not available — skipped to keep the strip gapless
  {
    id: 11,
    src: "/gallery/11.jpg",
    alt: "Huadong Electrical Power transformer manufacturing facility",
    location: "China",
    description:
      "Technical visit to Huadong Electrical Power's transformer manufacturing facility. Capacity and specification review for an infrastructure sourcing project.",
    date: "September 2025",
  },
  {
    id: 12,
    src: "/gallery/12.jpeg",
    alt: "Air-cargo terminal and customs area, Callao Airport, Lima",
    location: "Callao Airport, Lima, Peru",
    description:
      "On-site visit to the air-cargo terminal and customs area at Callao International Airport. Logistics assessment for a client import operation routed through Peru.",
    date: "August 2025",
  },
  {
    id: 13,
    src: "/gallery/13.jpeg",
    alt: "COSCO Shipping offices, Lima, Peru",
    location: "Lima, Peru",
    description:
      "Meeting at COSCO Shipping's Lima offices. Part of our logistics coordination work for clients moving cargo through South American ports.",
    date: "August 2025",
  },
  {
    id: 14,
    src: "/gallery/14.jpeg",
    alt: "Broad Group modular housing manufacturing facility",
    location: "China",
    description:
      "Visit to Broad Group's modular housing manufacturing facility. Production capabilities assessed for a client exploring prefabricated building solutions at scale.",
    date: "November 2025",
  },
  {
    id: 15,
    src: "/gallery/15.jpeg",
    alt: "BOTON food and beverage production facility, Shenzhen",
    location: "Shenzhen, China",
    description:
      "Factory visit to BOTON's food and beverage production facility in Shenzhen. Capacity and quality review for a client in the consumer goods sector.",
    date: "2025",
  },
  {
    id: 16,
    src: "/gallery/16.jpg",
    alt: "2025 Silk Road International Art Exhibition, Palma de Mallorca",
    location: "Palma de Mallorca, Spain",
    description:
      "Pacific Silk at the 2025 Silk Road International Art Exhibition in Mallorca. A natural convergence of our name, our heritage, and our work connecting East and West.",
    date: "May 2025",
  },
  {
    id: 17,
    src: "/gallery/17.jpg",
    alt: "Pacific Silk warehouse and climate-controlled storage, Ningbo",
    location: "Ningbo, Zhejiang Province, China",
    description:
      "Pacific Silk's warehouse and climate-controlled storage area in Ningbo. Infrastructure that supports our clients' logistics and supply chain operations across East China.",
    date: "August 2025",
  },
  {
    id: 18,
    src: "/gallery/18.jpg",
    alt: "Pacific Silk's first international business development trip",
    location: "International",
    description:
      "Pacific Silk's first international business development trip. Building the relationships and market knowledge that define how we operate.",
    date: "May 2025",
  },
  {
    id: 19,
    src: "/gallery/19.jpg",
    alt: "Spanish winery sourcing visit",
    location: "Spain",
    description:
      "On-the-ground sourcing visit to Spanish wine producers. Evaluating estates for a client looking to bring Spanish wine into the Chinese market.",
    date: "March 2025",
  },
];
