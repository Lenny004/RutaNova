import { EstadoGestion } from "@prisma/client";
import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import {
  debeIncrementarCancelaciones,
  obtenerGestionDeRepartidor,
} from "@/lib/gestiones";
import { puedeCancelar } from "@/lib/gestiones-rules";
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

  if (!puedeCancelar(gestion.estado)) {
    return jsonError("La gestión no puede cancelarse en su estado actual", 400);
  }

  const incrementar = debeIncrementarCancelaciones(gestion.estado);

  const actualizada = await prisma.$transaction(async (tx) => {
    if (incrementar) {
      await tx.user.update({
        where: { id: user.id },
        data: { gestionesCanceladas: { increment: 1 } },
      });
    }

    return tx.gestion.update({
      where: { id: gestion.id },
      data: { estado: EstadoGestion.CANCELADA },
    });
  });

  return jsonOk({ gestion: serializarGestionDetalle(actualizada) });
}
