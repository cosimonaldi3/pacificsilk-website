"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface ChineseSiteDialogProps {
  open: boolean;
  onClose: () => void;
}

/* Native <dialog> gives focus trapping, Esc to close and focus return for free.
   The backdrop is dimmed and lightly blurred so the dialog is the only thing to read. */
export default function ChineseSiteDialog({ open, onClose }: ChineseSiteDialogProps) {
  const t = useTranslations("nav.chineseSiteDialog");
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Keep the page behind the dialog from scrolling while it is open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="chinese-site-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[min(520px,calc(100%-32px))] rounded-2xl border border-psc-border bg-psc-bg p-8 text-psc-ink shadow-2xl backdrop:bg-psc-ink/55 backdrop:backdrop-blur-[3px] md:p-10"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="chinese-site-title" className="font-display text-3xl font-medium leading-tight">
          {t("title")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="-mr-2 -mt-1 p-2 text-psc-gray hover:text-psc-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
        >
          ✕
        </button>
      </div>
      <p className="mt-4 font-sans text-body leading-relaxed text-psc-gray">{t("body")}</p>
      <p className="mt-6 font-sans text-body font-medium text-psc-ink">{t("question")}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          locale="zh"
          lang="zh-Hans"
          onClick={onClose}
          className="inline-block text-center rounded-full bg-psc-ink px-6 py-3 font-sans text-small font-medium text-psc-bg hover:opacity-80 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
        >
          {t("go")}
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="inline-block text-center rounded-full border border-psc-border px-6 py-3 font-sans text-small font-medium text-psc-ink hover:border-psc-ink transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-psc-red"
        >
          {t("stay")}
        </button>
      </div>
    </dialog>
  );
}
