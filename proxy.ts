import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  supabaseConfigurado,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabase/config";

/**
 * Corre antes de las rutas del portal y del login:
 * 1. Renueva la sesión de Supabase si el token venció y devuelve las cookies
 *    nuevas (los Server Components no pueden escribir cookies).
 * 2. Redirige a /ingresar a quien entra al portal sin sesión, y al portal a
 *    quien ya tiene sesión y abre /ingresar.
 *
 * Es una primera barrera de comodidad. La autorización real está en la base
 * (RLS) y en lib/portal/auth.ts, que se verifican en cada página y acción.
 * El sitio institucional no pasa por acá (ver `matcher`) y sigue siendo estático.
 */
export async function proxy(request: NextRequest) {
  if (!supabaseConfigurado()) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Evita que un CDN guarde en caché una respuesta con cookies de sesión.
        for (const [key, value] of Object.entries(headers ?? {})) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // No ejecutar nada entre createServerClient y getClaims: getClaims valida el
  // token y dispara la renovación de la sesión.
  const { data } = await supabase.auth.getClaims();
  const logueado = Boolean(data?.claims?.sub);
  const { pathname, search } = request.nextUrl;

  if (!logueado && pathname.startsWith("/portal")) {
    const url = request.nextUrl.clone();
    url.pathname = "/ingresar";
    url.search = "";
    url.searchParams.set("siguiente", pathname + search);
    return redirigirConCookies(url, response);
  }

  if (logueado && pathname === "/ingresar") {
    const url = request.nextUrl.clone();
    url.pathname = "/portal";
    url.search = "";
    return redirigirConCookies(url, response);
  }

  return response;
}

/** Redirige conservando las cookies de sesión que se hayan renovado. */
function redirigirConCookies(url: URL, desde: NextResponse) {
  const redirect = NextResponse.redirect(url);
  for (const cookie of desde.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }
  return redirect;
}

export const config = {
  matcher: ["/portal/:path*", "/ingresar", "/auth/:path*"],
};
