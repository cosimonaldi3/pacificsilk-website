import { startContent } from "@/content/i18n/es/start";
import type { AboutContent } from "@/content/about";

export const aboutContent: AboutContent = {
  meta: {
    title: "Nosotros — Pacific Silk Consulting",
    description:
      "Las personas y la historia detrás de Pacific Silk Consulting y la Alianza Pacific Silk.",
  },
  story: {
    label: "Quiénes somos",
    headline: "Construidos para la complejidad\nde China.",
    body: "Para la mayoría de las empresas internacionales, la palabra 'China' desencadena la misma reacción: incertidumbre. Proveedores equivocados. Problemas de calidad. Retrasos logísticos. Fallos de comunicación. Construimos PSC para eliminar todo eso — no con asesoría, sino con una operación.",
  },
  team: [
    {
      name: "Jorge Villalonga Moragues",
      title: "Director de la Región Asia",
      company: "Pacific Silk Consulting",
      bio: "Jorge gestiona el lado chino de cada proyecto — conversaciones con proveedores, visitas a fábricas, controles de producción. Él es la razón por la que los problemas se detectan antes de llegar a ti.",
      photo: "/team/jorgev-villalonga-jr.png",
      placeholder: false,
    },
    {
      name: "Jorge Villalonga Fuster",
      title: "Director de la Región Europa",
      company: "Pacific Silk Consulting",
      bio: "Cofundador de PSC. Jorge gestiona la relación con los clientes europeos, basándose en décadas de negocio transfronterizo entre España y China.",
      photo: "/team/jorge-villalonga-sr.png",
      placeholder: false,
    },
    {
      name: "顾朱挺 — James Gu",
      title: "CEO",
      company: "Sun Port Logistics (SPL)",
      bio: "James pasó más de una década en COSCO Shipping antes de construir SPL. Dirige el transporte, aduanas y entrega de cada proyecto PSC — desde los puertos de China hasta tu puerta.",
      photo: "/team/james.png",
      placeholder: false,
    },
    {
      name: "企鹅 — Freud Mao",
      title: "CEO",
      company: "Lance Trade",
      bio: "Freud lleva más de veinte años dentro del ecosistema de fábricas chinas. Sabe qué proveedores cumplen y cuáles solo prometen. Lance Trade está construida sobre esas relaciones.",
      photo: "/team/freud.png",
      placeholder: false,
    },
  ],
  carousel: {
    sectionLabel: "En nuestras propias palabras",
    items: [
      {
        kind: "testimonial",
        id: "jorge-jr",
        label: "Director de la Región Asia",
        quote:
          "El suelo de la fábrica es donde descubres de qué es capaz realmente un proveedor. He estado en suficientes como para saber qué buscar — y de qué alejarse.",
        name: "Jorge Villalonga Moragues",
        title: "Pacific Silk Consulting",
        photo: "/testimonials/factory-floor.jpg",
      },
      {
        kind: "testimonial",
        id: "jorge-sr",
        label: "Director de la Región Europa",
        quote:
          "Seguíamos viendo el mismo problema: cada vez que una empresa mencionaba China, la conversación cambiaba. Incertidumbre. Complejidad. Riesgo. Sabíamos que esos problemas tenían solución. Construimos PSC para resolverlos.",
        name: "Jorge Villalonga Fuster",
        title: "Pacific Silk Consulting",
        photo: "/testimonials/shipping-documents.jpg",
      },
      {
        kind: "reflection",
        id: "shenzhen-2023",
        label: "Shenzhen, 2023",
        quote:
          "Caminas por una fábrica a las 6am y lo entiendes todo. Las máquinas no mienten. Los trabajadores no mienten. El polvo te dice cuánto tiempo llevan en marcha.",
      },
      {
        kind: "reflection",
        id: "on-trust",
        label: "Sobre la confianza",
        quote:
          "En China, las relaciones preceden a los contratos. El proveedor que te devuelve la llamada un sábado es el que realmente quiere el negocio. Nosotros sabemos cuáles hacen esa llamada.",
      },
      {
        kind: "reflection",
        id: "on-speed",
        label: "Sobre la velocidad",
        quote:
          "Una fábrica que se mueve rápido lo hace porque alguien sobre el terreno la exige. La velocidad no es un rasgo de la fábrica. Es un rasgo de la gestión.",
      },
    ],
  },
  alliance: {
    headline: "Tres empresas. Una operación.",
    body: "La mayoría de las firmas asesoran. Nosotros ejecutamos. PSC es la cara internacional de un joint venture de tres empresas — Pacific Silk Consulting, SPL y Lance Trade. Cuando nos contratas, accedes a las tres a través de un único contrato.",
    companies: [
      {
        name: "Pacific Silk Consulting",
        role: "Consultoría internacional, estrategia y relaciones con clientes",
        logo: "psc-horizontal-white",
        image: "/images/alliance/psc.jpeg",
      },
      {
        name: "SPL",
        role: "Logística, transporte, aduanas y almacenaje",
        logo: "spl-reversed",
        logoClassName: "brightness-0 invert",
        image: "/images/alliance/spl.jpeg",
      },
      {
        name: "Lance Trade",
        role: "Abastecimiento, selección de proveedores y gestión de producción",
        logo: "lance-reversed",
        image: "/images/alliance/lance.jpeg",
      },
    ],
  },
  presence: {
    label: "Dónde estamos",
    headline: "Pacific Silk, país por país",
    chipsLabel: "Elige un país",
    globeLabel: "Globo con el país seleccionado",
    countries: [
      {
        id: "spain",
        chip: "España",
        title: "Pacific Silk España",
        body: "Tu primera conversación puede ser aquí, en español, con un equipo que conoce tu mercado.",
        actions: [{ label: "Empezar un proyecto aquí", href: "/start" }],
      },
      {
        id: "peru",
        chip: "Perú",
        title: "Pacific Silk Perú",
        body: "Tu primera conversación puede ser aquí, en español, con un equipo que conoce tu mercado.",
        actions: [{ label: "Empezar un proyecto aquí", href: "/start" }],
      },
      {
        id: "china",
        chip: "China",
        title: "Pacific Silk China",
        body: "Nuestro equipo sobre el terreno, hablando con fábricas cada día. Las empresas y proveedores chinos tienen su propia sección.",
        actions: [
          { label: "Ir a la sección china", href: "/", locale: "zh" },
          { label: "Empezar un proyecto aquí", href: "/start" },
        ],
      },
      {
        id: "more",
        chip: "Más países",
        title: "La red sigue creciendo",
        body: "Crece país por país. ¿Quieres Pacific Silk donde estás tú?",
        actions: [{ label: "Cuéntanos sobre tu país", href: "/start" }],
      },
    ],
  },
  joinNetwork: {
    label: "La red",
    headline: "De cliente a colaborador",
    path: ["Cliente", "Colaborador", "Red"],
    tiles: [
      {
        title: "Hazte colaborador",
        body: "Para clientes que ya han trabajado con nosotros en proyectos y quieren crecer con la red.",
        action: { label: "Solicitar", href: "/start" },
      },
      {
        title: "Ofrece tus servicios",
        body: "Para proveedores que quieren formar parte de proyectos en su propio país.",
        action: { label: "Preséntate", href: `mailto:${startContent.emailAddress}` },
      },
    ],
    footnote: "Se gestiona país por país. Aquí no se publican condiciones.",
  },
  finalCta: {
    headline: "¿Listo para ponernos a trabajar?",
    body: "Dinos qué necesitas. Te diremos qué es posible.",
    cta: { label: "Iniciar proyecto", href: "/start" },
  },
};
