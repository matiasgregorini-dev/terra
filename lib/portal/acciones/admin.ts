"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requerirUsuario } from "../auth";
import { ErrorValidacion, casilla, email, enumerado, hectareas, texto, uuid } from "../form";
import { ROLES, type EstadoForm } from "../tipos";

/**
 * Acciones exclusivas del administrador. Todas empiezan con
 * requerirUsuario("admin"). Lo que se puede hacer con la sesión del admin se
 * hace con ella (la base vuelve a verificar que es admin); la clave secreta se
 * usa solo para lo que exige la API de administración de Supabase Auth
 * (invitar, bloquear el ingreso) o para borrar archivos.
 */

const BUCKET = "documentos";
// Bloqueo "indefinido" de Supabase Auth para cuentas desactivadas (100 años).
const BLOQUEO = "876000h";

function resultado(e: unknown): EstadoForm {
  if (e instanceof ErrorValidacion) return { error: e.message };
  throw e;
}

function idsEstablecimientos(fd: FormData): string[] {
  return [...new Set(fd.getAll("establecimientos").map((v) => uuid(v, "establecimiento")))];
}

// --- Usuarios ------------------------------------------------------------------

export async function invitarUsuario(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin");
  try {
    const correo = email(fd);
    const nombre = texto(fd, "nombre", 120, true);
    const rol = enumerado(fd.get("rol"), ROLES, "Rol");
    const establecimientos = idsEstablecimientos(fd);

    // Supabase acepta "reinvitar" a quien todavía no activó su cuenta (reenvía el
    // email), y eso pisaría su rol y accesos con lo cargado en este formulario.
    // Por eso se rechaza cualquier email ya registrado.
    const supabase = await createClient();
    const { data: existente, error: errorBusqueda } = await supabase
      .from("perfiles")
      .select("id")
      .eq("email", correo)
      .maybeSingle();
    if (errorBusqueda) return { error: "No se pudo verificar el email. Intentá de nuevo." };
    if (existente) {
      return {
        error: "Ya existe un usuario con ese email. Para reenviarle el acceso, usá «Enviar enlace por email» en su ficha.",
      };
    }

    const admin = createAdminClient();
    // Supabase crea el usuario y le envía el email de invitación (plantilla
    // "Invite user", ver supabase/plantillas-email/invitacion.html).
    const { data, error } = await admin.auth.admin.inviteUserByEmail(correo, { data: { nombre } });
    if (error) {
      if (error.code === "email_exists") return { error: "Ya existe un usuario con ese email." };
      if (error.status === 429) return { error: "Se alcanzó el límite de emails por hora. Probá más tarde." };
      return { error: `No se pudo enviar la invitación: ${error.message}` };
    }

    // El perfil lo creó el trigger como "personal"; el admin define el rol.
    const { error: errorPerfil } = await supabase
      .from("perfiles")
      .update({ nombre, rol })
      .eq("id", data.user.id);
    if (errorPerfil) return { error: "Se envió la invitación, pero no se pudo asignar el rol. Revisalo en la ficha del usuario." };

    if (establecimientos.length > 0) {
      const { error: errorMiembros } = await supabase
        .from("miembros")
        .insert(establecimientos.map((e) => ({ establecimiento_id: e, perfil_id: data.user.id })));
      if (errorMiembros) return { error: "Se envió la invitación, pero no se pudieron asignar los establecimientos." };
    }

    refresh();
    return { ok: `Invitación enviada a ${correo}.` };
  } catch (e) {
    return resultado(e);
  }
}

