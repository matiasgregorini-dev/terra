import Image from "next/image";
import { site } from "@/lib/site";
import Stripes from "./Stripes";

// Portada inspirada en la tapa de la carpeta: logo, áreas, lema y franjas verticales.
export default function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="relative isolate overflow-hidden bg-marfil pt-[4.25rem]"
    >
      <Stripes className="absolute inset-y-0 right-0 -z-10 w-12 sm:w-24 lg:w-[22rem]" />

      <div className="mx-auto flex min-h-[calc(100svh-4.25rem)] max-w-6xl items-center px-4 py-16 pr-16 sm:px-6 sm:pr-32 lg:pr-[24rem]">
        <div className="w-full max-w-xl">
          <h1 id="hero-titulo">
            <Image
              src="/logo.svg"
              alt={site.name}
              width={203}
              height={109}
              className="h-auto w-full max-w-[26rem]"
              preload
            />
          </h1>

          <ul className="mt-8 space-y-1.5 text-lg font-medium text-tinta sm:text-xl">
            {site.areas.map((area) => (
              <li key={area} className="flex items-center gap-3">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-oliva" />
                {area}
              </li>
            ))}
          </ul>

          <p className="mt-8">
            <Image
              src="/lema.svg"
              alt={site.lema}
              width={188}
              height={26}
              className="h-auto w-full max-w-[19rem]"
            />
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contacto"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-verde px-8 text-base font-semibold text-white shadow-md transition hover:bg-verde-oscuro focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde"
            >
              Contactar
            </a>
            <a
              href="#servicios"
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-verde px-8 text-base font-semibold text-verde transition hover:bg-verde hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde"
            >
              Ver servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
