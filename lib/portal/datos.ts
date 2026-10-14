import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Documento, Establecimiento, Lote, Novedad, Perfil } from "./tipos";

/**
 * Lecturas del portal. Usan la sesión del usuario, así que la base devuelve
 * solo lo que su rol permite (RLS): no hace falta filtrar por usuario acá.
 */

function fallar(que: string, error: { message: string }): never {
  throw new Error(`No se pudo leer ${que}: ${error.message}`);
}

export async function listarEstablecimientos(): Promise<Establecimiento[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("establecimientos")
    .select("id, nombre, localidad, partido, superficie_ha, notas, creado_en")
    .order("nombre");
  if (error) fallar("los establecimientos", error);
  return data;
}

export async function obtenerEstablecimiento(id: string): Promise<Establecimiento | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("establecimientos")
    .select("id, nombre, localidad, partido, superficie_ha, notas, creado_en")
    .eq("id", id)
    .maybeSingle();
  if (error) fallar("el establecimiento", error);
  return data;
}

export async function listarLotes(establecimientoId: string): Promise<Lote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lotes")
    .select("id, establecimiento_id, nombre, superficie_ha, campana, cultivo, ambiente, notas")
    .eq("establecimiento_id", establecimientoId)
    .order("nombre");
  if (error) fallar("los lotes", error);
  return data;
}

export async function listarDocumentos(establecimientoId: string): Promise<Documento[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documentos")
    .select(
      "id, establecimiento_id, lote_id, titulo, categoria, campana, archivo_nombre, archivo_bytes, visible_personal, subido_por, creado_en",
    )
    .eq("establecimiento_id", establecimientoId)
    .order("creado_en", { ascending: false });
  if (error) fallar("los documentos", error);
  return data;
}

export async function listarNovedades(opciones: {
  establecimientoId?: string;
  limite?: number;
} = {}): Promise<Novedad[]> {
  const supabase = await createClient();
  let consulta = supabase
    .from("novedades")
    .select(
      "id, establecimiento_id, titulo, cuerpo, visible_personal, autor_id, publicado_en, establecimientos(nombre)",
    )
    .order("publicado_en", { ascending: false })
    .limit(opciones.limite ?? 50);
  if (opciones.establecimientoId) {
    consulta = consulta.eq("establecimiento_id", opciones.establecimientoId);
  }
  const { data, error } = await consulta;
  if (error) fallar("las novedades", error);
  return data as unknown as Novedad[];
}

/** Solo admin (para el resto, RLS devuelve únicamente el propio perfil). */
export async function listarPerfiles(): Promise<Perfil[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("perfiles")
    .select("id, email, nombre, rol, activo, creado_en")
    .order("nombre");
  if (error) fallar("los usuarios", error);
  return data;
}

export async function obtenerPerfil(id: string): Promise<Perfil | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("perfiles")
    .select("id, email, nombre, rol, activo, creado_en")
    .eq("id", id)
    .maybeSingle();
  if (error) fallar("el usuario", error);
  return data;
}

/** Pares establecimiento ↔ usuario. Admin ve todos; el resto, los propios. */
export async function listarMiembros(filtro: {
  establecimientoId?: string;
  perfilId?: string;
} = {}): Promise<{ establecimiento_id: string; perfil_id: string }[]> {
  const supabase = await createClient();
  let consulta = supabase.from("miembros").select("establecimiento_id, perfil_id");
  if (filtro.establecimientoId) consulta = consulta.eq("establecimiento_id", filtro.establecimientoId);
  if (filtro.perfilId) consulta = consulta.eq("perfil_id", filtro.perfilId);
  const { data, error } = await consulta;
  if (error) fallar("los accesos", error);
  return data;
}

/** Pregunta a la base (misma regla que RLS) si el usuario puede cargar contenido. */
export async function puedeCargar(establecimientoId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("puede_cargar", { est: establecimientoId });
  if (error) return false;
  return data === true;
}
