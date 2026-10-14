import type { Metadata } from "next";
import Link from "next/link";
import FormEstablecimiento from "@/components/portal/FormEstablecimiento";
import Tarjeta, { EncabezadoPagina, Vacio } from "@/components/portal/Tarjeta";
import { requerirUsuario } from "@/lib/portal/auth";
import { listarEstablecimientos } from "@/lib/portal/datos";
import { formatoHa } from "@/lib/portal/formato";

export const metadata: Metadata = { title: "Establecimientos" };

export default async function EstablecimientosPage() {
  const usuario = await requerirUsuario();
  const establecimientos = await listarEstablecimientos();
  const esAdmin = usuario.rol === "admin";

  return (
    <>
      <EncabezadoPagina antetitulo="Campos" titulo="Establecimientos">
        {esAdmin
          ? "Todos los establecimientos asesorados. Desde la ficha de cada uno se cargan lotes, documentos y novedades."
          : "Los establecimientos a los que tenés acceso."}
      </EncabezadoPagina>

      <div className={`grid gap-6 ${esAdmin ? "lg:grid-cols-[2fr_1fr]" : ""}`}>
        <Tarjeta>
          {establecimientos.length === 0 ? (
            <Vacio>
              {esAdmin ? "Todavía no hay establecimientos cargados." : "Todavía no tenés establecimientos asignados."}
            </Vacio>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {establecimientos.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/portal/establecimientos/${e.id}`}
                    className="block h-full rounded-xl border border-oliva/50 p-4 transition-colors hover:border-verde hover:bg-verde/5 focus-visible:outline-2 focus-visible:outline-verde"
                  >
                    <p className="font-display text-lg font-bold text-verde">{e.nombre}</p>
                    <p className="mt-1 text-sm text-grafito">
                      {[e.localidad, e.partido].filter(Boolean).join(", ") || "Sin ubicación cargada"}
                    </p>
                    <p className="mt-1 text-sm text-grafito">{formatoHa(e.superficie_ha)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
        {esAdmin && (
          <Tarjeta id="nuevo" titulo="Nuevo establecimiento" className="self-start">
            <FormEstablecimiento />
          </Tarjeta>
        )}
      </div>
    </>
  );
}
