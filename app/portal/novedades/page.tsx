import type { Metadata } from "next";
import FormNovedad from "@/components/portal/FormNovedad";
import ListaNovedades from "@/components/portal/ListaNovedades";
import Tarjeta, { EncabezadoPagina } from "@/components/portal/Tarjeta";
import { requerirUsuario } from "@/lib/portal/auth";
import { listarEstablecimientos, listarNovedades } from "@/lib/portal/datos";

export const metadata: Metadata = { title: "Novedades" };

export default async function NovedadesPage() {
  const usuario = await requerirUsuario();
  const [novedades, establecimientos] = await Promise.all([
    listarNovedades({ limite: 100 }),
    usuario.rol === "admin" ? listarEstablecimientos() : Promise.resolve([]),
  ]);

  return (
    <>
      <EncabezadoPagina antetitulo="Comunicaciones" titulo="Novedades">
        Avisos de Terra Consultora para todos los usuarios y para cada establecimiento.
      </EncabezadoPagina>
      <div className={`grid gap-6 ${usuario.rol === "admin" ? "lg:grid-cols-[2fr_1fr]" : ""}`}>
        <Tarjeta>
          <ListaNovedades novedades={novedades} usuario={usuario} />
        </Tarjeta>
        {usuario.rol === "admin" && (
          <Tarjeta id="publicar" titulo="Publicar novedad" className="self-start">
            <FormNovedad establecimientos={establecimientos} />
          </Tarjeta>
        )}
      </div>
      {usuario.rol === "tecnico" && (
        <p className="mt-6 text-sm text-grafito">
          Para publicar una novedad, entrá al establecimiento correspondiente.
        </p>
      )}
    </>
  );
}
