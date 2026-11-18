const DATE_LOCALES: Record<string, string> = { en: "en-GB", es: "es-ES", zh: "zh-CN" };

/* "12 Nov 2026". Fixed to UTC: post dates are plain calendar days, and the server and the
   browser must print the same day whatever their time zone. */
export function formatPostDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(DATE_LOCALES[locale] ?? "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
