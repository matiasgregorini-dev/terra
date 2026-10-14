import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Cierra la sesión de una cuenta desactivada o sin perfil (ver
 * requerirUsuario en lib/portal/auth.ts) y la manda a /ingresar con el aviso.
 * El botón "Salir" del portal usa la Server Action `salir`, no esta ruta.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/ingresar?motivo=sin-acceso", request.url));
}
