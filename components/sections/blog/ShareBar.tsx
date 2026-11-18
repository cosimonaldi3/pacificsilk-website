"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SITE_URL } from "@/lib/siteUrl";

interface ShareBarProps {
  slug: string;
  title: string;
  /* "column" for the sticky rail beside the article, "row" everywhere else */
  layout?: "row" | "column";
}

const BUTTON =
  "flex h-10 w-10 items-center justify-center rounded-full border border-psc-border text-psc-ink transition hover:border-psc-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red";

/* Share links. Plain anchors to each network's own share page: no third-party script loads on
   our site. The copy button uses the clipboard and says so out loud for screen readers. */
export default function ShareBar({ slug, title, layout = "row" }: ShareBarProps) {
  const t = useTranslations("blog.share");
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const url = `${SITE_URL}${locale === "en" ? "" : `/${locale}`}/blog/${slug}`;
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked (insecure context or permissions): the other links still work
    }
  }

  return (
    <div className={layout === "column" ? "flex flex-col items-start gap-3" : "flex flex-wrap items-center gap-3"}>
      <p className="font-sans text-small font-medium uppercase tracking-widest text-psc-gray">{t("label")}</p>
      <ul className={layout === "column" ? "flex flex-col gap-3" : "flex items-center gap-3"}>
        <li>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("linkedin")}
            title={t("linkedin")}
            className={BUTTON}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </li>
        <li>
          <a
            href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("x")}
            title={t("x")}
            className={BUTTON}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </li>
        <li>
          <a
            href={`mailto:?subject=${text}&body=${encoded}`}
            aria-label={t("email")}
            title={t("email")}
            className={BUTTON}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="1" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </a>
        </li>
        <li>
          <button type="button" onClick={copy} aria-label={t("copy")} title={t("copy")} className={BUTTON}>
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
              <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
            </svg>
          </button>
        </li>
      </ul>
      <p role="status" className="min-h-5 font-sans text-[13px] text-psc-gray">
        {copied ? t("copied") : ""}
      </p>
    </div>
  );
}
