import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { supabaseConfigurado } from "@/lib/supabase/config";

/** Marco de las pantallas de acceso (ingresar, recuperar contraseña). */
export default function AuthShell({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-marfil px-4 py-12">
      <div aria-hidden="true" className="fixed inset-x-0 top-0 flex h-1">
        <div className="flex-[1] bg-oliva" />
        <div className="flex-[2] bg-gris-oliva" />
        <div className="flex-[6] bg-verde" />
        <div className="flex-[1] bg-grafito" />
      </div>
      <Link href="/" className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde">
        <Image src="/logo.svg" alt={`${site.name}: volver al sitio`} width={203} height={109} className="h-16 w-auto" preload />
      </Link>
      <div className="mt-8 w-full max-w-md rounded-2xl border-t-4 border-verde bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-bold text-verde">{titulo}</h1>
        {supabaseConfigurado() ? (
          <div className="mt-6">{children}</div>
        ) : (
          <p className="mt-6 rounded-lg border border-oliva bg-oliva/15 px-3 py-2 text-sm text-tinta">
            El portal todavía no está conectado a la base de datos. Falta cargar las
            variables de Supabase (ver README del proyecto).
          </p>
        )}
      </div>
      <p className="mt-6 text-sm text-grafito">
        ¿No tenés usuario? El acceso lo otorga {site.name}.{" "}
        <a href={`mailto:${site.contact.email}`} className="font-semibold text-verde underline-offset-2 hover:underline">
          Escribinos
        </a>
        .
      </p>
    </main>
  );
}
