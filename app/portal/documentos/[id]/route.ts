import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Descarga de un documento. La base solo devuelve la ficha si el usuario puede
 * verla (RLS); en ese caso se genera un enlace firmado que vence en 60
 * segundos, así el archivo nunca queda expuesto con una URL permanente.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/portal/documentos/[id]">) {
  const { id } = await ctx.params;
  if (!UUID.test(id)) return new NextResponse("Documento no encontrado", { status: 404 });

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) {
    return NextResponse.redirect(new URL("/ingresar", request.url));
  }

  const { data: doc } = await supabase
    .from("documentos")
    .select("archivo_path, archivo_nombre")
    .eq("id", id)
    .maybeSingle();
  if (!doc) return new NextResponse("Documento no encontrado", { status: 404 });

  const verEnLinea = request.nextUrl.searchParams.get("ver") === "1";
  const { data, error } = await supabase.storage
    .from("documentos")
    .createSignedUrl(doc.archivo_path, 60, verEnLinea ? undefined : { download: doc.archivo_nombre });
  if (error || !data) return new NextResponse("No se pudo generar el enlace de descarga", { status: 502 });

  const respuesta = NextResponse.redirect(data.signedUrl);
  respuesta.headers.set("Cache-Control", "private, no-store");
  return respuesta;
}
