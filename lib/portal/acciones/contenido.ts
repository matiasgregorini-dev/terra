"use server";

import { refresh } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requerirUsuario } from "../auth";
import { puedeCargar } from "../datos";
import {
  ErrorValidacion,
  casilla,
  enumerado,
  hectareas,
  texto,
  uuid,
  uuidOpcional,
} from "../form";
import { ARCHIVO_MAX_BYTES, ARCHIVO_TIPOS, CATEGORIAS, type EstadoForm } from "../tipos";

/**
 * Altas y bajas de contenido. Cada acción:
 * 1. verifica la sesión (requerirUsuario),
 * 2. valida los datos del formulario,
 * 3. escribe con el cliente del usuario, así la base vuelve a aplicar los
 *    permisos (RLS) aunque alguien invoque la acción por fuera de la interfaz.
 */

const BUCKET = "documentos";

function resultado(e: unknown): EstadoForm {
  if (e instanceof ErrorValidacion) return { error: e.message };
  throw e;
}

/** Postgres rechaza por permisos con 42501 (o RLS sin filas afectadas). */
function sinPermiso(error: { code?: string } | null): boolean {
  return error?.code === "42501";
}

// --- Lotes -------------------------------------------------------------------

export async function crearLote(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin", "tecnico");
  try {
    const fila = {
      establecimiento_id: uuid(fd.get("establecimiento_id"), "establecimiento"),
      nombre: texto(fd, "nombre", 80, true),
      superficie_ha: hectareas(fd, "superficie_ha"),
      campana: texto(fd, "campana", 20),
      cultivo: texto(fd, "cultivo", 80),
      ambiente: texto(fd, "ambiente", 80),
      notas: texto(fd, "notas", 2000),
    };
    const supabase = await createClient();
    const { error } = await supabase.from("lotes").insert(fila);
    if (sinPermiso(error)) return { error: "No tenés permiso para cargar lotes en este establecimiento." };
    if (error) return { error: "No se pudo guardar el lote." };
    refresh();
    return { ok: `Lote "${fila.nombre}" agregado.` };
  } catch (e) {
    return resultado(e);
  }
}

export async function editarLote(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin", "tecnico");
  try {
    const id = uuid(fd.get("id"), "lote");
    const cambios = {
      nombre: texto(fd, "nombre", 80, true),
      superficie_ha: hectareas(fd, "superficie_ha"),
      campana: texto(fd, "campana", 20),
      cultivo: texto(fd, "cultivo", 80),
      ambiente: texto(fd, "ambiente", 80),
      notas: texto(fd, "notas", 2000),
    };
    const supabase = await createClient();
    const { data, error } = await supabase.from("lotes").update(cambios).eq("id", id).select("id");
    if (error || !data?.length) return { error: "No se pudo guardar el lote (o no tenés permiso)." };
    refresh();
    return { ok: "Lote actualizado." };
  } catch (e) {
    return resultado(e);
  }
}

export async function eliminarLote(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin");
  try {
    const id = uuid(fd.get("id"), "lote");
    const supabase = await createClient();
    const { data, error } = await supabase.from("lotes").delete().eq("id", id).select("id");
    if (error || !data?.length) return { error: "No se pudo eliminar el lote." };
    refresh();
    return { ok: "Lote eliminado." };
  } catch (e) {
    return resultado(e);
  }
}

// --- Documentos ----------------------------------------------------------------

/**
 * Paso 2 de la carga de un documento. El navegador ya subió el archivo a
 * Storage (paso 1, permitido solo a admin o técnico asignado por la política
 * del bucket); acá se registra la ficha. Si el registro falla, se borra el
 * archivo para no dejar huérfanos.
 */
