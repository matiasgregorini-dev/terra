import type { Establecimiento } from "@/lib/portal/tipos";

/** Lista de casillas para elegir a qué establecimientos accede un usuario. */
export default function SelectorEstablecimientos({
  establecimientos,
  elegidos = [],
}: {
  establecimientos: Pick<Establecimiento, "id" | "nombre" | "localidad">[];
  elegidos?: string[];
}) {
  if (establecimientos.length === 0) {
    return <p className="text-sm text-grafito">Todavía no hay establecimientos creados.</p>;
  }
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-tinta">Establecimientos</legend>
      <div className="mt-2 max-h-64 space-y-1 overflow-y-auto rounded-lg border border-grafito/20 p-2">
        {establecimientos.map((e) => (
          <label key={e.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-verde/5">
            <input
              type="checkbox"
              name="establecimientos"
              value={e.id}
              defaultChecked={elegidos.includes(e.id)}
              className="h-5 w-5 shrink-0 accent-verde"
            />
            <span>
              {e.nombre}
              {e.localidad && <span className="text-sm text-grafito"> · {e.localidad}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
