import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Campo, Casilla, Selector } from "@/components/portal/Campos";
import Formulario from "@/components/portal/Formulario";
import SelectorEstablecimientos from "@/components/portal/SelectorEstablecimientos";
import Tarjeta, { EncabezadoPagina } from "@/components/portal/Tarjeta";
import { actualizarUsuario, enviarEnlaceAcceso, guardarAccesos } from "@/lib/portal/acciones/admin";
import { nombreVisible, requerirUsuario } from "@/lib/portal/auth";
import { listarEstablecimientos, listarMiembros, obtenerPerfil } from "@/lib/portal/datos";
import { formatoFecha } from "@/lib/portal/formato";
import { ROLES, ROL_ETIQUETA } from "@/lib/portal/tipos";

export const metadata: Metadata = { title: "Usuario" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function UsuarioPage({ params }: PageProps<"/portal/admin/usuarios/[id]">) {
  const yo = await requerirUsuario("admin");
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const [perfil, establecimientos, miembros] = await Promise.all([
    obtenerPerfil(id),
    listarEstablecimientos(),
    listarMiembros({ perfilId: id }),
  ]);
  if (!perfil) notFound();
  const soyYo = perfil.id === yo.id;

  return (
    <>
      <p className="mb-4 text-sm">
        <Link href="/portal/admin/usuarios" className="font-semibold text-verde hover:underline">
          ← Usuarios
        </Link>
      </p>
      <EncabezadoPagina antetitulo={ROL_ETIQUETA[perfil.rol]} titulo={nombreVisible(perfil)}>
        {perfil.email} · Alta: {formatoFecha(perfil.creado_en)}
        {!perfil.activo && <strong className="ml-2 text-red-800">Cuenta desactivada</strong>}
      </EncabezadoPagina>

      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta id="datos" titulo="Rol y estado">
          <Formulario accion={actualizarUsuario} boton="Guardar cambios">
            <input type="hidden" name="id" value={perfil.id} />
            <Campo etiqueta="Nombre y apellido" name="nombre" maxLength={120} defaultValue={perfil.nombre} />
            <Selector
              etiqueta="Rol"
              name="rol"
              defaultValue={perfil.rol}
              disabled={soyYo}
              opciones={ROLES.map((r) => ({ valor: r, texto: ROL_ETIQUETA[r] }))}
              ayuda={soyYo ? "No podés cambiar tu propio rol." : undefined}
            />
            {soyYo && <input type="hidden" name="rol" value={perfil.rol} />}
            {soyYo ? (
              <input type="hidden" name="activo" value="on" />
            ) : (
              <Casilla
                etiqueta="Cuenta activa"
                name="activo"
                defaultChecked={perfil.activo}
                ayuda="Al desactivarla, la persona no puede ingresar ni ver datos. Se puede reactivar."
              />
            )}
          </Formulario>
        </Tarjeta>

        <Tarjeta id="accesos" titulo="Acceso a establecimientos">
          {perfil.rol === "admin" ? (
            <p className="text-grafito">Los administradores acceden a todos los establecimientos.</p>
          ) : (
            <Formulario accion={guardarAccesos} boton="Guardar accesos">
              <input type="hidden" name="perfil_id" value={perfil.id} />
              <SelectorEstablecimientos
                establecimientos={establecimientos}
                elegidos={miembros.map((m) => m.establecimiento_id)}
              />
            </Formulario>
          )}
        </Tarjeta>

        {!soyYo && (
          <Tarjeta id="enlace" titulo="Enlace de acceso" className="lg:col-span-2">
            <p className="mb-4 text-grafito">
              Si la persona no recibió la invitación o se olvidó la contraseña, enviale un enlace nuevo por
              email para que defina su contraseña.
            </p>
            <Formulario accion={enviarEnlaceAcceso} boton="Enviar enlace por email" enviando="Enviando…" variante="secundario">
              <input type="hidden" name="id" value={perfil.id} />
            </Formulario>
          </Tarjeta>
        )}
      </div>
    </>
  );
}
