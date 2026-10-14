import type { Metadata } from "next";
import Link from "next/link";
import { Campo, Selector } from "@/components/portal/Campos";
import Formulario from "@/components/portal/Formulario";
import SelectorEstablecimientos from "@/components/portal/SelectorEstablecimientos";
import Tarjeta, { EncabezadoPagina } from "@/components/portal/Tarjeta";
import { invitarUsuario } from "@/lib/portal/acciones/admin";
import { nombreVisible, requerirUsuario } from "@/lib/portal/auth";
import { listarEstablecimientos, listarMiembros, listarPerfiles } from "@/lib/portal/datos";
import { ROLES, ROL_DESCRIPCION, ROL_ETIQUETA } from "@/lib/portal/tipos";

export const metadata: Metadata = { title: "Usuarios" };

export default async function UsuariosPage() {
  await requerirUsuario("admin");
  const [perfiles, establecimientos, miembros] = await Promise.all([
    listarPerfiles(),
    listarEstablecimientos(),
    listarMiembros(),
  ]);
  const cantidad = (perfilId: string) => miembros.filter((m) => m.perfil_id === perfilId).length;

  return (
    <>
      <EncabezadoPagina antetitulo="Administración" titulo="Usuarios">
        Invitá a productores, técnicos y personal de campo. Cada persona recibe un email para definir su
        contraseña y solo ve los establecimientos que le asignes.
      </EncabezadoPagina>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Tarjeta titulo={`Usuarios (${perfiles.length})`}>
          <div className="-mx-5 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="border-b-2 border-oliva text-grafito">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">Usuario</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Rol</th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold">Establec.</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oliva/30">
                {perfiles.map((p) => (
                  <tr key={p.id}>
                    <th scope="row" className="px-3 py-2.5 font-normal">
                      <Link href={`/portal/admin/usuarios/${p.id}`} className="font-semibold text-verde hover:underline">
                        {nombreVisible(p)}
                      </Link>
                      <p className="text-grafito">{p.email}</p>
                    </th>
                    <td className="px-3 py-2.5">{ROL_ETIQUETA[p.rol]}</td>
                    <td className="px-3 py-2.5 text-right">{p.rol === "admin" ? "Todos" : cantidad(p.id)}</td>
                    <td className="px-3 py-2.5">
                      {p.activo ? (
                        <span className="text-verde">Activo</span>
                      ) : (
                        <span className="font-semibold text-red-800">Inactivo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tarjeta>

        <Tarjeta id="invitar" titulo="Invitar usuario" className="self-start">
          <Formulario accion={invitarUsuario} boton="Enviar invitación" enviando="Enviando…" limpiarAlGuardar>
            <Campo etiqueta="Nombre y apellido" name="nombre" required maxLength={120} />
            <Campo etiqueta="Email" name="email" type="email" required />
            <Selector
              etiqueta="Rol"
              name="rol"
              defaultValue="productor"
              opciones={ROLES.map((r) => ({ valor: r, texto: ROL_ETIQUETA[r] }))}
            />
            <details className="text-sm text-grafito">
              <summary className="cursor-pointer font-semibold text-verde">¿Qué puede hacer cada rol?</summary>
              <dl className="mt-2 space-y-2">
                {ROLES.map((r) => (
                  <div key={r}>
                    <dt className="font-semibold text-tinta">{ROL_ETIQUETA[r]}</dt>
                    <dd>{ROL_DESCRIPCION[r]}</dd>
                  </div>
                ))}
              </dl>
            </details>
            <SelectorEstablecimientos establecimientos={establecimientos} />
          </Formulario>
        </Tarjeta>
      </div>
    </>
  );
}
