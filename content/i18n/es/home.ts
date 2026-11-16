import type { HomeContent } from "@/content/home";
import { homeContent as en } from "@/content/home";
import { BOOKING_URL } from "@/content/start";

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "Pacific Silk Group",
    headline: "El puente entre China\ny tu mercado.",
    subheadline: "Un idioma. Un equipo. Nunca tratas con la parte china.",
    cta: { label: "Construye el camino de tu proyecto", href: "#builder" },
    secondaryCta: { label: "Ver cómo funciona", href: "#journey" },
  },
  journey: {
    label: "Cómo funciona",
    headline: "Un solo camino, de tu país a China y de vuelta.",
    local: {
      label: "Tu país",
      title: "Empieza con un equipo local",
      body: "Tu proyecto empieza en tu idioma, con personas cerca de ti. Desde la primera conversación hasta la entrega, es el único equipo con el que hablas.",
      chatName: "Tu responsable de proyecto",
      chatStatus: "Responde en tu idioma",
      messages: [
        { from: "you", text: "Necesitamos 2.000 unidades de nuestra bolsa de algodón para primavera." },
        { from: "team", text: "Entendido. Seleccionamos tres fábricas y volvemos con muestras." },
      ],
    },
    china: {
      label: "China",
      title: "China, resuelta por ti",
      body: "Nuestro equipo en China habla con las fábricas en chino, entiende cómo trabajan de verdad y te lo trae todo en tu propio idioma.",
      factoryLabel: "Nota de fábrica",
      factoryNote: "样品周五寄出，大货交期 35 天。",
      relayLabel: "Lo que tú lees",
      relayNote: "Las muestras salen el viernes. La producción tarda 35 días.",
    },
    project: {
      label: "Tu proyecto",
      title: "Sea cual sea el proyecto, el mismo camino",
      body: "Empieza por lo que necesitas. El modelo es el mismo.",
      routes: [
        { name: "Proyecto individual", line: "Un producto, una necesidad, una ruta clara." },
        { name: "Cooperación", line: "Trabaja con socios en China y en tu mercado." },
        { name: "Inversión", line: "Respalda proyectos con un equipo que los opera sobre el terreno." },
        { name: "Clúster o asociación", line: "Un grupo, un proyecto, compartido." },
      ],
    },
    ladder: {
      label: "Crecimiento",
      title: "Crece con tu proyecto",
      body: "A medida que el proyecto avanza, el mismo equipo te sigue acompañando y quita la fricción de hacer negocios con China.",
      steps: ["Proyecto individual", "Cooperación", "Joint venture", "Nuevos mercados"],
    },
    network: {
      label: "La red",
      title: "De cliente a colaborador",
      body: "Después de algunos proyectos juntos, puedes unirte como colaborador y formar parte de una red mundial de clústeres aceleradores de proyectos.",
      path: ["Cliente", "Colaborador", "Red"],
      networkLabel: "Una red verificada, en ambos extremos",
    },
  },
  benefits: {
    label: "Lo que obtienes trabajando así",
    lead: {
      title: "Un idioma. Un equipo. Cero trato con China.",
      body: "Hablas con tu propio equipo, en tu propio idioma. Nosotros nos ocupamos de la parte china: las fábricas, la negociación, el seguimiento.",
      image: "/images/home/shanghai-skyline.jpg",
      imageAlt: "Skyline de Shanghái sobre el río Huangpu",
    },
    items: [
      { title: "Fábricas, entendidas", body: "Hablamos chino con ellas y te lo trasladamos con claridad." },
      { title: "El mismo estándar en ambos extremos", body: "Revisado en China y otra vez cuando llega la mercancía." },
      { title: "Menos fricción, menos sorpresas", body: "Asumimos el trabajo de asesoría, importación y logística." },
      { title: "Una red que crece contigo", body: "Empieza como cliente, profundiza, únete a la red." },
    ],
  },
  comparison: {
    label: "Por qué funciona",
    headline: "Tres formas de hacerlo.",
    note: "Patrones habituales, lado a lado.",
    columns: [
      { title: "Hacerlo tú mismo", sub: "Tú y la fábrica, solo" },
      { title: "Una cadena de intermediarios", sub: "Tú, y capa tras capa" },
      { title: "Pacific Silk", sub: "Tú, un equipo en ambos extremos" },
    ],
    rows: [
      { label: "Con quién tratas", values: ["Directamente con fábricas, solo", "Una cadena de agentes y distribuidores", "Un equipo, en tu idioma"] },
      { label: "Idioma y cultura", values: ["Lo resuelves tú", "Se pierde en cada traspaso", "Resuelto en ambos extremos"] },
      { label: "Confianza y verificación", values: ["Verificas desde lejos", "Cada capa revisa solo su parte", "Verificado en origen y a la llegada"] },
      { label: "Calidad", values: ["Solo si puedes viajar", "Depende de a quién se paga por revisar", "El mismo estándar en ambos extremos"] },
      { label: "Responsabilidad", values: ["Toda tuya", "Repartida entre capas, fácil de perder", "Un equipo, de principio a fin"] },
      { label: "Lo que ves", values: ["Solo lo que alcanzas", "Filtrado por cada capa", "Directo, claro, en tu idioma"] },
    ],
  },
  builder: {
    ...en.builder,
    label: "Constructor de proyectos",
    headline: "Construye tu proyecto y descubre lo que necesitas.",
    modes: { guided: "Ayúdame a encontrarlo", manual: "Sé lo que necesito" },
    questions: {
      type: {
        question: "¿Qué tipo de proyecto es?",
        options: [
          { id: "individual", label: "Proyecto individual" },
          { id: "cooperation", label: "Cooperación" },
          { id: "investment", label: "Inversión" },
          { id: "cluster", label: "Clúster o asociación" },
        ],
      },
      today: {
        question: "¿Dónde estás hoy?",
        options: [
          { id: "idea", label: "Tengo una idea" },
          { id: "specs", label: "Tengo especificaciones" },
          { id: "supplier", label: "Tengo un proveedor" },
          { id: "importing", label: "Ya importo" },
        ],
      },
      dest: { question: "¿Dónde termina?", placeholder: "País de destino" },
      worry: {
        question: "¿Qué te preocupa más?",
        options: [
          { id: "language", label: "Idioma" },
          { id: "trust", label: "Confianza" },
          { id: "quality", label: "Calidad" },
          { id: "logistics", label: "Logística" },
        ],
      },
    },
    groups: [
      {
        title: "Encontrar y validar",
        services: [
          { id: "definition", label: "Definición del proyecto (gratis)" },
          { id: "feasibility", label: "Viabilidad y asesoría" },
          { id: "search", label: "Búsqueda y validación de proveedores" },
          { id: "verification", label: "Verificación de proveedores" },
          { id: "matching", label: "Búsqueda de socios" },
        ],
      },
      {
        title: "Producir y revisar",
        services: [
          { id: "negotiation", label: "Negociación en chino" },
          { id: "followup", label: "Seguimiento de producción" },
          { id: "inspection", label: "Inspección de calidad" },
        ],
      },
      {
        title: "Mover y acompañar",
        services: [
          { id: "shipping", label: "Envío y aduanas" },
          { id: "destination", label: "Apoyo en destino" },
          { id: "coordination", label: "Coordinación de grupo" },
          { id: "assessment", label: "Evaluación del proyecto" },
        ],
      },
    ],
    blueprintTitle: "Tu plan",
    progressLabel: "Plan {pct}% completo",
    selectedLabel: "{n} servicios seleccionados",
    selectedLabelOne: "1 servicio seleccionado",
    destinationLabel: "Destino",
    emptyGuided: "Responde una pregunta y aquí aparecen los servicios recomendados.",
    emptyManual: "Elige los servicios que necesitas.",
    quote: { label: "Pedir presupuesto", href: "/start" },
    call: { label: "Agendar una llamada", href: BOOKING_URL },
    send: {
      label: "Enviar esto a mi equipo",
      email: "",
      subject: "Nuestro plan de proyecto con China",
      intro: "Este es el plan de proyecto de Pacific Silk:",
    },
  },
  finalCta: {
    headline: "Cuéntanos qué necesitas.\nTe mostramos el camino.",
    body: "Sin compromiso. Sin pop-ups. Solo una primera propuesta clara.",
    cta: { label: "Construye el camino de tu proyecto", href: "#builder" },
    secondary: [
      { label: "Agendar una llamada", href: BOOKING_URL },
      { label: "Unirse a la red", href: "/about#network" },
    ],
  },
};
