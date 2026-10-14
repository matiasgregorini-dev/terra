// Franjas verticales de la tapa de la carpeta de presentación (proporciones originales).
export default function Stripes({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex ${className}`}>
      <div className="w-[9.5%] bg-oliva" />
      <div className="w-[20.5%] bg-gris-oliva" />
      <div className="w-[60%] bg-verde" />
      <div className="w-[10%] bg-grafito" />
    </div>
  );
}
