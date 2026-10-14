import { site, type Detalle } from "@/lib/site";
import SectionTitle from "./SectionTitle";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-oliva" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Contenido({ d }: { d: Detalle }) {
  return (
    <div className="space-y-4 leading-relaxed text-tinta">
      {d.parrafos?.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
      {d.items && <Bullets items={d.items} />}
      {d.cierre && <p className="font-semibold text-verde">{d.cierre}</p>}
    </div>
  );
}

export default function Servicios() {
  const ganaderia = site.detalle.filter((d) => !d.parrafos);
  const extensos = site.detalle.filter((d) => d.parrafos);

  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="bg-marfil py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle id="servicios-titulo" eyebrow="Qué hacemos" tone="oliva">
          Servicios profesionales
        </SectionTitle>

        <ul className="mt-12 grid gap-x-10 md:ml-20 lg:ml-28 md:grid-cols-2">
          {site.servicios.map((s) => (
            <li
              key={s}
              className="flex items-start gap-3 border-b border-oliva/60 py-3.5 text-[1.05rem] text-tinta"
            >
              <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gris-oliva" />
              {s}
            </li>
          ))}
        </ul>

        <h3 className="mt-20 font-display text-2xl font-bold text-verde sm:text-3xl">
          Nutrición animal
        </h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {ganaderia.map((d) => (
            <article
              key={d.id}
              id={d.id}
              aria-labelledby={`${d.id}-titulo`}
              className="rounded-2xl border-t-4 border-oliva bg-white p-6 shadow-sm"
            >
              <h4 id={`${d.id}-titulo`} className="font-display text-xl font-bold text-verde">
                {d.titulo}
              </h4>
              <div className="mt-4 text-[0.98rem]">
                <Contenido d={d} />
              </div>
            </article>
          ))}
        </div>

        <h3 className="mt-20 font-display text-2xl font-bold text-verde sm:text-3xl">
          En detalle
        </h3>
        <div className="mt-8 space-y-4">
          {extensos.map((d, i) => (
            <details
              key={d.id}
              id={d.id}
              open={i === 0}
              className="group rounded-2xl bg-white shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-6 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde">
                <span className="flex items-center gap-4">
                  <span aria-hidden="true" className="h-8 w-1.5 shrink-0 rounded-full bg-verde" />
                  <span className="font-display text-lg font-bold text-verde sm:text-xl">{d.titulo}</span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 text-grafito transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="px-6 pb-7 sm:pl-[3.25rem] lg:max-w-4xl">
                <Contenido d={d} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
