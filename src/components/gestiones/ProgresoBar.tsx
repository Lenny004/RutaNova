import { formatProgreso } from "@/lib/format";

type ProgresoBarProps = {
  progreso: number;
  className?: string;
  mostrarEtiqueta?: boolean;
};

/** Barra de progreso reutilizable para listado y detalle de gestiones. */
export function ProgresoBar({
  progreso,
  className = "",
  mostrarEtiqueta = true,
}: ProgresoBarProps) {
  const valor = Math.max(0, Math.min(100, Math.round(progreso)));

  return (
    <div className={`space-y-1 ${className}`}>
      {mostrarEtiqueta && (
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Progreso</span>
          <span className="font-medium text-text-cream/80">
            {formatProgreso(valor)}
          </span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-accent-amber transition-all duration-500"
          style={{ width: `${valor}%` }}
          role="progressbar"
          aria-valuenow={valor}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
