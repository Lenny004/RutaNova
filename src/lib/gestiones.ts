import type { EstadoGestion } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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

export function debeIncrementarCancelaciones(estado: EstadoGestion): boolean {
  return estado === "PENDIENTE" || estado === "EN_CURSO";
}

export const PROGRESO_MINIMO_INICIO = 40;
