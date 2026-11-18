import type { StartContent } from "@/content/start";

const BOOKING_URL = "https://calendar.app.google/VShyN9ZBhhhT67jK6";
const EMAIL_ADDRESS = "contact@pacificsilk.com";

export const startContent: StartContent = {
  meta: {
    title: "Inicia tu proyecto — Pacific Silk Group",
    description:
      "Cuéntanos en qué estás trabajando. Responderemos en un día hábil con una propuesta de hora para hablar.",
  },
  pageTitle: "Inicia tu proyecto",
  intro:
    "Cuéntanos en qué estás trabajando. Responderemos en un día hábil con una propuesta de hora para hablar.",

  bookingHeading: "¿Prefieres hablar primero?",
  bookingBody: "Reserva directamente una llamada introductoria de 30 minutos en nuestro calendario.",
  bookingCtaLabel: "Reservar llamada",
  bookingUrl: BOOKING_URL,

  emailHeading: "O envíanos un mensaje",
  emailBody: "Si prefieres empezar con un mensaje rápido:",
  emailAddress: EMAIL_ADDRESS,

  thanks: {
    heading: "Ahora nos ponemos a trabajar.",
    body: "Tu mensaje ha llegado. Uno de nosotros se pondrá en contacto contigo en un día hábil — generalmente antes.",
    signoff: "— Jorge & Jorge",

    shortcutsHeading: "¿Quieres avanzar más rápido?",
    bookingShortcutLabel: "Reservar una llamada de 30 minutos",
    bookingShortcutUrl: BOOKING_URL,
    emailShortcutLabel: "Escríbenos directamente",
    emailShortcutAddress: EMAIL_ADDRESS,

    onwardHeading: "Mientras estás aquí",
    onwardLinks: [
      { label: "Volver al inicio", href: "/" },
      { label: "Sobre la alianza", href: "/about" },
      { label: "Cómo trabajamos", href: "/process" },
    ],

    socialHeading: "Encuéntranos en otras plataformas",
    socialLinks: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/pacific-silk-consulting/" },
    ],
  },
};
