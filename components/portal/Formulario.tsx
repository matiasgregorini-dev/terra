"use client";

import { useActionState, useEffect, useRef, startTransition, type ReactNode } from "react";
import type { EstadoForm } from "@/lib/portal/tipos";

type Props = {
  accion: (estado: EstadoForm, fd: FormData) => Promise<EstadoForm>;
  children: ReactNode;
  boton: string;
  enviando?: string;
  /** Vacía los campos cuando la acción sale bien (p. ej. "agregar lote"). */
  limpiarAlGuardar?: boolean;
  className?: string;
  variante?: "primario" | "secundario" | "peligro";
};

/**
 * Formulario conectado a una Server Action. Muestra el resultado, deshabilita
 * el botón mientras envía y conserva lo escrito si hay un error (React vacía
 * los formularios tras una acción; acá se envía con onSubmit para evitarlo).
 * Sin JavaScript sigue funcionando gracias a `action`.
 */
export default function Formulario({
  accion,
  children,
  boton,
  enviando = "Guardando…",
  limpiarAlGuardar = false,
  className = "",
  variante = "primario",
}: Props) {
  const [estado, despachar, pendiente] = useActionState(accion, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado?.ok && limpiarAlGuardar) ref.current?.reset();
  }, [estado, limpiarAlGuardar]);

  return (
    <form
      ref={ref}
      action={despachar}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => despachar(fd));
      }}
      className={`space-y-4 ${className}`}
    >
      {children}
      <Resultado estado={estado} />
      <button type="submit" disabled={pendiente} className={claseBoton(variante)}>
        {pendiente ? enviando : boton}
      </button>
    </form>
  );
}

export function Resultado({ estado }: { estado: EstadoForm }) {
  return (
    <p aria-live="polite" className="text-sm empty:hidden">
      {estado?.error && (
        <span className="block rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-800">
          {estado.error}
        </span>
      )}
      {estado?.ok && (
        <span className="block rounded-lg border border-verde/20 bg-verde/5 px-3 py-2 text-verde">
          {estado.ok}
        </span>
      )}
    </p>
  );
}

export function claseBoton(variante: "primario" | "secundario" | "peligro" = "primario") {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60";
  const variantes = {
    primario: "bg-verde text-white hover:bg-verde-oscuro focus-visible:outline-verde",
    secundario:
      "border border-verde/30 bg-white text-verde hover:bg-verde/5 focus-visible:outline-verde",
    peligro: "border border-red-300 bg-white text-red-800 hover:bg-red-50 focus-visible:outline-red-700",
  };
  return `${base} ${variantes[variante]}`;
}
