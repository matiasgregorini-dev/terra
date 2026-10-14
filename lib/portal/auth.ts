import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Rol, Usuario } from "./tipos";

/**
 * Capa de acceso: única puerta para saber quién es el usuario.
 * Toda página y Server Action del portal pasa por acá; nunca se confía en lo
 * que diga el navegador. `cache` evita repetir la consulta en el mismo request.
 */
type Sesion =
  | { estado: "anonimo" }
  | { estado: "sin-acceso" } // sesión válida, pero perfil inexistente o desactivado
  | { estado: "activo"; usuario: Usuario };

const obtenerSesion = cache(async (): Promise<Sesion> => {
  const supabase = await createClient();
  // getClaims verifica la firma y el vencimiento del token de sesión.
  const { data } = await supabase.auth.getClaims();
  const id = data?.claims?.sub;
  if (!id) return { estado: "anonimo" };

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("id, email, nombre, rol, activo")
    .eq("id", id)
    .maybeSingle();

  if (!perfil || !perfil.activo) return { estado: "sin-acceso" };
  return {
    estado: "activo",
    usuario: {
      id: perfil.id,
      email: perfil.email,
      nombre: perfil.nombre,
      rol: perfil.rol as Rol,
    },
  };
});

export async function obtenerUsuario(): Promise<Usuario | null> {
  const sesion = await obtenerSesion();
  return sesion.estado === "activo" ? sesion.usuario : null;
}

/** Exige sesión (y, si se indica, uno de los roles); si no, redirige. */
export async function requerirUsuario(...roles: Rol[]): Promise<Usuario> {
  const sesion = await obtenerSesion();
  if (sesion.estado === "anonimo") redirect("/ingresar");
  // Cuenta desactivada: se cierra la sesión para no quedar en un bucle
  // entre /ingresar (que redirige a quien tiene sesión) y /portal.
  if (sesion.estado === "sin-acceso") redirect("/auth/salir");
  const { usuario } = sesion;
  if (roles.length > 0 && !roles.includes(usuario.rol)) redirect("/portal");
  return usuario;
}

export function nombreVisible(u: Pick<Usuario, "nombre" | "email">): string {
  return u.nombre.trim() || u.email;
}
