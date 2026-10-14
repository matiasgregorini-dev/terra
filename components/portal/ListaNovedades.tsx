import { eliminarNovedad } from "@/lib/portal/acciones/contenido";
import { formatoFecha } from "@/lib/portal/formato";
import type { Novedad, Usuario } from "@/lib/portal/tipos";
import BotonConfirmar from "./BotonConfirmar";
import { Vacio } from "./Tarjeta";

export default function ListaNovedades({
  novedades,
  usuario,
  mostrarEstablecimiento = true,
}: {
  novedades: Novedad[];
  usuario: Usuario;
  mostrarEstablecimiento?: boolean;
}) {
  if (novedades.length === 0) return <Vacio>No hay novedades publicadas.</Vacio>;
  return (
    <ul className="divide-y divide-oliva/40">
      {novedades.map((n) => (
        <li key={n.id} className="py-4 first:pt-0 last:pb-0">
          <article>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-verde">{n.titulo}</h3>
              <p className="text-sm text-grafito">
                <time dateTime={n.publicado_en}>{formatoFecha(n.publicado_en)}</time>
                {mostrarEstablecimiento && (
                  <> · {n.establecimientos?.nombre ?? "General"}</>
                )}
                {usuario.rol !== "personal" && !n.visible_personal && <> · Reservada</>}
              </p>
            </div>
            <p className="mt-2 leading-relaxed whitespace-pre-line text-tinta">{n.cuerpo}</p>
            {(usuario.rol === "admin" || n.autor_id === usuario.id) && (
              <div className="mt-3">
                <BotonConfirmar
                  accion={eliminarNovedad}
                  id={n.id}
                  texto="Eliminar"
                  pregunta={`¿Eliminar la novedad "${n.titulo}"?`}
                />
              </div>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
