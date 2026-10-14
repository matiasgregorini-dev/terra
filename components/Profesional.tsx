import { site } from "@/lib/site";
import SectionTitle from "./SectionTitle";

export default function Profesional() {
  const p = site.profesional;

  return (
    <section id="profesional" aria-labelledby="profesional-titulo" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle id="profesional-titulo" eyebrow="Quién te asesora">
          {p.titulo} {p.nombre}
        </SectionTitle>

        <div className="mt-12 grid gap-12 md:ml-20 lg:ml-28 lg:grid-cols-[1fr_2fr]">
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-oliva-oscuro uppercase">
              Formación
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-tinta">{p.formacion}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-widest text-oliva-oscuro uppercase">
              Experiencia laboral
            </h3>
            <ol className="mt-5 border-l-2 border-oliva">
              {p.trayectoria.map((t) => (
                <li key={t.periodo + t.texto.slice(0, 20)} className="relative pb-8 pl-7 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 -left-[0.4375rem] h-3 w-3 rounded-full border-2 border-white bg-verde"
                  />
                  <p className="font-display text-lg font-bold text-verde">{t.periodo}</p>
                  <p className="mt-1 leading-relaxed text-tinta">{t.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
