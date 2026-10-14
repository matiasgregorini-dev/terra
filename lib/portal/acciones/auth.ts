"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requerirUsuario } from "../auth";
import { ErrorValidacion, email, rutaSegura, texto } from "../form";
import type { EstadoForm } from "../tipos";

const CONTRASENA_MIN = 8;

export async function ingresar(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  let correo: string;
  try {
    correo = email(fd);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const contrasena = String(fd.get("contrasena") ?? "");
  if (!contrasena) return { error: "Ingresá tu contraseña." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  });
  if (error) {
    if (error.code === "invalid_credentials") {
      // Mensaje genérico: no revela si el email existe.
      return { error: "Email o contraseña incorrectos." };
    }
    if (error.code === "user_banned") {
      return { error: "Tu cuenta está desactivada. Comunicate con Terra Consultora." };
    }
    if (error.status === 429) {
      return { error: "Demasiados intentos. Esperá unos minutos y volvé a probar." };
    }
    // Cualquier otro caso es un problema del servicio o de configuración
    // (p. ej. proveedor Email desactivado en Supabase): se registra para diagnóstico.
    console.error("Error de Supabase Auth al ingresar:", error.code, error.message);
    return { error: "No se pudo ingresar en este momento. Intentá más tarde." };
  }
  redirect(rutaSegura(fd.get("siguiente")));
}

export async function recuperar(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  let correo: string;
  try {
    correo = email(fd);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(correo);
  if (error?.status === 429) {
    return { error: "Ya pediste un enlace hace muy poco. Esperá unos minutos." };
  }
  // Misma respuesta exista o no la cuenta (no revela qué emails están registrados).
  return {
    ok: "Si el email corresponde a una cuenta, te enviamos un enlace para definir una contraseña nueva. Revisá también la carpeta de spam.",
  };
}

export async function cambiarContrasena(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  await requerirUsuario();
  const contrasena = String(fd.get("contrasena") ?? "");
  const repetir = String(fd.get("repetir") ?? "");
  if (contrasena.length < CONTRASENA_MIN) {
    return { error: `La contraseña tiene que tener al menos ${CONTRASENA_MIN} caracteres.` };
  }
  if (contrasena.length > 72) {
    return { error: "La contraseña admite hasta 72 caracteres." };
  }
  if (contrasena !== repetir) return { error: "Las contraseñas no coinciden." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: contrasena });
  if (error) {
    if (error.code === "same_password") {
      return { error: "La contraseña nueva tiene que ser distinta de la actual." };
    }
    if (error.code === "weak_password") {
      return { error: "La contraseña es demasiado débil. Combiná letras, números y símbolos." };
    }
    if (error.code === "reauthentication_needed") {
      return { error: "Por seguridad, cerrá sesión, volvé a ingresar y repetí el cambio." };
    }
    return { error: "No se pudo guardar la contraseña. Intentá de nuevo." };
  }
  return { ok: "Contraseña guardada." };
}

export async function cambiarNombre(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const usuario = await requerirUsuario();
  try {
    const nombre = texto(fd, "nombre", 120, true);
    const supabase = await createClient();
    const { error } = await supabase.from("perfiles").update({ nombre }).eq("id", usuario.id);
    if (error) return { error: "No se pudo guardar el nombre." };
    return { ok: "Nombre guardado." };
  } catch (e) {
    if (e instanceof ErrorValidacion) return { error: e.message };
    throw e;
  }
}

export async function salir() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/ingresar");
}
