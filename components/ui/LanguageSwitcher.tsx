"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  en: "EN",
  es: "ES",
  zh: "中",
};

const NAMES: Record<string, string> = {
  en: "English",
  es: "Español",
  zh: "中文",
};

/* Chinese is a language option here: it translates the current page in place.
   The nav's "Chinese site" button is a separate entry point that asks first. */
const SWITCHABLE = routing.locales.filter((loc) => loc in LABELS);

interface Props {
  className?: string;
}

export default function LanguageSwitcher({ className }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      {SWITCHABLE.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1.5">
          {i > 0 && (
            <span
              className="text-psc-border font-sans text-small select-none"
              aria-hidden="true"
            >
              ·
            </span>
          )}
          <button
            onClick={() => router.replace(pathname, { locale: loc })}
            className={`font-sans text-small font-medium transition-colors ${
              locale === loc
                ? "text-psc-ink cursor-default"
                : "text-psc-gray hover:text-psc-ink"
            }`}
            aria-label={`Switch language to ${NAMES[loc]}`}
            aria-current={locale === loc ? "true" : undefined}
            lang={loc === "zh" ? "zh-Hans" : loc}
          >
            {LABELS[loc]}
          </button>
        </span>
      ))}
    </div>
  );
}
