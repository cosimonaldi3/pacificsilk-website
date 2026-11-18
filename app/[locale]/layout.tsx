import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Fonts are self-hosted from app/fonts (latin subset, variable weight) so dev and
// build never need to reach Google Fonts. Source: Google Fonts, SIL Open Font License.
const cormorant = localFont({
  src: "../fonts/CormorantGaramond-latin.woff2",
  weight: "400 600",
  variable: "--font-cormorant",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/Inter-latin.woff2",
  weight: "400 600",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pacific Silk Group",
  description:
    "We provide the infrastructure. You make the decisions. An operational bridge to China.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();
  const langAttr = locale === "zh" ? "zh-Hans" : locale;

  return (
    <html
      lang={langAttr}
      data-locale={locale}
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
