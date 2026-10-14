import { crearEstablecimiento, editarEstablecimiento } from "@/lib/portal/acciones/admin";
import { formatoHa } from "@/lib/portal/formato";
import type { Establecimiento } from "@/lib/portal/tipos";
import { AreaTexto, Campo } from "./Campos";
import Formulario from "./Formulario";

export default function FormEstablecimiento({ establecimiento: e }: { establecimiento?: Establecimiento }) {
  return (
    <Formulario
      accion={e ? editarEstablecimiento : crearEstablecimiento}
      boton={e ? "Guardar cambios" : "Crear establecimiento"}
      limpiarAlGuardar={!e}
    >
      {e && <input type="hidden" name="id" value={e.id} />}
      <Campo etiqueta="Nombre" name="nombre" required maxLength={120} defaultValue={e?.nombre} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Localidad" name="localidad" maxLength={120} defaultValue={e?.localidad} />
        <Campo etiqueta="Partido" name="partido" maxLength={120} defaultValue={e?.partido} />
      </div>
      <Campo
        etiqueta="Superficie (ha)"
        name="superficie_ha"
        inputMode="decimal"
        defaultValue={e?.superficie_ha != null ? formatoHa(e.superficie_ha).replace(" ha", "") : undefined}
        placeholder="Ej.: 1.250,5"
      />
      <AreaTexto etiqueta="Notas" name="notas" maxLength={2000} rows={3} defaultValue={e?.notas} />
    </Formulario>
  );
}
