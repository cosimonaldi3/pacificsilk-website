import type { StartContent } from "@/content/start";

const BOOKING_URL = "https://calendar.app.google/VShyN9ZBhhhT67jK6";
const EMAIL_ADDRESS = "contact@pacificsilk.com";

export const startContent: StartContent = {
  meta: {
    title: "Inicia tu proyecto — Pacific Silk Group",
    description:
      "Cuéntanos quién eres y qué necesitas. Respondemos en un día hábil con una primera propuesta.",
  },
  pageTitle: "Inicia tu proyecto",
  intro:
    "Cuéntanos quién eres. Tu plan está abajo: cambia lo que quieras. Respondemos en un día hábil.",

  form: {
    heading: "Tus datos",
    fields: {
      name: { label: "Nombre", placeholder: "Tu nombre completo" },
      email: { label: "Email de trabajo", placeholder: "tu@empresa.com" },
      company: { label: "Empresa", placeholder: "Nombre de la empresa" },
      country: { label: "País", placeholder: "Dónde estás" },
      phone: { label: "Teléfono o WhatsApp", placeholder: "+34 600 000 000" },
      message: { label: "Detalles del proyecto", placeholder: "Producto, cantidades, plazos: lo que ya sepas." },
    },
    optionalLabel: "opcional",
    errors: {
      required: "Obligatorio.",
      email: "Introduce un email válido.",
      summary: "Revisa los campos marcados.",
      server: "Algo salió mal al enviar tus datos. Inténtalo de nuevo o escríbenos a contact@pacificsilk.com.",
      rateLimited: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo, o escríbenos a contact@pacificsilk.com.",
    },
    submitLabel: "Enviar datos",
    blueprintCount: "Se envía con tu plan: {n} servicios",
    blueprintCountOne: "Se envía con tu plan: 1 servicio",
  },

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
