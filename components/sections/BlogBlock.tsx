import Link from "next/link";
import Container from "@/components/ui/Container";
import type { CapabilitiesPageContent } from "@/content/capabilities";
import type { Post } from "@/lib/types";

interface BlogBlockProps {
  content: CapabilitiesPageContent["blogSection"];
  posts: Post[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function platformLabel(platform: Post["platform"]): string {
  if (platform === "instagram") return "View on Instagram →";
  return "Read on LinkedIn →";
}

export default function BlogBlock({ content, posts }: BlogBlockProps) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-psc-muted py-24 md:py-32">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
              {content.label}
            </p>
            <h2 className="font-display text-h1 font-medium text-psc-ink">
              {content.headline}
            </h2>
          </div>

          {/* Social follow links */}
          <div className="flex items-center gap-6 shrink-0">
            <Link
              href={content.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-small font-medium text-psc-ink underline underline-offset-4 hover:text-psc-red transition-colors"
            >
              {content.linkedInLabel} →
            </Link>
            <Link
              href={content.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-small font-medium text-psc-ink underline underline-offset-4 hover:text-psc-red transition-colors"
            >
              {content.instagramLabel} →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-psc-bg border border-psc-border hover:border-psc-ink transition-colors"
            >
              <div className="p-6">
                <p className="font-sans text-small text-psc-gray mb-4">
                  {formatDate(post.date)}
                </p>
                <h3 className="font-display text-h3 font-medium text-psc-ink mb-3 leading-snug group-hover:text-psc-red transition-colors">
                  {post.title}
                </h3>
                <p className="font-sans text-body leading-body text-psc-gray line-clamp-3">
                  {post.excerpt}
                </p>
                <p className="font-sans text-small text-psc-gray mt-4 group-hover:text-psc-ink transition-colors">
                  {platformLabel(post.platform)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
