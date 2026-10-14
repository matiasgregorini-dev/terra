import type { Metadata } from "next";
import { Suspense } from "react";
import BarraPortal, { MarcoBarra } from "@/components/portal/BarraPortal";

export const metadata: Metadata = {
  title: { default: "Portal", template: "%s | Portal Terra" },
  robots: { index: false, follow: false },
};

function Cargando() {
  return (
    <div role="status" className="animate-pulse space-y-4 motion-reduce:animate-none">
      <div className="h-4 w-32 rounded bg-oliva/30" />
      <div className="h-9 w-72 max-w-full rounded bg-verde/15" />
      <div className="h-40 rounded-2xl bg-white" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

/**
 * Todo lo del portal depende de la sesión (cookies), que solo se conoce al
 * recibir el pedido: por eso la barra y el contenido van dentro de <Suspense>
 * y el marco se muestra al instante.
 */
export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-md bg-verde px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>
      <Suspense fallback={<MarcoBarra />}>
        <BarraPortal />
      </Suspense>
      <main id="contenido" className="flex-1 bg-marfil">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <Suspense fallback={<Cargando />}>{children}</Suspense>
        </div>
      </main>
    </>
  );
}
