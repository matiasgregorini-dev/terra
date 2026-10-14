import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { rutaSegura } from "@/lib/portal/form";
import { createClient } from "@/lib/supabase/server";

const TIPOS: EmailOtpType[] = ["invite", "recovery", "email", "email_change"];

/**
 * Destino de los enlaces que envía Supabase por email (invitación y
 * recuperación de contraseña). Verifica el token, crea la sesión en cookies y
 * lleva al usuario a definir su contraseña. Las plantillas de email que apuntan
 * acá están en supabase/plantillas-email/.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type") as EmailOtpType | null;
  const destino = rutaSegura(searchParams.get("next"), "/portal/cuenta");

  if (tokenHash && tipo && TIPOS.includes(tipo)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(new URL(destino, request.url));
    }
  }
  return NextResponse.redirect(new URL("/ingresar?error=enlace", request.url));
}
