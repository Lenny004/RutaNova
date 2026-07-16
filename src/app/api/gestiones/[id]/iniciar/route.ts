import { EstadoGestion } from "@prisma/client";
import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { obtenerGestionDeRepartidor } from "@/lib/gestiones";
import {
  puedeIniciar,
  progresoAlIniciar,
} from "@/lib/gestiones-rules";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarGestionDetalle } from "@/lib/serializers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { user, error } = await requireUser(request);
  if (!user) return jsonError(error ?? "No autenticado", 401);

  const { id } = await context.params;
  const gestion = await obtenerGestionDeRepartidor(id, user.id);

  if (!gestion) return jsonError("Gestión no encontrada", 404);

  if (!puedeIniciar(gestion.estado)) {
    return jsonError("Solo se pueden iniciar gestiones pendientes", 400);
  }

  const actualizada = await prisma.gestion.update({
    where: { id: gestion.id },
    data: {
      estado: EstadoGestion.EN_CURSO,
      progreso: progresoAlIniciar(gestion.progreso),
    },
  });

  return jsonOk({ gestion: serializarGestionDetalle(actualizada) });
}
