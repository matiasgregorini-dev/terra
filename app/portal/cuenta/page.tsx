import type { Metadata } from "next";
import { Campo } from "@/components/portal/Campos";
import Formulario from "@/components/portal/Formulario";
import Tarjeta, { EncabezadoPagina } from "@/components/portal/Tarjeta";
import { cambiarContrasena, cambiarNombre } from "@/lib/portal/acciones/auth";
import { requerirUsuario } from "@/lib/portal/auth";
import { ROL_DESCRIPCION, ROL_ETIQUETA } from "@/lib/portal/tipos";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function CuentaPage({ searchParams }: PageProps<"/portal/cuenta">) {
  const usuario = await requerirUsuario();
  const { bienvenida } = await searchParams;

  return (
    <>
      <EncabezadoPagina antetitulo="Mi cuenta" titulo={usuario.email}>
        {ROL_ETIQUETA[usuario.rol]}. {ROL_DESCRIPCION[usuario.rol]}
      </EncabezadoPagina>

      {bienvenida !== undefined && (
        <p role="status" className="mb-6 rounded-xl border border-oliva bg-oliva/15 px-4 py-3 text-tinta">
          <strong>Te damos la bienvenida al portal.</strong> Definí tu contraseña para poder volver a ingresar.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta id="contrasena" titulo="Contraseña">
          <Formulario accion={cambiarContrasena} boton="Guardar contraseña" limpiarAlGuardar>
            <Campo
              etiqueta="Contraseña nueva"
              name="contrasena"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              ayuda="Al menos 8 caracteres."
            />
            <Campo etiqueta="Repetir contraseña" name="repetir" type="password" autoComplete="new-password" required />
          </Formulario>
        </Tarjeta>
        <Tarjeta id="datos" titulo="Mis datos" className="self-start">
          <Formulario accion={cambiarNombre} boton="Guardar nombre">
            <Campo etiqueta="Nombre y apellido" name="nombre" defaultValue={usuario.nombre} required maxLength={120} autoComplete="name" />
          </Formulario>
        </Tarjeta>
      </div>
    </>
  );
}
