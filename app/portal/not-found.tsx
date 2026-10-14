import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border-t-4 border-oliva bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-semibold tracking-widest text-oliva-oscuro uppercase">No disponible</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-verde">No encontramos lo que buscás</h1>
      <p className="mt-3 text-grafito">
        La página no existe o no tenés acceso a ella. Si creés que deberías verla, comunicate con Terra
        Consultora.
      </p>
      <Link
        href="/portal"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-verde px-5 text-sm font-semibold text-white hover:bg-verde-oscuro"
      >
        Volver al inicio del portal
      </Link>
    </div>
  );
}
