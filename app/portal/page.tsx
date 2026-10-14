import type { Metadata } from "next";
import Link from "next/link";
import ListaNovedades from "@/components/portal/ListaNovedades";
import Tarjeta, { EncabezadoPagina, Vacio } from "@/components/portal/Tarjeta";
import { nombreVisible, requerirUsuario } from "@/lib/portal/auth";
import { listarEstablecimientos, listarNovedades, listarPerfiles } from "@/lib/portal/datos";
import { formatoHa } from "@/lib/portal/formato";
import { ROL_DESCRIPCION, ROL_ETIQUETA } from "@/lib/portal/tipos";

export const metadata: Metadata = { title: "Inicio" };

export default async function PanelPage() {
  const usuario = await requerirUsuario();
  const [establecimientos, novedades, perfiles] = await Promise.all([
    listarEstablecimientos(),
    listarNovedades({ limite: 5 }),
    usuario.rol === "admin" ? listarPerfiles() : Promise.resolve([]),
  ]);

  return (
    <>
      <EncabezadoPagina antetitulo={ROL_ETIQUETA[usuario.rol]} titulo={`Hola, ${nombreVisible(usuario)}`}>
        {ROL_DESCRIPCION[usuario.rol]}
      </EncabezadoPagina>

      {usuario.rol === "admin" && (
        <dl className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { dato: "Establecimientos", valor: establecimientos.length, href: "/portal/establecimientos" },
            { dato: "Usuarios activos", valor: perfiles.filter((p) => p.activo).length, href: "/portal/admin/usuarios" },
            { dato: "Novedades recientes", valor: novedades.length, href: "/portal/novedades" },
          ].map((c) => (
            <Link key={c.dato} href={c.href} className="rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-verde">
              <dt className="text-sm font-semibold text-grafito">{c.dato}</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-verde">{c.valor}</dd>
            </Link>
          ))}
        </dl>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta
          id="mis-establecimientos"
          titulo={usuario.rol === "admin" ? "Establecimientos" : "Mis establecimientos"}
          accion={
            <Link href="/portal/establecimientos" className="text-sm font-semibold text-verde hover:underline">
              Ver todos
            </Link>
          }
        >
          {establecimientos.length === 0 ? (
            <Vacio>
              {usuario.rol === "admin"
                ? "Todavía no hay establecimientos. Creá el primero desde “Establecimientos”."
                : "Todavía no tenés establecimientos asignados. Terra Consultora te los habilitará."}
            </Vacio>
          ) : (
            <ul className="divide-y divide-oliva/40">
              {establecimientos.slice(0, 8).map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/portal/establecimientos/${e.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:text-verde focus-visible:outline-2 focus-visible:outline-verde"
                  >
                    <span className="font-semibold">{e.nombre}</span>
                    <span className="text-sm text-grafito">
                      {[e.localidad, e.superficie_ha ? formatoHa(e.superficie_ha) : ""].filter(Boolean).join(" · ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta
          id="ultimas-novedades"
          titulo="Últimas novedades"
          accion={
            <Link href="/portal/novedades" className="text-sm font-semibold text-verde hover:underline">
              Ver todas
            </Link>
          }
        >
          <ListaNovedades novedades={novedades} usuario={usuario} />
        </Tarjeta>
      </div>
    </>
  );
}
