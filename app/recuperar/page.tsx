import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/portal/AuthShell";
import { Campo } from "@/components/portal/Campos";
import Formulario from "@/components/portal/Formulario";
import { recuperar } from "@/lib/portal/acciones/auth";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false, follow: false },
};

export default function RecuperarPage() {
  return (
    <AuthShell titulo="Recuperar contraseña">
      <p className="mb-5 text-grafito">
        Ingresá el email de tu cuenta y te enviamos un enlace para definir una contraseña nueva.
      </p>
      <Formulario accion={recuperar} boton="Enviar enlace" enviando="Enviando…" className="[&>button]:w-full">
        <Campo etiqueta="Email" name="email" type="email" autoComplete="email" required autoFocus />
      </Formulario>
      <p className="mt-5 text-center text-sm">
        <Link href="/ingresar" className="font-semibold text-verde underline-offset-2 hover:underline">
          Volver a ingresar
        </Link>
      </p>
    </AuthShell>
  );
}
