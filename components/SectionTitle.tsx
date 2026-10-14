type Props = {
  id: string;
  eyebrow?: string;
  children: React.ReactNode;
  tone?: "verde" | "oliva";
  className?: string;
};

// Título con la pestaña de color que nace del borde, como en las páginas interiores de la carpeta.
export default function SectionTitle({
  id,
  eyebrow,
  children,
  tone = "verde",
  className = "",
}: Props) {
  return (
    <div className={`flex items-center gap-4 sm:gap-6 ${className}`}>
      <span
        aria-hidden="true"
        className={`-ml-4 h-9 w-10 shrink-0 rounded-r-sm sm:-ml-6 sm:h-11 sm:w-20 lg:w-28 ${
          tone === "verde" ? "bg-verde" : "bg-oliva"
        }`}
      />
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest text-oliva-oscuro uppercase sm:text-sm">
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className="font-display text-3xl font-bold tracking-tight text-verde sm:text-4xl"
        >
          {children}
        </h2>
      </div>
    </div>
  );
}
