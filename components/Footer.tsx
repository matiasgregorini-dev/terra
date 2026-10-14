import { cacheLife } from "next/cache";
import Image from "next/image";
import { site, whatsappHref } from "@/lib/site";
import WhatsAppIcon from "./WhatsAppIcon";

function formatWhatsapp(digits: string): string {
  return `+${digits.replace(/\D/g, "")}`;
}

// El año se prerenderiza y se revalida a diario, así el © se actualiza solo.
async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function Footer() {
  const { email, whatsapp, area } = site.contact;
  const wa = whatsappHref();
  const year = await currentYear();

  return (
    <footer id="contacto" className="mt-auto bg-verde text-crema">
      <section aria-labelledby="contacto-titulo" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={`Logo de ${site.name}`}
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <p className="text-xl font-semibold">{site.name}</p>
            </div>
            <p className="mt-4 max-w-sm text-crema/90">{site.tagline}</p>
          </div>

          <div>
            <h2 id="contacto-titulo" className="text-2xl font-bold tracking-tight">
              Contacto
            </h2>
            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-crema/80">
                  Correo electrónico
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${email}`}
                    className="break-all text-lg underline decoration-crema/40 underline-offset-4 hover:decoration-crema focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crema"
                  >
                    {email}
                  </a>
                </dd>
              </div>

              {/* TODO: se muestra al cargar contact.whatsapp en lib/site.ts */}
              {wa && (
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-crema/80">
                    WhatsApp
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg underline decoration-crema/40 underline-offset-4 hover:decoration-crema focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crema"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      {formatWhatsapp(whatsapp)}
                      <span className="sr-only">(se abre en una nueva pestaña)</span>
                    </a>
                  </dd>
                </div>
              )}

              {/* TODO: se muestra al cargar contact.area en lib/site.ts */}
              {area && (
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-crema/80">
                    Zona de trabajo
                  </dt>
                  <dd className="mt-1 text-lg">{area}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <div className="border-t border-crema/15">
        <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-crema/80 sm:px-6">
          © {year} {site.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
