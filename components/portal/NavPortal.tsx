"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Enlace = { href: string; texto: string };

/** Navegación del portal; marca la sección actual. */
export default function NavPortal({ enlaces }: { enlaces: Enlace[] }) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const activo = (href: string) =>
    href === "/portal" ? pathname === "/portal" : pathname === href || pathname.startsWith(`${href}/`);

  const lista = (movil: boolean) =>
    enlaces.map((e) => (
      <li key={e.href}>
        <Link
          href={e.href}
          onClick={() => setAbierto(false)}
          aria-current={activo(e.href) ? "page" : undefined}
          className={`block rounded-md px-3 py-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-verde ${
            activo(e.href) ? "bg-verde/10 text-verde" : "text-tinta hover:text-verde"
          } ${movil ? "py-3 text-base" : "text-[0.95rem]"}`}
        >
          {e.texto}
        </Link>
      </li>
    ));

  return (
    <>
      <nav aria-label="Secciones del portal" className="hidden md:block">
        <ul className="flex items-center gap-1">{lista(false)}</ul>
      </nav>
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-verde focus-visible:outline-2 focus-visible:outline-verde md:hidden"
        aria-expanded={abierto}
        aria-controls="menu-portal"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setAbierto((v) => !v)}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <nav
        id="menu-portal"
        aria-label="Secciones del portal"
        className={`absolute inset-x-0 top-full border-t border-verde/10 bg-white shadow-md md:hidden ${abierto ? "block" : "hidden"}`}
      >
        <ul className="mx-auto max-w-6xl px-4 py-2">{lista(true)}</ul>
      </nav>
    </>
  );
}
