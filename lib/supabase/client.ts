import { createBrowserClient } from "@supabase/ssr";
import { supabasePublishableKey, supabaseUrl } from "./config";

/**
 * Cliente de Supabase para el navegador. Se usa solo para subir archivos
 * directo a Storage (sin pasar por el servidor, que limita el tamaño del
 * cuerpo). Las políticas del bucket validan que el usuario pueda cargar.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
