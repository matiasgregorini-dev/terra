import { cacheLife } from "next/cache";
import Image from "next/image";
import { site, whatsappHref } from "@/lib/site";
import Stripes from "./Stripes";
import WhatsAppIcon from "./WhatsAppIcon";

// El año se prerenderiza y se revalida a diario, así el © se actualiza solo.
async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

function formatWhatsapp(digits: string): string {
  const d = digits.replace(/\D/g, "");
  // 54 9 2392 546068 → +54 9 2392 54-6068
  const m = d.match(/^(54)(9)(\d{4})(\d{2})(\d{4})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]}-${m[5]}` : `+${d}`;
}

const linkClass =
  "underline decoration-oliva/70 underline-offset-4 hover:decoration-oliva focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oliva";

export default async function Footer() {
  const { email, whatsapp, telefonoVisible, telefonoE164, area } = site.contact;
  const wa = whatsappHref();
  const year = await currentYear();

  return (
    <footer id="contacto" className="mt-auto bg-verde-oscuro text-marfil">
      <section aria-labelledby="contacto-titulo" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold tracking-widest text-oliva uppercase">Contacto</p>
            <h2 id="contacto-titulo" className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Hablemos de su proyecto
            </h2>
            <div className="mt-8 inline-block rounded-2xl bg-marfil px-6 py-5">
              <Image src="/lema.svg" alt={site.lema} width={188} height={26} className="h-auto w-64" />
            </div>
            {wa && (
              <p className="mt-8">
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-3 rounded-full bg-oliva px-7 text-base font-semibold text-tinta transition hover:bg-[#d3cf86] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oliva"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Escribinos por WhatsApp
                  <span className="sr-only">(se abre en una nueva pestaña)</span>
                </a>
              </p>
            )}
          </div>

          <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold tracking-wider text-oliva uppercase">Correo electrónico</dt>
              <dd className="mt-1.5 text-lg">
                <a href={`mailto:${email}`} className={`break-all ${linkClass}`}>
                  {email}
                </a>
              </dd>
            </div>

            {wa && (
              <div>
                <dt className="text-sm font-semibold tracking-wider text-oliva uppercase">WhatsApp</dt>
                <dd className="mt-1.5 text-lg">
                  <a href={wa} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {formatWhatsapp(whatsapp)}
                    <span className="sr-only">(se abre en una nueva pestaña)</span>
                  </a>
                </dd>
              </div>
            )}

            {telefonoE164 && (
              <div>
                <dt className="text-sm font-semibold tracking-wider text-oliva uppercase">Teléfono</dt>
                <dd className="mt-1.5 text-lg">
                  <a href={`tel:${telefonoE164}`} className={linkClass}>
                    {telefonoVisible}
                  </a>
                </dd>
              </div>
            )}

            {area && (
              <div>
                <dt className="text-sm font-semibold tracking-wider text-oliva uppercase">Zona de trabajo</dt>
                <dd className="mt-1.5 text-lg">{area}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <div className="border-t border-marfil/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-marfil/85 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <p>{site.areas.join(" · ")}</p>
        </div>
      </div>
      <Stripes className="h-2 w-full" />
    </footer>
  );
}
