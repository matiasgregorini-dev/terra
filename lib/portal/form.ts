/** Lectura y validación de datos de formularios (siempre del lado servidor). */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ErrorValidacion extends Error {}

export function texto(fd: FormData, campo: string, max: number, requerido = false): string {
  const valor = String(fd.get(campo) ?? "").trim();
  if (requerido && !valor) throw new ErrorValidacion(`Completá el campo "${etiqueta(campo)}".`);
  if (valor.length > max) {
    throw new ErrorValidacion(`"${etiqueta(campo)}" admite hasta ${max} caracteres.`);
  }
  return valor;
}

/**
 * Número positivo opcional, en formato argentino o internacional:
 * "1.250,5" → 1250.5 · "12,5" → 12.5 · "1.200" → 1200 · "12.5" → 12.5
 */
export function hectareas(fd: FormData, campo: string): number | null {
  let crudo = String(fd.get(campo) ?? "").trim().replace(/\s/g, "");
  if (!crudo) return null;
  if (crudo.includes(",")) {
    crudo = crudo.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(crudo)) {
    crudo = crudo.replace(/\./g, "");
  }
  const n = Number(crudo);
  if (!Number.isFinite(n) || n <= 0 || n >= 1e8) {
    throw new ErrorValidacion(`"${etiqueta(campo)}" tiene que ser un número mayor a 0.`);
  }
  return Math.round(n * 100) / 100;
}

export function uuid(valor: unknown, que = "identificador"): string {
  const s = String(valor ?? "");
  if (!UUID.test(s)) throw new ErrorValidacion(`El ${que} no es válido.`);
  return s;
}

export function uuidOpcional(valor: unknown): string | null {
  const s = String(valor ?? "").trim();
  return s ? uuid(s) : null;
}

export function email(fd: FormData, campo = "email"): string {
  const valor = String(fd.get(campo) ?? "").trim().toLowerCase();
  if (!EMAIL.test(valor) || valor.length > 254) {
    throw new ErrorValidacion("Ingresá un email válido.");
  }
  return valor;
}

export function casilla(fd: FormData, campo: string): boolean {
  return fd.get(campo) === "on";
}

export function enumerado<T extends string>(valor: unknown, opciones: readonly T[], que: string): T {
  const s = String(valor ?? "");
  if (!(opciones as readonly string[]).includes(s)) {
    throw new ErrorValidacion(`El valor de "${que}" no es válido.`);
  }
  return s as T;
}

/** Evita redirecciones abiertas: solo rutas internas del portal. */
export function rutaSegura(valor: unknown, porDefecto = "/portal"): string {
  const s = String(valor ?? "");
  if (s.startsWith("/portal") && !s.startsWith("//") && !s.includes("\\")) return s;
  return porDefecto;
}

const ETIQUETAS: Record<string, string> = {
  nombre: "Nombre",
  titulo: "Título",
  cuerpo: "Texto",
  localidad: "Localidad",
  partido: "Partido",
  superficie_ha: "Superficie (ha)",
  notas: "Notas",
  campana: "Campaña",
  cultivo: "Cultivo",
  ambiente: "Ambiente",
  email: "Email",
};

function etiqueta(campo: string) {
  return ETIQUETAS[campo] ?? campo;
}
