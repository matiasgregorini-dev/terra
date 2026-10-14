import type { ReactNode } from "react";

export default function Tarjeta({
  titulo,
  accion,
  children,
  className = "",
  id,
}: {
  titulo?: ReactNode;
  accion?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id && titulo ? `${id}-titulo` : undefined}
      className={`rounded-2xl border-t-4 border-oliva bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {(titulo || accion) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {titulo && (
            <h2 id={id ? `${id}-titulo` : undefined} className="font-display text-xl font-bold text-verde">
              {titulo}
            </h2>
          )}
          {accion}
        </div>
      )}
      {children}
    </section>
  );
}

export function Vacio({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-marfil px-4 py-6 text-center text-grafito">{children}</p>;
}

export function EncabezadoPagina({
  antetitulo,
  titulo,
  children,
}: {
  antetitulo?: ReactNode;
  titulo: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8">
      {antetitulo && (
        <p className="text-sm font-semibold tracking-widest text-oliva-oscuro uppercase">{antetitulo}</p>
      )}
      <h1 className="mt-1 font-display text-3xl font-bold text-verde sm:text-4xl">{titulo}</h1>
      {children && <div className="mt-3 max-w-3xl text-grafito">{children}</div>}
    </div>
  );
}
