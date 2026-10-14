/** Tipos y etiquetas del portal. Reflejan supabase/migrations/*_portal.sql. */

export const ROLES = ["admin", "tecnico", "productor", "personal"] as const;
export type Rol = (typeof ROLES)[number];

export const ROL_ETIQUETA: Record<Rol, string> = {
  admin: "Administrador",
  tecnico: "Técnico / asesor de campo",
  productor: "Productor / cliente",
  personal: "Personal del establecimiento",
};

export const ROL_DESCRIPCION: Record<Rol, string> = {
  admin: "Administra usuarios, establecimientos y todo el contenido.",
  tecnico: "Carga lotes, documentos y novedades en los establecimientos asignados.",
  productor: "Ve la información completa de sus establecimientos.",
  personal: "Ve lotes y solo los documentos y novedades marcados para el personal.",
};

export const CATEGORIAS = [
  "recomendacion",
  "analisis_suelo",
  "plan_siembra",
  "informe",
  "protocolo",
  "dieta",
  "otro",
] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const CATEGORIA_ETIQUETA: Record<Categoria, string> = {
  recomendacion: "Recomendación",
  analisis_suelo: "Análisis de suelo",
  plan_siembra: "Plan de siembra",
  informe: "Informe",
  protocolo: "Protocolo de trabajo",
  dieta: "Dieta / plan de alimentación",
  otro: "Otro",
};

/** Tipos de archivo admitidos (mismos que el bucket "documentos"). */
export const ARCHIVO_TIPOS = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/csv",
  "application/zip",
  "application/vnd.google-earth.kmz",
  "application/vnd.google-earth.kml+xml",
] as const;
export const ARCHIVO_EXTENSIONES =
  ".pdf,.jpg,.jpeg,.png,.webp,.xlsx,.xls,.docx,.doc,.csv,.zip,.kmz,.kml";
export const ARCHIVO_MAX_BYTES = 25 * 1024 * 1024;

export type Usuario = {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
};

export type Perfil = Usuario & { activo: boolean; creado_en: string };

export type Establecimiento = {
  id: string;
  nombre: string;
  localidad: string;
  partido: string;
  superficie_ha: number | null;
  notas: string;
  creado_en: string;
};

export type Lote = {
  id: string;
  establecimiento_id: string;
  nombre: string;
  superficie_ha: number | null;
  campana: string;
  cultivo: string;
  ambiente: string;
  notas: string;
};

export type Documento = {
  id: string;
  establecimiento_id: string;
  lote_id: string | null;
  titulo: string;
  categoria: Categoria;
  campana: string;
  archivo_nombre: string;
  archivo_bytes: number;
  visible_personal: boolean;
  subido_por: string | null;
  creado_en: string;
};

export type Novedad = {
  id: string;
  establecimiento_id: string | null;
  titulo: string;
  cuerpo: string;
  visible_personal: boolean;
  autor_id: string | null;
  publicado_en: string;
  establecimientos?: { nombre: string } | null;
};

/** Resultado que devuelven las Server Actions a los formularios. */
export type EstadoForm = { ok?: string; error?: string } | null;
