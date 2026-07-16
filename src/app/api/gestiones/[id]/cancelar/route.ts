import { EstadoGestion } from "@prisma/client";
import { withAuthId } from "@/lib/api/with-auth";
import {
  debeIncrementarCancelaciones,
  obtenerGestionDeRepartidor,
  puedeCancelarGestion,
} from "@/lib/gestiones";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarGestionDetalle } from "@/lib/serializers";

export const POST = withAuthId(async (_request, user, gestionId) => {
  const gestion = await obtenerGestionDeRepartidor(gestionId, user.id);
  if (!gestion) return jsonError("Gestión no encontrada", 404);

  if (!puedeCancelarGestion(gestion.estado)) {
    return jsonError("La gestión no puede cancelarse en su estado actual", 400);
  }

  const incrementarContador = debeIncrementarCancelaciones(gestion.estado);

  const gestionActualizada = await prisma.$transaction(async (tx) => {
    if (incrementarContador) {
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

  return jsonOk({ gestion: serializarGestionDetalle(gestionActualizada) });
});
