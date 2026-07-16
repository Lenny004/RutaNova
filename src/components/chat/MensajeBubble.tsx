import type { Mensaje } from "@/lib/api-client";
import { formatHora } from "@/lib/format";

type MensajeBubbleProps = {
  mensaje: Mensaje;
};

export function MensajeBubble({ mensaje }: MensajeBubbleProps) {
  return (
    <div
      className={`flex animate-fade-in-subtle ${mensaje.esMio ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-2.5 text-sm
          ${mensaje.esMio
            ? "rounded-br-md bg-accent-blue text-white"
            : "rounded-bl-md bg-white/10 text-text-cream"
          }
        `}
      >
        {!mensaje.esMio && (
          <p className="mb-0.5 text-[10px] font-semibold text-accent-amber">
            {mensaje.autorNombre}
          </p>
        )}
        <p className="leading-relaxed">{mensaje.contenido}</p>
        <p
          className={`mt-1 text-[10px] ${mensaje.esMio ? "text-blue-200" : "text-text-muted"}`}
        >
          {formatHora(mensaje.enviadoEn)}
        </p>
      </div>
    </div>
  );
}
