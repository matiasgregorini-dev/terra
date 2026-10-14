import Image from "next/image";
import { site } from "@/lib/site";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#quienes-somos", label: "Quiénes somos" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-verde/10 bg-crema shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#inicio"
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde"
        >
          {/* TODO: reemplazar /public/logo.png por el logo definitivo (PNG cuadrado, fondo transparente). */}
          <Image
            src="/logo.png"
            alt={`Logo de ${site.name}`}
            width={40}
            height={40}
            className="h-9 w-9 sm:h-10 sm:w-10"
            preload
          />
          <span className="hidden whitespace-nowrap text-[0.95rem] min-[400px]:inline font-semibold tracking-tight text-verde sm:text-lg">
            {site.name}
          </span>
        </a>
        <nav aria-label="Navegación principal">
          <ul className="flex items-center gap-0.5 text-sm font-medium whitespace-nowrap sm:gap-2">
            {links.map((link) => (
              <li key={link.href} className={link.href === "#inicio" ? "hidden sm:block" : undefined}>
                <a
                  href={link.href}
                  className="rounded-md px-2 py-2 text-tinta transition-colors hover:text-verde focus-visible:outline-2 focus-visible:outline-verde sm:px-3"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
