import { EstadoGestion } from "@prisma/client";
import { withAuthId } from "@/lib/api/with-auth";
import {
  obtenerGestionDeRepartidor,
  puedeIniciarGestion,
  progresoAlIniciar,
} from "@/lib/gestiones";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarGestionDetalle } from "@/lib/serializers";

export const POST = withAuthId(async (_request, user, gestionId) => {
  const gestion = await obtenerGestionDeRepartidor(gestionId, user.id);
  if (!gestion) return jsonError("Gestión no encontrada", 404);

  if (!puedeIniciarGestion(gestion.estado)) {
    return jsonError("Solo se pueden iniciar gestiones pendientes", 400);
  }

  const gestionActualizada = await prisma.gestion.update({
    where: { id: gestion.id },
    data: {
      estado: EstadoGestion.EN_CURSO,
      progreso: progresoAlIniciar(gestion.progreso),
    },
  });

  return jsonOk({ gestion: serializarGestionDetalle(gestionActualizada) });
});