export async function actualizarUsuario(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const yo = await requerirUsuario("admin");
  try {
    const id = uuid(fd.get("id"), "usuario");
    const cambios = {
      nombre: texto(fd, "nombre", 120),
      rol: enumerado(fd.get("rol"), ROLES, "Rol"),
      activo: casilla(fd, "activo"),
    };
    if (id === yo.id && (cambios.rol !== "admin" || !cambios.activo)) {
      return { error: "No podés quitarte el rol de administrador ni desactivar tu propia cuenta." };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.from("perfiles").update(cambios).eq("id", id).select("id");
    if (error || !data?.length) return { error: "No se pudieron guardar los cambios." };

    // Además de cortar el acceso a los datos (RLS), se bloquea el ingreso.
    const { error: errorBloqueo } = await createAdminClient().auth.admin.updateUserById(id, {
      ban_duration: cambios.activo ? "none" : BLOQUEO,
    });
    if (errorBloqueo) {
      return { error: "Se guardaron los cambios, pero no se pudo actualizar el bloqueo de ingreso." };
    }

    refresh();
    return { ok: "Usuario actualizado." };
  } catch (e) {
    return resultado(e);
  }
}

export async function guardarAccesos(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin");
  try {
    const perfilId = uuid(fd.get("perfil_id"), "usuario");
    const elegidos = new Set(idsEstablecimientos(fd));

    const supabase = await createClient();
    const { data: actuales, error } = await supabase
      .from("miembros")
      .select("establecimiento_id")
      .eq("perfil_id", perfilId);
    if (error) return { error: "No se pudieron leer los accesos actuales." };

    const tenia = new Set(actuales.map((m) => m.establecimiento_id as string));
    const quitar = [...tenia].filter((e) => !elegidos.has(e));
    const agregar = [...elegidos].filter((e) => !tenia.has(e));

    if (quitar.length > 0) {
      const { error: e1 } = await supabase
        .from("miembros")
        .delete()
        .eq("perfil_id", perfilId)
        .in("establecimiento_id", quitar);
      if (e1) return { error: "No se pudieron quitar accesos." };
    }
    if (agregar.length > 0) {
      const { error: e2 } = await supabase
        .from("miembros")
        .insert(agregar.map((e) => ({ establecimiento_id: e, perfil_id: perfilId })));
      if (e2) return { error: "No se pudieron agregar accesos." };
    }

    refresh();
    return { ok: "Accesos guardados." };
  } catch (e) {
    return resultado(e);
  }
}

/** Reenvía la invitación (si nunca ingresó) o un enlace para definir contraseña. */
export async function enviarEnlaceAcceso(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin");
  try {
    const id = uuid(fd.get("id"), "usuario");
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.getUserById(id);
    if (error || !data.user.email) return { error: "No se encontró el usuario." };

    const correo = data.user.email;
    const { error: errorEnvio } = data.user.email_confirmed_at
      ? await (await createClient()).auth.resetPasswordForEmail(correo)
      : await admin.auth.admin.inviteUserByEmail(correo);
    if (errorEnvio) {
      if (errorEnvio.status === 429) return { error: "Se alcanzó el límite de emails. Probá en unos minutos." };
      return { error: `No se pudo enviar el enlace: ${errorEnvio.message}` };
    }
    return { ok: `Enlace enviado a ${correo}.` };
  } catch (e) {
    return resultado(e);
  }
}

// --- Establecimientos ----------------------------------------------------------

function datosEstablecimiento(fd: FormData) {
  return {
    nombre: texto(fd, "nombre", 120, true),
    localidad: texto(fd, "localidad", 120),
    partido: texto(fd, "partido", 120),
    superficie_ha: hectareas(fd, "superficie_ha"),
    notas: texto(fd, "notas", 2000),
  };
}

export async function crearEstablecimiento(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin");
  try {
    const fila = datosEstablecimiento(fd);
    const supabase = await createClient();
    const { error } = await supabase.from("establecimientos").insert(fila);
    if (error) return { error: "No se pudo crear el establecimiento." };
    refresh();
    return { ok: `Establecimiento "${fila.nombre}" creado.` };
  } catch (e) {
    return resultado(e);
  }
}

export async function editarEstablecimiento(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin");
  try {
    const id = uuid(fd.get("id"), "establecimiento");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("establecimientos")
      .update(datosEstablecimiento(fd))
      .eq("id", id)
      .select("id");
    if (error || !data?.length) return { error: "No se pudieron guardar los cambios." };
    refresh();
    return { ok: "Establecimiento actualizado." };
  } catch (e) {
    return resultado(e);
  }
}

/** Borra el establecimiento con sus lotes, documentos (y archivos) y novedades. */
export async function eliminarEstablecimiento(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario("admin");
  let id: string;
  try {
    id = uuid(fd.get("id"), "establecimiento");
    if (texto(fd, "confirmacion", 200) !== texto(fd, "nombre_esperado", 200, true)) {
      return { error: "Escribí el nombre exacto del establecimiento para confirmar." };
    }
  } catch (e) {
    return resultado(e);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("establecimientos").delete().eq("id", id).select("id");
  if (error || !data?.length) return { error: "No se pudo eliminar el establecimiento." };

  // Los archivos no se borran en cascada: se limpia la carpeta del bucket.
  const almacen = createAdminClient().storage.from(BUCKET);
  for (;;) {
    const { data: archivos } = await almacen.list(id, { limit: 100 });
    if (!archivos?.length) break;
    const { error: errorBorrado } = await almacen.remove(archivos.map((a) => `${id}/${a.name}`));
    if (errorBorrado) break;
  }

  redirect("/portal/establecimientos");
}
