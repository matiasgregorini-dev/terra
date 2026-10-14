"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

const control =
  "mt-1.5 block w-full rounded-lg border border-grafito/30 bg-white px-3 py-2.5 text-base text-tinta shadow-sm placeholder:text-grafito/70 focus:border-verde focus:outline-2 focus:outline-verde/30";

type Base = { etiqueta: string; ayuda?: ReactNode; name: string };

/**
 * Id único por campo (useId): una página puede tener varios formularios con
 * campos del mismo nombre (p. ej. "titulo" en documentos y en novedades), y
 * cada etiqueta tiene que apuntar a su propio campo.
 */
function useIdCampo(id: string | undefined) {
  const generado = useId();
  return id ?? generado;
}

export function Campo({ etiqueta, ayuda, ...props }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = useIdCampo(props.id);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-tinta">
        {etiqueta}
        {props.required && <span aria-hidden="true" className="text-grafito"> *</span>}
      </label>
      <input id={id} className={control} aria-describedby={ayuda ? `${id}-ayuda` : undefined} {...props} />
      {ayuda && <p id={`${id}-ayuda`} className="mt-1 text-sm text-grafito">{ayuda}</p>}
    </div>
  );
}

export function AreaTexto({ etiqueta, ayuda, ...props }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useIdCampo(props.id);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-tinta">
        {etiqueta}
        {props.required && <span aria-hidden="true" className="text-grafito"> *</span>}
      </label>
      <textarea id={id} rows={4} className={control} aria-describedby={ayuda ? `${id}-ayuda` : undefined} {...props} />
      {ayuda && <p id={`${id}-ayuda`} className="mt-1 text-sm text-grafito">{ayuda}</p>}
    </div>
  );
}

export function Selector({
  etiqueta,
  ayuda,
  opciones,
  ...props
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { opciones: { valor: string; texto: string }[] }) {
  const id = useIdCampo(props.id);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-tinta">
        {etiqueta}
        {props.required && <span aria-hidden="true" className="text-grafito"> *</span>}
      </label>
      <select id={id} className={control} aria-describedby={ayuda ? `${id}-ayuda` : undefined} {...props}>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
      {ayuda && <p id={`${id}-ayuda`} className="mt-1 text-sm text-grafito">{ayuda}</p>}
    </div>
  );
}

export function Casilla({ etiqueta, ayuda, ...props }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = useIdCampo(props.id);
  return (
    <div className="flex items-start gap-3">
      <input id={id} type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-verde" {...props} />
      <div>
        <label htmlFor={id} className="text-sm font-semibold text-tinta">{etiqueta}</label>
        {ayuda && <p className="text-sm text-grafito">{ayuda}</p>}
      </div>
    </div>
  );
}
