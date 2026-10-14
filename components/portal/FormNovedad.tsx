import { publicarNovedad } from "@/lib/portal/acciones/contenido";
import { AreaTexto, Campo, Casilla, Selector } from "./Campos";
import Formulario from "./Formulario";

/** Si se pasan `establecimientos`, se elige el destino (incluida "General", solo admin). */
export default function FormNovedad({
  establecimientoId,
  establecimientos,
}: {
  establecimientoId?: string;
  establecimientos?: { id: string; nombre: string }[];
}) {
  return (
    <Formulario accion={publicarNovedad} boton="Publicar" enviando="Publicando…" limpiarAlGuardar>
      {establecimientoId ? (
        <input type="hidden" name="establecimiento_id" value={establecimientoId} />
      ) : (
        <Selector
          etiqueta="Destinatarios"
          name="establecimiento_id"
          defaultValue=""
          opciones={[
            { valor: "", texto: "General: todos los usuarios" },
            ...(establecimientos ?? []).map((e) => ({ valor: e.id, texto: `Solo ${e.nombre}` })),
          ]}
        />
      )}
      <Campo etiqueta="Título" name="titulo" required maxLength={160} />
      <AreaTexto etiqueta="Texto" name="cuerpo" required maxLength={5000} />
      <Casilla etiqueta="Visible para el personal del establecimiento" name="visible_personal" defaultChecked />
    </Formulario>
  );
}
