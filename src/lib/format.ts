import type { EstadoGestion } from "@/types/dominio";

export type { EstadoGestion };

const ETIQUETAS_ESTADO: Record<EstadoGestion, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};

export function formatEstado(estado: EstadoGestion): string {
  return ETIQUETAS_ESTADO[estado] ?? estado;
}

export function formatFecha(fechaIso: string): string {
  return new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(fechaIso));
}

export function formatFechaHora(fechaIso: string): string {
  return new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fechaIso));
}

export function formatHora(fechaIso: string): string {
  return new Intl.DateTimeFormat("es-SV", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fechaIso));
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
