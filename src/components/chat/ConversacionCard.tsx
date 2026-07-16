import Link from "next/link";
import type { Conversacion } from "@/lib/api-client";
import { formatFechaHora } from "@/lib/format";
import { MessageCircle, User } from "lucide-react";

type ConversacionCardProps = {
  conversacion: Conversacion;
};

export function ConversacionCard({ conversacion }: ConversacionCardProps) {
  const rolLabel =
    conversacion.rolContacto === "MANAGER" ? "Manager" : "Consumidor";

  return (
    <Link
      href={`/chats/${conversacion.id}`}
      className="module-card flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 animate-fade-in"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-blue/15 text-accent-blue">
        {conversacion.contactoFotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={conversacion.contactoFotoUrl}
            alt=""
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-semibold text-text-cream">
            {conversacion.contactoNombre}
          </h3>
          <span className="shrink-0 text-[10px] uppercase tracking-wider text-accent-blue">
            {rolLabel}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm text-text-muted">
          {conversacion.ultimoMensaje ?? "Sin mensajes aún"}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <MessageCircle className="h-4 w-4 text-text-muted" />
        <span className="text-[10px] text-text-muted">
          {formatFechaHora(conversacion.actualizadoEn)}
        </span>
      </div>
    </Link>
  );
}
