"use client";

import { useRef, useState, type FormEvent } from "react";
import { registrarDocumento } from "@/lib/portal/acciones/contenido";
import {
  ARCHIVO_EXTENSIONES,
  ARCHIVO_MAX_BYTES,
  ARCHIVO_TIPOS,
  CATEGORIAS,
  CATEGORIA_ETIQUETA,
  type EstadoForm,
  type Lote,
} from "@/lib/portal/tipos";
import { createClient } from "@/lib/supabase/client";
import { Campo, Casilla, Selector } from "./Campos";
import { Resultado, claseBoton } from "./Formulario";

/**
 * Carga de un documento en dos pasos:
 * 1. el navegador sube el archivo directo a Supabase Storage (sin el límite de
 *    tamaño de las funciones del servidor); la política del bucket solo lo
 *    permite a admin o técnico asignado al establecimiento;
 * 2. la Server Action registra la ficha, verificando tipo y tamaño reales.
 */
export default function SubirDocumento({
  establecimientoId,
  lotes,
}: {
  establecimientoId: string;
  lotes: Pick<Lote, "id" | "nombre">[];
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [estado, setEstado] = useState<EstadoForm>(null);
  const [enviando, setEnviando] = useState<"" | "subiendo" | "registrando">("");

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const archivo = fd.get("archivo");
    if (!(archivo instanceof File) || archivo.size === 0) {
      setEstado({ error: "Elegí un archivo." });
      return;
    }
    if (archivo.size > ARCHIVO_MAX_BYTES) {
      setEstado({ error: "El archivo supera los 25 MB." });
      return;
    }
    const tipo = archivo.type || tipoPorExtension(archivo.name);
    if (!(ARCHIVO_TIPOS as readonly string[]).includes(tipo)) {
      setEstado({ error: "Tipo de archivo no admitido. Usá PDF, imagen, Excel, Word, CSV, ZIP o KMZ/KML." });
      return;
    }

    setEstado(null);
    setEnviando("subiendo");
    try {
      const extension = (archivo.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "bin";
      const path = `${establecimientoId}/${crypto.randomUUID()}.${extension}`;
      const { error } = await createClient()
        .storage.from("documentos")
        .upload(path, archivo, { contentType: tipo, upsert: false });
      if (error) {
        setEstado({ error: "No se pudo subir el archivo. Revisá tu conexión y que tengas permiso de carga." });
        return;
      }

      setEnviando("registrando");
      fd.delete("archivo");
      fd.set("archivo_path", path);
      fd.set("archivo_nombre", archivo.name.slice(0, 255));
      const res = await registrarDocumento(null, fd);
      setEstado(res);
      if (res?.ok) form.reset();
    } catch {
      setEstado({ error: "Se cortó la conexión. Volvé a intentarlo." });
    } finally {
      setEnviando("");
    }
  }

  return (
    <form ref={ref} onSubmit={enviar} className="space-y-4">
      <input type="hidden" name="establecimiento_id" value={establecimientoId} />
      <Campo
        etiqueta="Archivo"
        name="archivo"
        type="file"
        accept={ARCHIVO_EXTENSIONES}
        required
        ayuda="PDF, imagen, Excel, Word, CSV, ZIP o KMZ/KML. Hasta 25 MB."
        className="mt-1.5 block w-full text-sm text-tinta file:mr-3 file:rounded-lg file:border-0 file:bg-verde/10 file:px-3 file:py-2 file:font-semibold file:text-verde"
      />
      <Campo etiqueta="Título" name="titulo" required maxLength={160} placeholder="Ej.: Recomendación de fertilización maíz" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Selector
          etiqueta="Categoría"
          name="categoria"
          defaultValue="informe"
          opciones={CATEGORIAS.map((c) => ({ valor: c, texto: CATEGORIA_ETIQUETA[c] }))}
        />
        <Campo etiqueta="Campaña" name="campana" maxLength={20} placeholder="2026/27" />
        <Selector
          etiqueta="Lote (opcional)"
          name="lote_id"
          defaultValue=""
          opciones={[{ valor: "", texto: "Todo el establecimiento" }, ...lotes.map((l) => ({ valor: l.id, texto: l.nombre }))]}
        />
      </div>
      <Casilla
        etiqueta="Visible para el personal del establecimiento"
        name="visible_personal"
        ayuda="Dejalo sin marcar para información reservada al productor (costos, márgenes, etc.)."
      />
      <Resultado estado={estado} />
      <button type="submit" disabled={enviando !== ""} className={claseBoton()}>
        {enviando === "subiendo" ? "Subiendo archivo…" : enviando === "registrando" ? "Registrando…" : "Cargar documento"}
      </button>
    </form>
  );
}

/** Algunos navegadores no informan el tipo de .kmz/.kml/.csv. */
function tipoPorExtension(nombre: string): string {
  const ext = nombre.split(".").pop()?.toLowerCase();
  const tipos: Record<string, string> = {
    kmz: "application/vnd.google-earth.kmz",
    kml: "application/vnd.google-earth.kml+xml",
    csv: "text/csv",
    pdf: "application/pdf",
  };
  return (ext && tipos[ext]) || "";
}
