import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./config";

/**
 * Cliente con la clave secreta: saltea los permisos de la base. Usar SOLO
 * desde Server Actions que ya verificaron que quien llama es administrador
 * (ver lib/portal/auth.ts → requerirUsuario("admin")).
 */
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secretKey) {
    throw new Error("Falta SUPABASE_SECRET_KEY (ver README).");
  }
  return createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
