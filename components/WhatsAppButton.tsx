import { whatsappHref } from "@/lib/site";
import WhatsAppIcon from "./WhatsAppIcon";

export default function WhatsAppButton() {
  const href = whatsappHref();
  // TODO: el botón aparece al cargar el número en lib/site.ts (contact.whatsapp).
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp (se abre en una nueva pestaña)"
      className="fixed right-4 bottom-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-verde text-white shadow-xl ring-2 ring-crema transition hover:scale-105 hover:bg-verde-oscuro focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-verde motion-reduce:transition-none motion-reduce:hover:scale-100 sm:right-6 sm:bottom-6 sm:h-16 sm:w-16"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
    </a>
  );
}
