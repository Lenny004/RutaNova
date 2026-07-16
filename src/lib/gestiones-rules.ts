import type { EstadoGestion } from "@prisma/client";
import { PROGRESO_MINIMO_INICIO } from "@/lib/gestiones";

export function puedeIniciar(estado: EstadoGestion): boolean {
  return estado === "PENDIENTE";
}

export function puedeCancelar(estado: EstadoGestion): boolean {
  return estado === "PENDIENTE" || estado === "EN_CURSO";
}

export function progresoAlIniciar(progresoActual: number): number {
  return Math.max(progresoActual, PROGRESO_MINIMO_INICIO);
}
