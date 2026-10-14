import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BotonConfirmar from "@/components/portal/BotonConfirmar";
import { AreaTexto, Campo } from "@/components/portal/Campos";
import FormEstablecimiento from "@/components/portal/FormEstablecimiento";
import FormNovedad from "@/components/portal/FormNovedad";
import Formulario from "@/components/portal/Formulario";
import ListaNovedades from "@/components/portal/ListaNovedades";
import SubirDocumento from "@/components/portal/SubirDocumento";
import Tarjeta, { EncabezadoPagina, Vacio } from "@/components/portal/Tarjeta";
import { eliminarEstablecimiento } from "@/lib/portal/acciones/admin";
import { crearLote, editarLote, eliminarDocumento, eliminarLote } from "@/lib/portal/acciones/contenido";
import { nombreVisible, requerirUsuario } from "@/lib/portal/auth";
import {
  listarDocumentos,
  listarLotes,
  listarMiembros,
  listarNovedades,
  listarPerfiles,
  obtenerEstablecimiento,
  puedeCargar,
} from "@/lib/portal/datos";
import { formatoBytes, formatoFecha, formatoHa } from "@/lib/portal/formato";
import { CATEGORIA_ETIQUETA, ROL_ETIQUETA, type Lote } from "@/lib/portal/tipos";

