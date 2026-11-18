import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import { startContent } from "@/content/start";

async function loadContent(locale: string) {
  if (locale === "es")
    return (await import("@/content/i18n/es/start")).startContent;
  if (locale === "zh")
    return (await import("@/content/i18n/zh/start")).startContent;
  return startContent;
}

export const metadata: Metadata = {
  title: "Message received — Pacific Silk Group",
  description:
    "Your project inquiry is in. We'll be in touch within one business day.",
};

export default async function ThanksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { thanks } = await loadContent(locale);

  return (
    <>
      <Nav />
      <main className="bg-psc-bg">
        <section className="py-32 md:py-40">
          <Container>
            <div className="max-w-3xl">
              {/* Hero block — the emotional payoff */}
              <h1 className="font-display text-display leading-display font-medium text-psc-ink mb-8">
                {thanks.heading}
              </h1>
              <p className="font-sans text-body leading-body text-psc-gray mb-6">
                {thanks.body}
              </p>
              <p className="font-display text-h3 font-medium text-psc-gray italic mb-24">
                {thanks.signoff}
              </p>

              {/* Shortcuts block */}
              <hr className="border-psc-border mb-10" />
              <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-6">
                {thanks.shortcutsHeading}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-20">
                <a
                  href={thanks.bookingShortcutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-small font-medium text-psc-ink border border-psc-border px-5 py-3 text-center hover:border-psc-ink transition-colors"
                >
                  {thanks.bookingShortcutLabel} →
                </a>
                <a
                  href={`mailto:${thanks.emailShortcutAddress}`}
                  className="font-sans text-small font-medium text-psc-gray hover:text-psc-ink transition-colors self-center"
                >
                  {thanks.emailShortcutLabel}
                </a>
              </div>

              {/* Onward block */}
              <hr className="border-psc-border mb-10" />
              <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-6">
                {thanks.onwardHeading}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mb-20">
                {thanks.onwardLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href as "/"}
                    className="font-sans text-small text-psc-gray hover:text-psc-ink underline underline-offset-4 decoration-psc-border hover:decoration-psc-gray transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Social block */}
              <hr className="border-psc-border mb-8" />
              <p className="font-sans text-small font-medium text-psc-gray uppercase tracking-widest mb-4">
                {thanks.socialHeading}
              </p>
              <div className="flex gap-6">
                {thanks.socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-small text-psc-gray hover:text-psc-ink transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <footer className="bg-psc-ink py-16">
        <Footer />
      </footer>
    </>
  );
}
