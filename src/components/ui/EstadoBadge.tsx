import type { EstadoGestion } from "@/lib/format";
import { formatEstado } from "@/lib/format";

const estadoStyles: Record<EstadoGestion, string> = {
  PENDIENTE: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  CANCELADA: "bg-red-500/15 text-red-300 border-red-500/30",
  EN_CURSO: "bg-accent-blue/15 text-blue-300 border-accent-blue/30",
  COMPLETADA: "bg-accent-green/15 text-green-300 border-accent-green/30",
};

type EstadoBadgeProps = {
  estado: EstadoGestion;
  className?: string;
};

export function EstadoBadge({ estado, className = "" }: EstadoBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2.5 py-0.5
        text-xs font-semibold tracking-wide
        ${estadoStyles[estado]}
        ${className}
      `}
    >
      {formatEstado(estado)}
    </span>
  );
}
