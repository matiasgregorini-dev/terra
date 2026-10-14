/**
 * Configuración de Supabase, leída de variables de entorno (ver .env.example).
 *
 * - NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY son
 *   públicas por diseño: viajan al navegador y solo permiten lo que las
 *   políticas de seguridad (RLS) de la base autorizan al usuario logueado.
 * - SUPABASE_SECRET_KEY es secreta y solo se usa en el servidor
 *   (lib/supabase/admin.ts) para invitar y administrar usuarios.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export function supabaseConfigurado(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey);
}
