"use client";

import { useActionState, startTransition } from "react";
import type { EstadoForm } from "@/lib/portal/tipos";
import { Resultado, claseBoton } from "./Formulario";

/** Botón de una acción destructiva que pide confirmación antes de enviar. */
export default function BotonConfirmar({
  accion,
  id,
  texto,
  pregunta,
}: {
  accion: (estado: EstadoForm, fd: FormData) => Promise<EstadoForm>;
  id: string;
  texto: string;
  pregunta: string;
}) {
  const [estado, despachar, pendiente] = useActionState(accion, null);
  return (
    <form
      action={despachar}
      onSubmit={(e) => {
        e.preventDefault();
        if (!window.confirm(pregunta)) return;
        const fd = new FormData(e.currentTarget);
        startTransition(() => despachar(fd));
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pendiente} className={`${claseBoton("peligro")} min-h-9 px-3 text-xs`}>
        {pendiente ? "…" : texto}
      </button>
      {estado?.error && <Resultado estado={estado} />}
    </form>
  );
}
