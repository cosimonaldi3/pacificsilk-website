import type { Post } from "@/lib/types";

// Three posts shown in the BlogBlock grid on the Capabilities page.
// Order matters: left → middle → right. Keep exactly 3 for the 3-column grid.
// To swap a post, update the url field. Middle card is the Instagram placeholder
// — replace with a real post URL once one exists.
export const posts: Post[] = [
  {
    id: "latam-trade-2026",
    platform: "linkedin",
    title: "Where is sourcing from China growing fastest?",
    excerpt:
      "Latin America grew by +13.0% YoY in China's exports in 2024. North America +4.8%. Europe +3.7%. LATAM remains the fastest-growing destination for China's trade — and the commercial opportunity that follows.",
    date: "2026-05-13",
    url: "https://www.linkedin.com/posts/pacific-silk-consulting_chinasourcing-supplychain-latinamerica-activity-7459991424772509696-Zqr3",
  },
  {
    // Instagram placeholder — links to the account until a specific post exists.
    id: "instagram-account",
    platform: "instagram",
    title: "On the ground in China",
    excerpt:
      "Factory floors, supplier visits, production runs in progress. Follow us on Instagram for a closer look at what executing a China project actually looks like.",
    date: "2026-05-18",
    url: "https://www.instagram.com/pacificsilkconsulting/",
  },
  {
    id: "china-manufacturing-2026",
    platform: "linkedin",
    title: "China produces around 30% of the world's manufactured goods",
    excerpt:
      "More than the United States, Japan, and Germany combined. Entire manufacturing regions operate as highly integrated production environments — thousands of specialized suppliers concentrated in the same geographic area.",
    date: "2026-04-18",
    url: "https://www.linkedin.com/posts/pacific-silk-consulting_china-supplychain-internationaltrade-activity-7448316453214183425-iat_",
  },
];
