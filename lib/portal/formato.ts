const fecha = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "America/Argentina/Buenos_Aires",
});
const ha = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export function formatoFecha(iso: string): string {
  return fecha.format(new Date(iso));
}

export function formatoHa(valor: number | null): string {
  return valor == null ? "—" : `${ha.format(valor)} ha`;
}

export function formatoBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("es-AR", { maximumFractionDigits: 1 })} MB`;
}
