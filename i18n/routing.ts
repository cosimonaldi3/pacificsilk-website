import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "zh"],
  defaultLocale: "en",
  // English stays at /, Spanish at /es/, Chinese at /zh/
  localePrefix: "as-needed",
});
