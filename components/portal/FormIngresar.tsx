"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ingresar } from "@/lib/portal/acciones/auth";
import { Campo } from "./Campos";
import Formulario from "./Formulario";

const MENSAJES: Record<string, string> = {
  enlace: "El enlace venció o ya fue usado. Pedí uno nuevo con “¿Olvidaste tu contraseña?”.",
  "sin-acceso": "Tu cuenta no tiene acceso al portal. Comunicate con Terra Consultora.",
};

export default function FormIngresar() {
  const params = useSearchParams();
  const aviso = MENSAJES[params.get("error") ?? params.get("motivo") ?? ""];

  return (
    <>
      {aviso && (
        <p role="alert" className="mb-4 rounded-lg border border-oliva bg-oliva/15 px-3 py-2 text-sm text-tinta">
          {aviso}
        </p>
      )}
      <Formulario accion={ingresar} boton="Ingresar" enviando="Ingresando…" className="[&>button]:w-full">
        <input type="hidden" name="siguiente" value={params.get("siguiente") ?? ""} />
        <Campo etiqueta="Email" name="email" type="email" autoComplete="email" required autoFocus />
        <Campo etiqueta="Contraseña" name="contrasena" type="password" autoComplete="current-password" required />
        <p className="text-right text-sm">
          <Link href="/recuperar" className="font-semibold text-verde underline-offset-2 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </Formulario>
    </>
  );
}
