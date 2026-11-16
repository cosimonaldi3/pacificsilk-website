import type { ProcessPageContent } from "@/content/process";

export const processContent: ProcessPageContent = {
  meta: {
    title: "Proceso — Pacific Silk Group",
    description:
      "De la idea a la entrega en cuatro etapas. Dos equipos trabajan en paralelo, uno en tu país y otro en China. Tú solo hablas con uno.",
  },
  intro: {
    label: "Proceso",
    headline: "De la idea a la entrega.",
    subline: "Cuatro etapas. Dos equipos trabajando en paralelo. Un solo equipo hablando contigo.",
    image: "/images/home/process-bridge.jpg",
    imageAlt: "Un largo puente sobre el mar que se curva hacia un puente colgante lejano al atardecer",
  },
  lanes: {
    label: "Dos equipos, un camino",
    headline: "Tu país y China, avanzando juntos.",
    localLabel: "Local",
    localSub: "El equipo de tu país",
    chinaLabel: "China",
    chinaSub: "Nuestro equipo sobre el terreno",
    hint: "Selecciona una etapa para ver quién hace qué.",
  },
  detail: {
    label: "Detalle de la etapa",
    cards: {
      local: "El equipo de tu país",
      china: "El equipo en China",
      youGet: "Recibes",
      youDecide: "Tú decides",
    },
  },
  stages: [
    {
      name: "Definir",
      span: "De cero a una decisión de seguir o no seguir",
      local: "Escucha y define el alcance de tu proyecto en tu idioma.",
      china: "Comprueba sobre el terreno lo que las fábricas pueden hacer de verdad.",
      youGet: "Un alcance claro y una primera propuesta.",
      youDecide: "Si seguir adelante. Nada se mueve sin tu visto bueno.",
    },
    {
      name: "Validar",
      span: "Hasta elegir al socio adecuado",
      local: "Te mantiene informado en tu idioma y alinea el proyecto con lo que exige tu mercado.",
      china: "Busca candidatos, negocia en chino, visita y valida.",
      youGet: "Un socio validado y la información para decidir.",
      youDecide: "El socio y las muestras.",
    },
    {
      name: "Ejecutar",
      span: "Del pedido al envío",
      local: "Prepara el lado de destino: documentos, aduanas y recepción.",
      china: "Sigue la producción, revisa la calidad y prepara el envío.",
      youGet: "Producción seguida y revisada, envío con la documentación en orden.",
      youDecide: "El visto bueno antes de que salga nada.",
    },
    {
      name: "Más allá",
      span: "La entrega y el siguiente proyecto",
      local: "Recibe y revisa la mercancía a la llegada, y apoya la entrega y las dudas de importación.",
      china: "Mantiene la relación con el fabricante lista para el siguiente pedido.",
      youGet: "Mercancía revisada a la llegada y un equipo listo para el siguiente proyecto.",
      youDecide: "Qué viene después.",
    },
  ],
  define: {
    intro:
      "Hablas con personas de nuestra red en tu región, con conocimiento local y del sector. Juntos ves hasta dónde puede llegar tu proyecto trabajando en o con China.",
    expandLabel: "Ver detalles",
    closeLabel: "Ocultar detalles",
    insight: {
      title: "Visión de tu mercado en China",
      body: "Qué productos fabrica China, qué tan fuerte es cada industria y dónde está. Explicado por personas con conocimiento local y del sector, en tu idioma.",
      link: { label: "Iniciar un proyecto", href: "/start" },
      cardTitle: "Dónde lo fabrica China",
      legendHub: "Gran centro",
      legendRegion: "Polo regional",
      cities: { shenzhen: "Shenzhen", shanghai: "Shanghái" },
      products: { electronics: "Electrónica", machinery: "Maquinaria", textiles: "Textil", footwear: "Calzado", tea: "Té" },
    },
    opportunity: {
      title: "Oportunidades de negocio",
      body: "Hasta dónde puede llegar tu proyecto con China: los productos, los socios y los mercados que abre.",
      link: { label: "Iniciar un proyecto", href: "/start" },
      center: "Tu proyecto",
      chips: ["Productos", "Socios", "Mercados"],
    },
    cost: {
      title: "Costes transparentes",
      body: "Un desglose claro de lo que costará el proyecto antes de comprometerte: producto, producción, flete y aranceles.",
      link: { label: "Iniciar un proyecto", href: "/start" },
      cardTitle: "Desglose de costes",
      segments: ["Producto", "Producción", "Flete", "Aranceles"],
      note: "Cada línea explicada",
    },
    growth: {
      title: "Cómo puede crecer",
      body: "Ve el camino de un primer proyecto a la cooperación, los joint ventures y los nuevos mercados.",
      link: { label: "Iniciar un proyecto", href: "/start" },
      steps: ["Proyecto individual", "Cooperación", "Joint venture", "Nuevos mercados"],
    },
    trip: {
      title: "Viaje de prospección",
      body: "Viaja a China con nosotros: conoce a las personas y los lugares que importan antes de decidir.",
      link: { label: "Iniciar un proyecto", href: "/start" },
      cardTitle: "Plan del viaje",
      items: ["Conocer a las personas", "Visitar los sitios", "Verlo funcionando"],
      globe: { from: "Tu país", to: "China", status: "Viaje planificado" },
    },
  },
  finalCta: {
    headline: "Mira cómo sería tu camino.",
    body: "Responde cuatro preguntas y obtén una primera visión de tu proyecto. Gratis, sin compromiso.",
    cta: { label: "Construye el camino de tu proyecto", href: "/#builder" },
    secondary: [{ label: "Iniciar un proyecto", href: "/start" }],
  },
};
