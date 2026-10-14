import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/portal/AuthShell";
import FormIngresar from "@/components/portal/FormIngresar";

export const metadata: Metadata = {
  title: "Ingresar al portal",
  robots: { index: false, follow: false },
};

export default function IngresarPage() {
  return (
    <AuthShell titulo="Ingresar al portal">
      {/* El formulario lee la URL (?siguiente=), que solo se conoce al pedir la página. */}
      <Suspense fallback={<p className="text-grafito">Cargando…</p>}>
        <FormIngresar />
      </Suspense>
    </AuthShell>
  );
}
