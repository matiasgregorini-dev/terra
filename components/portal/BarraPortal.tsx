import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import { nombreVisible, requerirUsuario } from "@/lib/portal/auth";
import { salir } from "@/lib/portal/acciones/auth";
import { ROL_ETIQUETA } from "@/lib/portal/tipos";
import { site } from "@/lib/site";
import NavPortal from "./NavPortal";

export function MarcoBarra({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div aria-hidden="true" className="flex h-1">
        <div className="flex-[1] bg-oliva" />
        <div className="flex-[2] bg-gris-oliva" />
        <div className="flex-[6] bg-verde" />
        <div className="flex-[1] bg-grafito" />
      </div>
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/portal" className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde">
          <Image src="/logo.svg" alt={`${site.name}: portal`} width={203} height={109} className="h-10 w-auto" preload />
          <span className="hidden rounded-full bg-oliva/25 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-oliva-oscuro uppercase sm:inline">
            Portal
          </span>
        </Link>
        {children}
      </div>
    </header>
  );
}

/** Barra del portal: navegación según el rol, usuario y botón de salida. */
export default async function BarraPortal() {
  const usuario = await requerirUsuario();
  const enlaces = [
    { href: "/portal", texto: "Inicio" },
    { href: "/portal/establecimientos", texto: "Establecimientos" },
    { href: "/portal/novedades", texto: "Novedades" },
    ...(usuario.rol === "admin" ? [{ href: "/portal/admin/usuarios", texto: "Usuarios" }] : []),
    { href: "/portal/cuenta", texto: "Mi cuenta" },
  ];

  return (
    <MarcoBarra>
      <div className="flex items-center gap-2">
        <NavPortal enlaces={enlaces} />
        <div className="hidden text-right text-xs leading-tight lg:block">
          <p className="font-semibold text-tinta">{nombreVisible(usuario)}</p>
          <p className="text-grafito">{ROL_ETIQUETA[usuario.rol]}</p>
        </div>
        <form action={salir}>
          <button
            type="submit"
            className="min-h-11 rounded-md px-3 text-sm font-semibold text-grafito hover:text-verde focus-visible:outline-2 focus-visible:outline-verde"
          >
            Salir
          </button>
        </form>
      </div>
    </MarcoBarra>
  );
}
