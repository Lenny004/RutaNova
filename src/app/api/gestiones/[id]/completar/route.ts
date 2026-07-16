import { EstadoGestion } from "@prisma/client";
import { withAuthId } from "@/lib/api/with-auth";
import { obtenerGestionDeRepartidor } from "@/lib/gestiones";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarGestionDetalle } from "@/lib/serializers";

/**
 * Marca una gestión en curso como completada y actualiza estadísticas.
 */
export const POST = withAuthId(async (_request, user, gestionId) => {
  const gestion = await obtenerGestionDeRepartidor(gestionId, user.id);
  if (!gestion) return jsonError("Gestión no encontrada", 404);

  if (gestion.estado !== EstadoGestion.EN_CURSO) {
    return jsonError("Solo se pueden completar gestiones en curso", 400);
  }

  const gestionCompletada = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { gestionesCompletadas: { increment: 1 } },
    });

    return tx.gestion.update({
      where: { id: gestion.id },
      data: {
        estado: EstadoGestion.COMPLETADA,
        progreso: 100,
      },
    });
  });

  return jsonOk({ gestion: serializarGestionDetalle(gestionCompletada) });
});
