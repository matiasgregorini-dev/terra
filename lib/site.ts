/**
 * Contenido institucional de Terra Consultora.
 *
 * Fuente: "Carpeta de Presentación" de Terra Consultora (PDF, 10 páginas,
 * autor Matías Gregorini, generado en diciembre de 2015). Los textos se
 * transcribieron de forma literal; solo se corrigieron errores ortográficos y
 * de tipeo evidentes (tildes, "lograra" → "logrará", "georeferenciado" →
 * "georreferenciado", "usobre esta capas" → "y, sobre estas capas"), y se
 * quitó un ítem repetido en "Problemática de los proyectos agropecuarios".
 */

export const site = {
  name: "Terra Consultora",
  lema: "Potenciamos sus ideas",
  areas: [
    "Administración y Gestión Agropecuaria",
    "Manejo Integral de Cultivos",
    "Nutrición Animal",
  ],
  description:
    "Terra Consultora: Administración y Gestión Agropecuaria, Manejo Integral de Cultivos y Nutrición Animal en el Oeste de la provincia de Buenos Aires. Ing. Agr. Matías Gregorini.",

  // TODO: el folleto menciona www.terraconsultora.com.ar. Cargalo acá solo si
  // el dominio sigue registrado a tu nombre y apunta a Vercel.
  // Mientras esté vacío se usa la URL de producción que Vercel expone en
  // VERCEL_PROJECT_PRODUCTION_URL, y en local http://localhost:3000.
  url: "",

  mision:
    "Somos un grupo de profesionales, con clara orientación a la actividad agropecuaria. Valores humanos, alto nivel técnico, respeto por la sustentabilidad del medio ambiente y una permanente adecuación a los cambios tecnológicos, son nuestros pilares. Con ellos, apuntamos a ser el apoyo de productores, para una mayor eficiencia en el uso de los recursos, que siempre son escasos. Nuestra especialización dentro de las distintas ramas del sector y el trabajo en equipo, nos permite dar la respuesta más certera a los requerimientos de la demanda.",

  vision:
    "El sector agropecuario ha sido uno de los campos donde el cambio tecnológico se ha manifestado con mayor intensidad. Hoy, prácticamente nada se hace de la misma manera que hace treinta años. Agricultura de precisión, monitoreo, nutrición eficiente para cada necesidad, feedlots, conversión de organización familiar en empresa, recursos humanos específicos, etc. son los temas de hoy. Y allí queremos estar, impulsando las técnicas más avanzadas para beneficio del sector y crecimiento de la región.",

  servicios: [
    "Nutrición en tambos, recría y feedlots.",
    "Asesoramiento en instalaciones para feedlots.",
    "Formulación y Gestión de Proyectos Agropecuarios.",
    "Asesoramiento integral de sistemas productivos.",
    "Manejo técnico de cultivos.",
    "Agricultura de precisión.",
    "Fideicomisos.",
    "Gestión de Créditos.",
    "Administración y Gestión Agropecuaria.",
    "Capacitaciones al personal, a productores y técnicos.",
  ],

  /** Detalle de cada servicio, en el orden del folleto. */
  detalle: [
    {
      id: "tambos",
      titulo: "Tambos",
      items: [
        "Presupuestos de alimentación.",
        "Ajuste de dietas con la periodicidad necesaria.",
        "Seguimiento de la recría.",
        "Capacitaciones en manejo de la alimentación.",
        "Confección de protocolos de trabajo en conjunto con el personal responsable.",
        "Organización de los registros en el tambo y análisis de la información.",
        "Formulación de proyectos.",
      ],
    },
    {
      id: "engorde",
      titulo: "Planteos de engorde",
      items: [
        "Presupuestos de alimentación.",
        "Dietas para recría y terminación.",
        "Capacitaciones en manejo de la alimentación.",
        "Confección de protocolos de trabajo, en conjunto con el personal responsable.",
        "Implementación de registros y análisis de la información.",
        "Elaboración de proyectos para feedlots.",
        "Diseño de instalaciones.",
        "Manejo de efluentes.",
      ],
    },
    {
      id: "cria",
      titulo: "Cría",
      items: [
        "Formulación de proyectos.",
        "Manejo de pastizales y pasturas.",
        "Formulación de dietas para destete precoz, recría de vaquillonas, toros, vacas en preparto y servicio, etc.",
      ],
    },
    {
      id: "asesoramiento-integral",
      titulo: "Asesoramiento integral de sistemas productivos",
      parrafos: [
        "Con el fin de poder alcanzar los máximos resultados productivos y económicos, se presta el asesoramiento integral sobre la explotación agropecuaria. Dicho servicio busca obtener los mejores resultados productivos y económicos para la empresa, ya sea en función de la implementación de nuevos sistemas y paquetes tecnológicos, y/o de eficientizar los ya preexistentes, sean ganaderos, agrícolas o mixtos. El asesoramiento consta de auditorías y gestión sobre los procesos de la empresa. Sobre esto, así como con las necesidades del cliente, se elaborará un plan de acción acorde a dar respuestas, en caso de ser necesario, a las situaciones observadas.",
        "Se buscará a su vez con este servicio mantener al cliente a la vanguardia de los sistemas de producción, y poder mantener un sistema de producción altamente eficiente, en busca de alcanzar la eficacia económica del mismo. Esto se logrará mediante la utilización de estrategias que permitan potenciar el retorno económico por unidad de producto utilizado, y tratando de disminuir los efectos nocivos sobre el agroecosistema.",
      ],
    },
    {
      id: "manejo-de-cultivos",
      titulo: "Manejo de cultivos",
      parrafos: [
        "Con el fin de potenciar el resultado productivo-económico, se buscará realizar un manejo integral de los cultivos, mediante la realización de un plan técnico-productivo para el establecimiento, en función de las necesidades del administrador del mismo, de las características productivas de cada lote o ambiente y de las perspectivas ambientales para el año.",
        "En función a una amplia base de datos y resultados a campo, se propondrán los mejores materiales para sembrar, manejo de estructura de cultivos, las fechas óptimas de siembra, niveles de fertilización y fertilizantes recomendados, necesidades de herbicidas en cantidades y momentos de aplicación, así como insecticidas y fungicidas. El mismo se completa con recorrida y/o monitoreo durante el ciclo de los cultivos.",
        "En lo que a recomendaciones de fertilización respecta, se proveerá de la dosis, fuente y momento de fertilizante recomendada en función de los rendimientos esperados y del nivel de fertilidad del ambiente. El nivel de fertilidad edáfica se determinará mediante el muestreo georreferenciado de suelo, analizando los nutrientes requeridos para esta toma de decisiones, según corresponda en el caso de cada cultivo.",
      ],
    },
    {
      id: "agricultura-de-precision",
      titulo: "Agricultura de precisión",
      parrafos: [
        "La variabilidad en las propiedades físicas y químicas de los suelos y la profundidad de la napa, entre otras, influyen sobre la disponibilidad de los recursos para las plantas. En suelos de la Pampa Arenosa se puede observar que las regiones del lote de mayor altitud presentan un decaimiento en sus rendimientos respecto a las regiones bajas, posiblemente debido a la menor oferta de agua durante todo el ciclo, debido a su menor capacidad de almacenamiento de agua en el perfil.",
        "Estos fundamentos llevan a realizar un manejo sitio específico por medio de la agricultura de precisión. Mediante el análisis de los ambientes edáficos dentro del establecimiento y dentro de cada lote se ambientarán en función del potencial productivo para cada cultivo.",
        "Con el análisis de información de mapas de rendimiento, imágenes satelitales, índices verdes y demás capas de información, se procederá a la ambientación de lotes y, sobre estas capas de información, se realizará un manejo sitio-específico de fertilizantes, densidades y demás insumos, por medio de la prescripción de mapas de aplicación variable de insumos y su puesta en práctica con maquinarias equipadas para tal fin. Todo este paquete se concluye con el análisis al final de la campaña de los resultados obtenidos entre ambientes y lotes dentro del establecimiento.",
      ],
    },
    {
      id: "proyectos",
      titulo: "Problemática de los proyectos agropecuarios",
      parrafos: [
        "La sola existencia de una brillante idea y su emprendedor rara vez alcanzan por sí solas para llevar adelante un proyecto. Se necesita además:",
      ],
      items: [
        "La persona que haga la formulación del mismo en el papel, con todos sus detalles (costeo de inversiones y gastos; estimación de ingresos; flujo de fondos, etc.).",
        "Alguien que sepa cuáles son las posibles fuentes alternativas de financiamiento (créditos, leasing, programas especiales, fideicomiso, etc.) y que prepare la carpeta con la información requerida por la entidad financiera correspondiente.",
        "El responsable del armado de la herramienta societaria más conveniente (SRL, SA, fideicomiso, etc.).",
        "La o las personas que gerencien tanto la ejecución de las inversiones previstas como la puesta en marcha del proyecto y su posterior ejecución.",
      ],
      cierre:
        "Desde Terra Consultora le ofrecemos todos esos servicios en una sola empresa.",
    },
  ] as Detalle[],

  profesional: {
    nombre: "Matías Gregorini",
    titulo: "Ing. Agr.",
    formacion:
      "Ingeniero Agrónomo (2007). Facultad de Agronomía, Universidad de Buenos Aires.",
    // TODO: la trayectoria se transcribió de la carpeta de 2015. Confirmá que
    // los puestos marcados "Desde" sigan vigentes y sumá lo posterior.
    trayectoria: [
      {
        periodo: "Desde 2006",
        texto:
          "Desarrollando proyectos de agricultura de precisión, asesoramiento y manejo de cultivos en la zona Oeste de la provincia de Buenos Aires.",
      },
      {
        periodo: "2006 – 2008",
        texto:
          "Campos de Abril: responsable de producción de 8.000 ha en la zona Oeste húmedo. A cargo de la presupuestación del plan de siembra, programación, siembra, control y cosecha de ensayos de experimentación agrícolas. Responsable de los contratistas y encargado de la gestión en la zona. Implementación de sistemas de agricultura de precisión y manejo diferenciado de nutrientes por ambientes.",
      },
      {
        periodo: "Desde 2008",
        texto:
          "Consultor privado en más de 20.000 ha de distintas empresas agropecuarias del Oeste de la región pampeana. Desarrollo y acompañamiento de los procesos de manejo integral de cultivos agrícolas y forrajeros.",
      },
      {
        periodo: "Desde 2009",
        texto:
          "Responsable del Departamento Técnico y consultor de El Cardo Agronomía, Semillero KWS.",
      },
    ],
  },

  contact: {
    email: "matiasgregorini@hotmail.com",
    // Teléfono del folleto: 02392-15546068 (celular, característica 2392).
    // TODO: confirmar que el número siga vigente y tenga WhatsApp.
    telefonoVisible: "(02392) 15-546068",
    telefonoE164: "+5492392546068",
    // Formato wa.me: solo dígitos, con código de país, sin 0 ni 15.
    whatsapp: "5492392546068",
    area: "Oeste de la provincia de Buenos Aires",
  },
};

export type Detalle = {
  id: string;
  titulo: string;
  parrafos?: string[];
  items?: string[];
  cierre?: string;
};

export function siteUrl(): string {
  if (site.url) return site.url;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}

export function whatsappHref(): string | null {
  const digits = site.contact.whatsapp.replace(/\D/g, "");
  if (!digits) return null;
  const text = encodeURIComponent(
    `Hola, me comunico desde el sitio de ${site.name}.`,
  );
  return `https://wa.me/${digits}?text=${text}`;
}