export const metadata: Metadata = { title: "Establecimiento" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EstablecimientoPage({ params }: PageProps<"/portal/establecimientos/[id]">) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const usuario = await requerirUsuario();

  // Si no tiene acceso, la base no devuelve la fila: se ve como inexistente.
  const establecimiento = await obtenerEstablecimiento(id);
  if (!establecimiento) notFound();

  const esAdmin = usuario.rol === "admin";
  const [lotes, documentos, novedades, cargar, miembros, perfiles] = await Promise.all([
    listarLotes(id),
    listarDocumentos(id),
    listarNovedades({ establecimientoId: id }),
    puedeCargar(id),
    esAdmin ? listarMiembros({ establecimientoId: id }) : Promise.resolve([]),
    esAdmin ? listarPerfiles() : Promise.resolve([]),
  ]);
  const nombreLote = new Map(lotes.map((l) => [l.id, l.nombre]));
  const conAcceso = perfiles.filter((p) => miembros.some((m) => m.perfil_id === p.id));
  const e = establecimiento;

  return (
    <>
      <p className="mb-4 text-sm">
        <Link href="/portal/establecimientos" className="font-semibold text-verde hover:underline">
          ← Establecimientos
        </Link>
      </p>
      <EncabezadoPagina antetitulo="Establecimiento" titulo={e.nombre}>
        {[[e.localidad, e.partido].filter(Boolean).join(", "), e.superficie_ha ? formatoHa(e.superficie_ha) : ""]
          .filter(Boolean)
          .join(" · ")}
        {e.notas && <p className="mt-2 whitespace-pre-line">{e.notas}</p>}
      </EncabezadoPagina>

      <div className="space-y-6">
        {/* Lotes */}
        <Tarjeta id="lotes" titulo={`Lotes (${lotes.length})`}>
          {lotes.length === 0 ? (
            <Vacio>No hay lotes cargados.</Vacio>
          ) : (
            <div className="-mx-5 overflow-x-auto sm:mx-0">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="border-b-2 border-oliva text-grafito">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-semibold">Lote</th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">Superficie</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Campaña</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Cultivo</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Ambiente</th>
                    {cargar && <th scope="col" className="px-3 py-2"><span className="sr-only">Acciones</span></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-oliva/30">
                  {lotes.map((l) => (
                    <tr key={l.id} className="align-top">
                      <th scope="row" className="px-3 py-2.5 font-semibold text-tinta">
                        {l.nombre}
                        {l.notas && <p className="mt-0.5 font-normal whitespace-pre-line text-grafito">{l.notas}</p>}
                      </th>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap">{formatoHa(l.superficie_ha)}</td>
                      <td className="px-3 py-2.5">{l.campana || "—"}</td>
                      <td className="px-3 py-2.5">{l.cultivo || "—"}</td>
                      <td className="px-3 py-2.5">{l.ambiente || "—"}</td>
                      {cargar && (
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col items-end gap-2">
                            <details className="text-right">
                              <summary className="cursor-pointer text-sm font-semibold text-verde hover:underline">Editar</summary>
                              <div className="mt-3 w-72 rounded-xl border border-oliva/50 bg-marfil p-4 text-left">
                                <CamposLote lote={l} accion="editar" />
                              </div>
                            </details>
                            {esAdmin && (
                              <BotonConfirmar
                                accion={eliminarLote}
                                id={l.id}
                                texto="Eliminar"
                                pregunta={`¿Eliminar el lote "${l.nombre}"? Los documentos asociados quedan en el establecimiento.`}
                              />
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {cargar && (
            <details className="mt-5 rounded-xl border border-dashed border-verde/40 p-4">
              <summary className="cursor-pointer font-semibold text-verde">Agregar lote</summary>
              <div className="mt-4">
                <CamposLote establecimientoId={id} accion="crear" />
              </div>
            </details>
          )}
        </Tarjeta>

        {/* Documentos */}
        <Tarjeta id="documentos" titulo={`Documentos (${documentos.length})`}>
          {documentos.length === 0 ? (
            <Vacio>No hay documentos cargados.</Vacio>
          ) : (
            <ul className="divide-y divide-oliva/40">
              {documentos.map((d) => (
                <li key={d.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <a
                      href={`/portal/documentos/${d.id}`}
                      className="font-semibold text-verde underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-verde"
                    >
                      {d.titulo}
                    </a>
                    <p className="mt-0.5 text-sm text-grafito">
                      {[
                        CATEGORIA_ETIQUETA[d.categoria],
                        d.campana,
                        d.lote_id ? nombreLote.get(d.lote_id) : "",
                        formatoFecha(d.creado_en),
                        formatoBytes(d.archivo_bytes),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                      {usuario.rol !== "personal" && !d.visible_personal && (
                        <span className="ml-2 rounded-full bg-oliva/25 px-2 py-0.5 text-xs font-semibold text-oliva-oscuro">
                          Reservado
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/portal/documentos/${d.id}?ver=1`}
                      target="_blank"
                      rel="noopener"
                      className="text-sm font-semibold text-verde hover:underline"
                    >
                      Ver
                    </a>
                    {(esAdmin || (cargar && d.subido_por === usuario.id)) && (
                      <BotonConfirmar
                        accion={eliminarDocumento}
                        id={d.id}
                        texto="Eliminar"
                        pregunta={`¿Eliminar el documento "${d.titulo}"? El archivo se borra definitivamente.`}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {cargar && (
            <details className="mt-5 rounded-xl border border-dashed border-verde/40 p-4">
              <summary className="cursor-pointer font-semibold text-verde">Cargar documento</summary>
              <div className="mt-4">
                <SubirDocumento establecimientoId={id} lotes={lotes} />
              </div>
            </details>
          )}
        </Tarjeta>

        {/* Novedades */}
        <Tarjeta id="novedades" titulo="Novedades del establecimiento">
          <ListaNovedades novedades={novedades} usuario={usuario} mostrarEstablecimiento={false} />
          {cargar && (
            <details className="mt-5 rounded-xl border border-dashed border-verde/40 p-4">
              <summary className="cursor-pointer font-semibold text-verde">Publicar novedad</summary>
              <div className="mt-4">
                <FormNovedad establecimientoId={id} />
              </div>
            </details>
          )}
        </Tarjeta>

        {/* Administración */}
        {esAdmin && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Tarjeta id="acceso" titulo="Usuarios con acceso">
              {conAcceso.length === 0 ? (
                <Vacio>Nadie tiene acceso todavía. Asignalo desde la ficha de cada usuario.</Vacio>
              ) : (
                <ul className="divide-y divide-oliva/40">
                  {conAcceso.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                      <Link href={`/portal/admin/usuarios/${p.id}`} className="font-semibold text-verde hover:underline">
                        {nombreVisible(p)}
                      </Link>
                      <span className="text-sm text-grafito">
                        {ROL_ETIQUETA[p.rol]}
                        {!p.activo && " · Inactivo"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-4 text-sm">
                <Link href="/portal/admin/usuarios" className="font-semibold text-verde hover:underline">
                  Invitar o asignar usuarios →
                </Link>
              </p>
            </Tarjeta>
            <Tarjeta id="datos" titulo="Datos del establecimiento">
              <FormEstablecimiento establecimiento={e} />
            </Tarjeta>
            <Tarjeta id="eliminar" titulo="Eliminar establecimiento" className="border-red-300 lg:col-span-2">
              <p className="mb-4 text-sm text-grafito">
                Borra definitivamente el establecimiento con todos sus lotes, documentos (y archivos) y
                novedades. No se puede deshacer.
              </p>
              <Formulario accion={eliminarEstablecimiento} boton="Eliminar definitivamente" enviando="Eliminando…" variante="peligro">
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="nombre_esperado" value={e.nombre} />
                <Campo etiqueta={`Para confirmar, escribí: ${e.nombre}`} name="confirmacion" required autoComplete="off" />
              </Formulario>
            </Tarjeta>
          </div>
        )}
      </div>
    </>
  );
}

function CamposLote({
  lote,
  establecimientoId,
  accion,
}: {
  lote?: Lote;
  establecimientoId?: string;
  accion: "crear" | "editar";
}) {
  return (
    <Formulario
      accion={accion === "crear" ? crearLote : editarLote}
      boton={accion === "crear" ? "Agregar lote" : "Guardar"}
      limpiarAlGuardar={accion === "crear"}
    >
      {lote ? (
        <input type="hidden" name="id" value={lote.id} />
      ) : (
        <input type="hidden" name="establecimiento_id" value={establecimientoId} />
      )}
      <div className={accion === "crear" ? "grid gap-4 sm:grid-cols-3" : "space-y-4"}>
        <Campo etiqueta="Nombre" name="nombre" required maxLength={80} defaultValue={lote?.nombre} />
        <Campo
          etiqueta="Superficie (ha)"
          name="superficie_ha"
          inputMode="decimal"
          defaultValue={lote?.superficie_ha != null ? formatoHa(lote.superficie_ha).replace(" ha", "") : undefined}
         
        />
        <Campo etiqueta="Campaña" name="campana" maxLength={20} placeholder="2026/27" defaultValue={lote?.campana} />
        <Campo etiqueta="Cultivo" name="cultivo" maxLength={80} placeholder="Maíz, soja, pastura…" defaultValue={lote?.cultivo} />
        <Campo etiqueta="Ambiente" name="ambiente" maxLength={80} placeholder="Loma, media loma, bajo…" defaultValue={lote?.ambiente} />
      </div>
      <AreaTexto etiqueta="Notas" name="notas" maxLength={2000} rows={2} defaultValue={lote?.notas} />
    </Formulario>
  );
}
