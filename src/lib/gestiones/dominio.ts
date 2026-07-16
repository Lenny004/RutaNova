/**
 * Dominio de gestiones: consultas, reglas de estado y utilidades QR.
 */
import type { EstadoGestion } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Progreso mínimo al pasar una gestión a EN_CURSO. */
export const PROGRESO_MINIMO_INICIO = 40;

export async function obtenerGestionDeRepartidor(
  gestionId: string,
  repartidorId: string,
) {
  return prisma.gestion.findFirst({
    where: { id: gestionId, repartidorId },
  });
}

export function construirPayloadQr(gestionId: string, codigo: string): string {
  return `${gestionId}:${codigo}`;
}

/** Solo gestiones pendientes pueden iniciarse. */
export function puedeIniciarGestion(estado: EstadoGestion): boolean {
  return estado === "PENDIENTE";
}

/** Gestiones activas (pendiente o en curso) pueden cancelarse. */
export function puedeCancelarGestion(estado: EstadoGestion): boolean {
  return estado === "PENDIENTE" || estado === "EN_CURSO";
}

/** Indica si la cancelación debe sumar al contador del repartidor. */
export function debeIncrementarCancelaciones(estado: EstadoGestion): boolean {
  return puedeCancelarGestion(estado);
}

/**
 * En la UI, "Continuar" aplica a EN_CURSO; "Comenzar" a PENDIENTE.
 * No confundir con puedeIniciarGestion (solo servidor / transición).
 */
export function puedeAbrirEnvioEnCurso(estado: EstadoGestion | string): boolean {
  return estado === "PENDIENTE" || estado === "EN_CURSO";
}

export function progresoAlIniciar(progresoActual: number): number {
  return Math.max(progresoActual, PROGRESO_MINIMO_INICIO);
}

/** Compatibilidad con imports previos de gestiones-rules. */
export const puedeIniciar = puedeIniciarGestion;
export const puedeCancelar = puedeCancelarGestion;
