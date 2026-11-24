import { BOOKING_URL } from "./start.ts";

/* The three buttons that close every page with a final call to action (FinalCta).
   Same everywhere on purpose: one place to change them. Headline and body stay per page. */

export interface FinalCtaButton {
  label: string;
  href: string;
  external?: boolean;
}

export interface FinalCtaButtons {
  primary: FinalCtaButton;
  secondary: FinalCtaButton[];
}

export const finalCtaButtons: Record<"en" | "es" | "zh", FinalCtaButtons> = {
  en: {
    primary: { label: "Build your project path", href: "/start" },
    secondary: [
      { label: "Book a call", href: BOOKING_URL, external: true },
      { label: "Join the network", href: "/about#network" },
    ],
  },
  es: {
    primary: { label: "Construye el camino de tu proyecto", href: "/start" },
    secondary: [
      { label: "Agendar una llamada", href: BOOKING_URL, external: true },
      { label: "Unirse a la red", href: "/about#network" },
    ],
  },
  zh: {
    primary: { label: "规划您的项目路径", href: "/start" },
    secondary: [
      { label: "预约通话", href: BOOKING_URL, external: true },
      { label: "加入网络", href: "/about#network" },
    ],
  },
};
