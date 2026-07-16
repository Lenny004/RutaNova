import Link from "next/link";
import type { Gestion } from "@/lib/api-client";
import { formatFecha } from "@/lib/format";
import { EstadoBadge } from "@/components/ui/EstadoBadge";
import { ChevronRight, MapPin } from "lucide-react";

type GestionCardProps = {
  gestion: Gestion;
};

export function GestionCard({ gestion }: GestionCardProps) {
  return (
    <Link
      href={`/gestiones/${gestion.id}`}
      className="module-card block rounded-xl border border-white/10 bg-white/5 p-4 animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-text-cream">
              {gestion.titulo}
            </h3>
            <EstadoBadge estado={gestion.estado} />
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-text-muted">
            {gestion.descripcion}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-text-muted" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
        <span>{formatFecha(gestion.fechaProgramada)}</span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-accent-green" />
          {gestion.receptorNombre}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Progreso</span>
          <span>{Math.round(gestion.progreso)}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent-amber transition-all duration-500"
            style={{ width: `${gestion.progreso}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
