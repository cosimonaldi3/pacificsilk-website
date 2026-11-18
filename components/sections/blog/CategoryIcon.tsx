import type { BlogCategory } from "@/content/blog";

interface CategoryIconProps {
  category: BlogCategory;
  className?: string;
}

const PATHS: Record<BlogCategory, React.ReactNode> = {
  "industry-insights": <path d="M3 17V9M8 17V4M13 17v-6M18 17H2" />,
  qa: <path d="M3 4h14v9H9l-4 3v-3H3z" />,
  "technical-notes": <path d="M7 5l-5 5 5 5M13 5l5 5-5 5" />,
  news: (
    <>
      <rect x="3" y="4" width="14" height="12" />
      <path d="M6 8h8M6 11h8M6 14h4" />
    </>
  ),
};

/* Small line icon for each category, drawn at 20px. Decorative: the label sits next to it. */
export default function CategoryIcon({ category, className = "h-5 w-5" }: CategoryIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[category]}
    </svg>
  );
}
