import Image from "next/image";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="relative isolate flex min-h-[88svh] items-center overflow-hidden pt-16"
    >
      {/* TODO: reemplazar /public/hero.jpg por una foto de campo propia o con licencia (1920×1080 o mayor). */}
      <Image
        src="/hero.jpg"
        alt="Paisaje de campo agropecuario"
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Capa oscura para garantizar contraste del texto sobre cualquier foto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/45 to-verde-oscuro/80"
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl text-white">
          <p className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-crema">
            Consultoría agropecuaria
          </p>
          <h1
            id="hero-titulo"
            className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {site.name}
          </h1>
          <p className="mt-4 text-xl font-medium text-crema sm:text-2xl">
            {site.tagline}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {site.valueProposition}
          </p>
          <a
            href="#contacto"
            className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-crema px-8 text-base font-semibold text-verde shadow-lg transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crema"
          >
            Contactar
          </a>
        </div>
      </div>
    </section>
  );
}
