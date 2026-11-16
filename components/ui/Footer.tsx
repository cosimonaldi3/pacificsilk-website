import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import Logo from "@/components/Logo";

export default async function Footer() {
  const t = await getTranslations("footer");

  const navLinks = [
    { key: "process" as const, href: "/process" as const },
    { key: "capabilities" as const, href: "/capabilities" as const },
    { key: "about" as const, href: "/about" as const },
    { key: "tools" as const, href: "/tools/shipping-estimate" as const },
    { key: "portal" as const, href: "/portal/login" as const, target: "_blank" as const },
    { key: "privacy" as const, href: "/privacy" as const },
    { key: "terms" as const, href: "/terms" as const },
  ] satisfies Array<{ key: string; href: string; target?: string }>;

  return (
    <Container>
      {/* Row 1: logo + email */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center pb-10">
        <Logo variant="psc-horizontal-white" width={240} className="h-12 w-auto" />
        <div className="flex flex-col items-start md:items-end gap-3">
          <a
            href="mailto:contact@pacificsilkconsulting.com"
            className="font-sans text-small text-psc-bg/70 hover:text-psc-bg transition-colors"
          >
            contact@pacificsilkconsulting.com
          </a>
          <div className="flex items-center gap-4">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/pacific-silk-consulting"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pacific Silk Consulting on LinkedIn"
              className="text-psc-bg/50 hover:text-psc-bg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/pacificsilkconsulting/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pacific Silk Consulting on Instagram"
              className="text-psc-bg/50 hover:text-psc-bg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Row 2: nav links (wrap on mobile) */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 pb-10">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.target}
            rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
            className="font-sans text-small text-psc-bg/70 hover:text-psc-bg transition-colors"
          >
            {t(`links.${link.key}`)}
          </Link>
        ))}
      </div>

      {/* Row 3: CTA + tagline */}
      <div className="border-t border-psc-bg/10 pt-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <Link
          href="/start"
          className="inline-block border border-psc-bg/30 text-psc-bg font-sans text-small font-medium px-5 py-2.5 hover:border-psc-bg hover:bg-psc-bg hover:text-psc-ink transition-all"
        >
          {t("cta")}
        </Link>
        <span className="font-sans text-small text-psc-bg/50">
          {t("tagline")}
        </span>
      </div>

      {/* Row 4: copyright */}
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center pt-6">
        <span className="font-sans text-small text-psc-bg/40">
          {t("copyright")}
        </span>
        <span className="font-display text-small text-psc-bg/40">PSC</span>
      </div>
    </Container>
  );
}
