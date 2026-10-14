import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { supabaseConfigurado, supabasePublishableKey, supabaseUrl } from "./config";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Actúa con la sesión del usuario (cookies), así que la base aplica sus
 * permisos. Crear uno nuevo en cada request; nunca compartirlo.
 */
export async function createClient() {
  const cookieStore = await cookies();
  // Supabase valida el vencimiento de la sesión con la hora actual (Date.now),
  // así que todo lo que use este cliente se resuelve recién al llegar el pedido.
  await connection();
  if (!supabaseConfigurado()) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver README).",
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Desde un Server Component no se pueden escribir cookies. No es un
          // problema: proxy.ts renueva la sesión antes de cada página.
        }
      },
    },
  });
}
