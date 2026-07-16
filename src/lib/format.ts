export type EstadoGestion =
  | "PENDIENTE"
  | "EN_CURSO"
  | "COMPLETADA"
  | "CANCELADA";

const ESTADO_LABELS: Record<EstadoGestion, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};

export function formatEstado(estado: EstadoGestion): string {
  return ESTADO_LABELS[estado] ?? estado;
}

export function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatFechaHora(iso: string): string {
  return new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatHora(iso: string): string {
  return new Intl.DateTimeFormat("es-SV", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatTelefono(telefono: string | null): string {
  if (!telefono) return "Sin teléfono";
  return telefono;
}

export function formatCalificacion(valor: number): string {
  return valor.toFixed(1);
}

export function formatProgreso(progreso: number): string {
  return `${Math.round(progreso)}%`;
}
