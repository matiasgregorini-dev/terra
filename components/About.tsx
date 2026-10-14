import { site } from "@/lib/site";

export default function About() {
  const { name, role, bio } = site.consultant;

  return (
    <section
      id="quienes-somos"
      aria-labelledby="quienes-somos-titulo"
      className="bg-crema py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_2fr] md:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-tierra-oscuro">
            Quiénes somos
          </p>
          <h2
            id="quienes-somos-titulo"
            className="mt-3 text-3xl font-bold tracking-tight text-verde sm:text-4xl"
          >
            {name}
          </h2>
          <p className="mt-2 text-lg font-medium text-tierra-oscuro">{role}</p>
          <div aria-hidden="true" className="mt-6 h-1 w-16 rounded-full bg-tierra" />
        </div>

        <div className="space-y-5 text-base leading-relaxed text-tinta sm:text-lg">
          {/* TODO: el texto de presentación se completa en lib/site.ts (consultant.bio). */}
          {bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
