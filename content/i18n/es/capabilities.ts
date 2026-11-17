import type { CapabilitiesPageContent } from "@/content/capabilities";

export const capabilitiesContent: CapabilitiesPageContent = {
  meta: {
    title: "Impacto en clientes — Pacific Silk Group",
    description:
      "Descubre dónde opera PSC y lo que hemos construido. Proyectos de abastecimiento, fabricación, logística y entrada al mercado — ejecutados de forma remota, entregados sobre el terreno.",
  },
  intro: {
    label: "Impacto en clientes",
    headline: "Lo que el puente puede llevar",
    subline:
      "Todo pasa por un solo equipo que habla tu idioma. Estas son las piezas de un proyecto.",
  },
  blocks: {
    label: "Piezas del proyecto",
    items: [
      {
        key: "find",
        title: "Buscar y validar",
        body: "Socios de confianza, verificados antes de que te comprometas.",
        tags: ["Búsqueda y validación de proveedores", "Verificación de proveedores", "Búsqueda de socios"],
      },
      {
        key: "negotiate",
        title: "Negociar y comunicar",
        body: "Todo lo que se dice en chino, de vuelta en tu idioma.",
        tags: ["Negociación en chino"],
      },
      {
        key: "produce",
        title: "Producir y controlar la calidad",
        body: "Producción seguida y revisada en origen.",
        tags: ["Seguimiento de producción", "Inspección de calidad"],
      },
      {
        key: "move",
        title: "Transportar y despachar",
        body: "De la puerta de la fábrica a la tuya, con los papeles en regla.",
        tags: ["Envío y aduanas", "Apoyo en destino"],
      },
      {
        key: "advise",
        title: "Asesorar y evaluar",
        body: "Una visión clara antes de invertir tiempo o dinero.",
        tags: ["Viabilidad y asesoría", "Evaluación de proyectos"],
      },
      {
        key: "groups",
        title: "Coordinar grupos",
        body: "Un proyecto compartido por muchos miembros.",
        tags: ["Coordinación de grupos"],
      },
    ],
  },
  move: {
    label: "Transporte y apoyo",
    headline: "De la puerta de la fábrica a la tuya",
    owners: { china: "Equipo en China", both: "Ambos equipos", destination: "Equipo en destino" },
    steps: [
      { name: "Fábrica", owner: "china", body: "Producción revisada antes de salir." },
      { name: "Exportación", owner: "china", body: "Documentos de exportación y carga preparados." },
      { name: "Tránsito", owner: "both", body: "Envío seguido, y te mantenemos informado en tu idioma." },
      { name: "Aduanas", owner: "destination", body: "Despacho y requisitos locales resueltos." },
      { name: "Entrega", owner: "destination", body: "Mercancía recibida, revisada a la llegada y entregada." },
    ],
    hint: "Elige un paso para ver quién se encarga.",
  },
  finder: {
    label: "Proyectos",
    headline: "Encuentra un proyecto como el tuyo",
    subheadline: "Abre un punto del mapa o un proyecto de la lista.",
    countOne: "1 proyecto",
    count: "{n} proyectos",
    cta: "Leer el proyecto",
  },
  grid: {
    label: "Lo que operamos",
    headline: "Cada paso entre China y tu mercado.",
    expandLabel: "Ver detalles",
    closeLabel: "Ocultar detalles",
    verify: {
      title: "Encontrar y verificar proveedores",
      body: "Seleccionamos fábricas, revisamos sus licencias, visitamos la planta y probamos muestras. Solo conoces a proveedores que pasaron.",
      link: { label: "Cómo buscamos proveedores", href: "/capabilities" },
      cardTitle: "Perfil de proveedor",
      cardRef: "Ref. SUP-0000",
      checks: ["Licencia comercial", "Licencia de exportación", "Visita a fábrica", "Muestra aprobada"],
      status: "Verificado",
      networkLabel: "Red verificada, en ambos extremos",
    },
    quality: {
      title: "Calidad, revisada en ambos extremos",
      body: "Inspeccionamos en fábrica antes del envío, y otra vez cuando llega. Un solo estándar, por escrito, aplicado dos veces.",
      link: { label: "Ver el proceso", href: "/process" },
      reportTitle: "Informe de inspección",
      reportRef: "Lote de ejemplo",
      checks: ["Dimensiones", "Acabado", "Embalaje", "Etiquetas"],
      passLabel: "OK",
      chartTitle: "Controles por lote",
      originLabel: "Origen",
      destinationLabel: "Destino",
    },
    movement: {
      title: "Lo movemos, puerta a puerta",
      body: "Flete, consolidación y entrega planificados como una sola ruta. Ves dónde está tu mercancía y cuándo llega.",
      link: { label: "Estimar un envío", href: "/tools/shipping-estimate" },
      from: "Shanghái",
      to: "Róterdam",
      status: "En tránsito",
    },
    paperwork: {
      title: "Documentación y aduanas",
      body: "Documentos de exportación en China, códigos arancelarios y despacho en destino. Lo preparamos, lo revisamos y lo presentamos.",
      link: { label: "Busca tu código arancelario", href: "/tools/tariff-finder" },
      docs: ["Lista de empaque", "Factura comercial", "Declaración aduanera"],
      stamp: "Despachado",
    },
    tracking: {
      title: "Sigue cada proyecto",
      body: "Una vista compartida de dónde está tu proyecto, qué viene después y qué necesitamos de ti.",
      link: { label: "Sobre el portal", href: "/portal" },
      projectLabel: "Proyecto de ejemplo",
      steps: ["Definir", "Validar", "Producir", "Enviar", "Entregar"],
      current: 2,
      updateLabel: "Control de producción agendado",
    },
  },
  hero: {
    eyebrow: "Dónde operamos",
    headline: "Ejecutado.\nNo propuesto.",
    subheadline:
      "Cada marcador es un proyecto que hemos ejecutado o una presencia que hemos establecido. Esto no es un pitch deck — es un mapa del trabajo realizado.",
  },
  projectTypes: {
    label: "Qué ejecutamos",
    headline: "Cuatro capacidades. Una operación coordinada.",
    types: [
      {
        key: "sourcing",
        label: "Abastecimiento",
        description:
          "Identificación de fábricas, selección y gestión de proveedores. Encontramos quién puede fabricarlo, con qué calidad y a qué precio.",
      },
      {
        key: "manufacturing",
        label: "Fabricación",
        description:
          "Gestión integral de producción — muestras, moldes, control de calidad y entrega. Lance Trade en la planta de producción.",
      },
      {
        key: "market-entry",
        label: "Entrada al mercado",
        description:
          "Acceso al mercado chino: socios locales, co-promotores, presentaciones a agencias. Abrimos las puertas y permanecemos en la sala.",
      },
      {
        key: "logistics",
        label: "Logística",
        description:
          "Flete, aduanas, consolidación, almacenaje. SPL mueve tu carga. PSC garantiza la transición sin fisuras.",
      },
    ],
  },
  impact: {
    label: "Impacto en clientes",
    headline: "Trabajo hecho, no propuesto.",
    intro:
      "Proyectos reales, anonimizados. Lo que el cliente necesitaba, lo que ejecutamos en China y lo que cambió para él.",
    ctaLabel: "Leer el proyecto",
    carouselLabel: "Proyectos de clientes",
    dotsLabel: "Elegir un proyecto",
    slideLabel: "Proyecto {n} de {total}",
    typeLabels: {
      sourcing: "Abastecimiento",
      manufacturing: "Fabricación",
      logistics: "Logística",
      "market-entry": "Entrada al mercado",
      advisory: "Asesoría",
      consulting: "Consultoría",
    },
  },
  blogSection: {
    label: "Desde el terreno",
    headline: "Lo que aprendemos ejecutando proyectos en China.",
    linkedInLabel: "Seguir en LinkedIn",
    linkedInUrl: "https://www.linkedin.com/company/pacific-silk-consulting",
    instagramLabel: "Seguir en Instagram",
    instagramUrl: "https://www.instagram.com/pacificsilkconsulting/",
  },
  finalCta: {
    headline: "¿Listo para ejecutar un proyecto?",
    body: "Dinos qué necesitas. Te diremos qué es posible y cuánto cuesta.",
    cta: { label: "Construye la ruta de tu proyecto", href: "/#builder" },
    secondary: [{ label: "Iniciar proyecto", href: "/start" }],
  },
  detailCta: {
    sourcing: {
      headline: "¿Necesitas abastecer algo de China?",
      body: "Encontramos la fábrica adecuada, negociamos las condiciones y gestionamos la relación — para que no tengas que construirla desde cero.",
      cta: { label: "Iniciar proyecto", href: "/start" },
    },
    manufacturing: {
      headline: "¿Listo para ejecutar producción?",
      body: "Lance Trade gestiona la planta de producción. PSC te gestiona a ti. De la primera muestra a la entrega final.",
      cta: { label: "Iniciar proyecto", href: "/start" },
    },
    logistics: {
      headline: "¿Necesitas mover carga desde China?",
      body: "SPL gestiona el flete, las aduanas y la coordinación de entrega. Sin sorpresas en el puerto.",
      cta: { label: "Iniciar proyecto", href: "/start" },
    },
    "market-entry": {
      headline: "¿Buscas entrar al mercado chino?",
      body: "Identificamos socios locales, co-promotores y agencias — y hacemos las presentaciones en tu nombre.",
      cta: { label: "Iniciar proyecto", href: "/start" },
    },
    advisory: {
      headline: "¿Enfrentando un desafío en China?",
      body: "Ya lo hemos visto antes en la mayoría de los casos. Cuéntanos qué estás afrontando.",
      cta: { label: "Iniciar proyecto", href: "/start" },
    },
    consulting: {
      headline: "¿Enfrentando un desafío en China?",
      body: "Ya lo hemos visto antes en la mayoría de los casos. Cuéntanos qué estás afrontando.",
      cta: { label: "Iniciar proyecto", href: "/start" },
    },
  },
};
