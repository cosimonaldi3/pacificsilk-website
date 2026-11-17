"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Container from "./Container";
import Logo from "@/components/Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import ChineseSiteDialog from "./ChineseSiteDialog";

const navItems = [
  { key: "process" as const, href: "/process" as const },
  { key: "capabilities" as const, href: "/client-impact" as const },
  { key: "about" as const, href: "/about" as const },
  { key: "gallery" as const, href: "/gallery" as const },
  { key: "tools" as const, href: "/tools/shipping-estimate" as const },
  { key: "portal" as const, href: "/portal/login" as const, target: "_blank" as const },
] satisfies Array<{ key: string; href: string; target?: string }>;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [chineseOpen, setChineseOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  // On the Chinese site there is nothing to switch to, so the entry point is hidden
  const showChineseSite = locale !== "zh";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-psc-border bg-psc-bg/95 backdrop-blur-sm">
      <Container className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Pacific Silk Consulting — home"
          className="hover:opacity-80 transition flex items-center"
        >
          <Logo
            variant="psc-horizontal-black"
            width={160}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop nav links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.target}
              rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
              className="font-sans text-small font-medium text-psc-gray hover:text-psc-ink transition"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Desktop: language switcher + CTA | Mobile: hamburger */}
        <div className="flex items-center gap-4">
          {showChineseSite && (
            <button
              type="button"
              onClick={() => setChineseOpen(true)}
              aria-haspopup="dialog"
              className="hidden lg:inline-block font-sans text-small font-medium text-psc-gray border border-psc-border rounded-full px-3 py-1.5 hover:text-psc-ink hover:border-psc-ink transition"
            >
              {t("chineseSite")}
            </button>
          )}
          <LanguageSwitcher className="hidden lg:flex" />
          <Link
            href="/start"
            className="hidden lg:inline-block font-sans text-small font-medium rounded-full px-5 py-2.5 bg-psc-ink text-psc-bg hover:opacity-80 transition"
          >
            {t("cta")}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            className="lg:hidden p-2 -mr-2 text-psc-ink"
          >
            {open ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-psc-border bg-psc-bg">
          <Container className="py-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.target}
                rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="font-sans text-body font-medium text-psc-ink hover:text-psc-red transition py-3 border-b border-psc-border last:border-0"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/start"
              onClick={() => setOpen(false)}
              className="mt-4 inline-block text-center font-sans text-small font-medium rounded-full px-5 py-3 bg-psc-ink text-psc-bg hover:opacity-80 transition"
            >
              {t("cta")}
            </Link>
            {/* Chinese side + language switcher — bottom of mobile menu */}
            <div className="mt-4 pt-4 border-t border-psc-border flex items-center justify-between">
              <LanguageSwitcher />
              {showChineseSite && (
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => {
                    setOpen(false);
                    setChineseOpen(true);
                  }}
                  className="font-sans text-small font-medium text-psc-gray border border-psc-border rounded-full px-3 py-1.5 hover:text-psc-ink transition"
                >
                  {t("chineseSite")}
                </button>
              )}
            </div>
          </Container>
        </div>
      )}

      {showChineseSite && (
        <ChineseSiteDialog open={chineseOpen} onClose={() => setChineseOpen(false)} />
      )}
    </header>
  );
}