export async function registrarDocumento(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const usuario = await requerirUsuario("admin", "tecnico");
  let establecimientoId: string;
  let path: string;
  try {
    establecimientoId = uuid(fd.get("establecimiento_id"), "establecimiento");
    path = String(fd.get("archivo_path") ?? "");
    // <establecimiento>/<uuid>.<ext> — nada de "..", barras extra ni otra carpeta.
    const patron = new RegExp(
      `^${establecimientoId}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.[a-z0-9]{1,5}$`,
    );
    if (!patron.test(path)) throw new ErrorValidacion("La ruta del archivo no es válida.");
  } catch (e) {
    return resultado(e);
  }

  if (!(await puedeCargar(establecimientoId))) {
    return { error: "No tenés permiso para cargar documentos en este establecimiento." };
  }

  const admin = createAdminClient();
  const descartar = () => admin.storage.from(BUCKET).remove([path]);

  try {
    // Tamaño y tipo se leen del archivo guardado, no de lo que diga el navegador.
    const { data: info, error: errorInfo } = await admin.storage.from(BUCKET).info(path);
    if (errorInfo || !info) {
      return { error: "No se encontró el archivo subido. Volvé a intentarlo." };
    }
    const bytes = Number(info.size ?? 0);
    const tipo = String(info.contentType ?? "");
    if (bytes <= 0 || bytes > ARCHIVO_MAX_BYTES || !(ARCHIVO_TIPOS as readonly string[]).includes(tipo)) {
      await descartar();
      return { error: "El archivo no es de un tipo admitido o supera los 25 MB." };
    }

    const fila = {
      establecimiento_id: establecimientoId,
      lote_id: uuidOpcional(fd.get("lote_id")),
      titulo: texto(fd, "titulo", 160, true),
      categoria: enumerado(fd.get("categoria"), CATEGORIAS, "Categoría"),
      campana: texto(fd, "campana", 20),
      archivo_path: path,
      archivo_nombre: texto(fd, "archivo_nombre", 255, true),
      archivo_tipo: tipo,
      archivo_bytes: bytes,
      visible_personal: casilla(fd, "visible_personal"),
      subido_por: usuario.id,
    };

    const supabase = await createClient();
    const { error } = await supabase.from("documentos").insert(fila);
    if (error) {
      await descartar();
      return { error: "No se pudo registrar el documento." };
    }
    refresh();
    return { ok: `Documento "${fila.titulo}" cargado.` };
  } catch (e) {
    await descartar();
    return resultado(e);
  }
}

export async function eliminarDocumento(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin", "tecnico");
  try {
    const id = uuid(fd.get("id"), "documento");
    const supabase = await createClient();
    // RLS decide si puede borrar; si devuelve la fila, el borrado fue autorizado.
    const { data, error } = await supabase
      .from("documentos")
      .delete()
      .eq("id", id)
      .select("archivo_path");
    if (error || !data?.length) return { error: "No se pudo eliminar el documento (o no tenés permiso)." };
    await createAdminClient().storage.from(BUCKET).remove([data[0].archivo_path]);
    refresh();
    return { ok: "Documento eliminado." };
  } catch (e) {
    return resultado(e);
  }
}

// --- Novedades -------------------------------------------------------------------

export async function publicarNovedad(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const usuario = await requerirUsuario("admin", "tecnico");
  try {
    const fila = {
      establecimiento_id: uuidOpcional(fd.get("establecimiento_id")),
      titulo: texto(fd, "titulo", 160, true),
      cuerpo: texto(fd, "cuerpo", 5000, true),
      visible_personal: casilla(fd, "visible_personal"),
      autor_id: usuario.id,
    };
    const supabase = await createClient();
    const { error } = await supabase.from("novedades").insert(fila);
    if (sinPermiso(error)) return { error: "No tenés permiso para publicar esta novedad." };
    if (error) return { error: "No se pudo publicar la novedad." };
    refresh();
    return { ok: "Novedad publicada." };
  } catch (e) {
    return resultado(e);
  }
}

export async function eliminarNovedad(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin", "tecnico");
  try {
    const id = uuid(fd.get("id"), "novedad");
    const supabase = await createClient();
    const { data, error } = await supabase.from("novedades").delete().eq("id", id).select("id");
    if (error || !data?.length) return { error: "No se pudo eliminar la novedad (o no tenés permiso)." };
    refresh();
    return { ok: "Novedad eliminada." };
  } catch (e) {
    return resultado(e);
  }
}
