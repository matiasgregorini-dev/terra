/**
 * Datos institucionales de Terra Consultora.
 *
 * Centraliza toda la información de contacto y presentación para editarla en
 * un solo lugar. Los campos vacíos no se muestran en el sitio: completalos
 * cuando tengas el dato confirmado (no se cargan datos inventados).
 */
export const site = {
  name: "Terra Consultora",
  tagline: "Asesoramiento agropecuario profesional",
  valueProposition:
    "Acompañamos la toma de decisiones en tu establecimiento con criterio técnico y una mirada integral del negocio agropecuario.",
  description:
    "Terra Consultora brinda asesoramiento agropecuario profesional. Consultor: Matías Gregorini.",

  // TODO: reemplazar por el dominio definitivo (ej. "https://www.terraconsultora.com.ar").
  // Mientras esté vacío se usa la URL de producción que Vercel expone en
  // VERCEL_PROJECT_PRODUCTION_URL, y en local http://localhost:3000.
  url: "",

  consultant: {
    name: "Matías Gregorini",
    role: "Consultor agropecuario",
    // TODO: completar con el texto de presentación provisto por Matías
    // (formación, años de experiencia, zona de trabajo y enfoque de trabajo).
    // Cada elemento del array es un párrafo. Mientras esté vacío, la sección
    // "Quiénes somos" muestra solo nombre y rol.
    bio: [] as string[],
  },

  contact: {
    email: "matiasgregorini@hotmail.com",
    // TODO: número de WhatsApp solo con dígitos, con código de país y sin "+",
    // espacios ni guiones (formato wa.me), ej. "5492392XXXXXX".
    // Mientras esté vacío, el botón flotante de WhatsApp no se muestra.
    whatsapp: "",
    // TODO: completar con la zona de trabajo (ej. partidos o región).
    // Mientras esté vacío, no se muestra en el pie de página.
    area: "",
  },
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
