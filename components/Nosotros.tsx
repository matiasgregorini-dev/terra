import Image from "next/image";
import { site } from "@/lib/site";
import SectionTitle from "./SectionTitle";

export default function Nosotros() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-titulo">
      <div className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle id="nosotros-titulo" eyebrow="Nosotros">
            Misión
          </SectionTitle>
          <p className="mt-10 max-w-3xl text-lg leading-relaxed text-tinta md:ml-20 lg:ml-28 lg:text-xl lg:leading-relaxed">
            {site.mision}
          </p>
        </div>
      </div>

      <div className="relative isolate overflow-hidden py-20 sm:py-28">
        {/* TODO: reemplazar /public/hero.jpg por una foto de campo propia o con licencia (1920×1080 o mayor). */}
        <Image
          src="/hero.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-verde-oscuro/90" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <span aria-hidden="true" className="-ml-4 h-9 w-10 shrink-0 rounded-r-sm bg-oliva sm:-ml-6 sm:h-11 sm:w-20 lg:w-28" />
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Visión
            </h2>
          </div>
          <p className="mt-10 max-w-3xl text-lg leading-relaxed text-marfil md:ml-20 lg:ml-28 lg:text-xl lg:leading-relaxed">
            {site.vision}
          </p>
        </div>
      </div>
    </section>
  );
}
