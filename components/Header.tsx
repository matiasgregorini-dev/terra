"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";

const links = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#profesional", label: "Profesional" },
  { href: "#contacto", label: "Contacto" },
];

// Entrada al portal privado (productores, técnicos y personal de campo).
const portalClass =
  "inline-flex min-h-10 items-center justify-center rounded-full border-2 border-verde px-4 text-[0.95rem] font-semibold text-verde transition-colors hover:bg-verde hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-white/95 shadow-sm backdrop-blur">
      {/* Franja de marca */}
      <div aria-hidden="true" className="flex h-1">
        <div className="flex-[1] bg-oliva" />
        <div className="flex-[2] bg-gris-oliva" />
        <div className="flex-[6] bg-verde" />
        <div className="flex-[1] bg-grafito" />
      </div>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#inicio"
          className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde"
        >
          <Image
            src="/logo.svg"
            alt={site.name}
            width={203}
            height={109}
            className="h-11 w-auto"
            preload
          />
        </a>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-1 text-[0.95rem] font-medium">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-md px-3 py-2 text-tinta transition-colors hover:text-verde focus-visible:outline-2 focus-visible:outline-verde"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="ml-2">
              <Link href="/ingresar" className={portalClass}>
                Acceso clientes
              </Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-verde focus-visible:outline-2 focus-visible:outline-verde md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <nav
        id="menu-movil"
        aria-label="Navegación principal"
        className={`border-t border-verde/10 bg-white md:hidden ${open ? "block" : "hidden"}`}
      >
        <ul className="mx-auto max-w-6xl px-4 py-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-3 text-base font-medium text-tinta hover:text-verde focus-visible:outline-2 focus-visible:outline-verde"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-1 border-t border-verde/10 pt-3 pb-1">
            <Link href="/ingresar" onClick={() => setOpen(false)} className={`${portalClass} w-full`}>
              Acceso clientes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
