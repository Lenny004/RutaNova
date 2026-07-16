import { withAuthId } from "@/lib/api/with-auth";
import { obtenerGestionDeRepartidor } from "@/lib/gestiones";
import { jsonError, jsonOk } from "@/lib/http";
import { serializarGestionDetalle } from "@/lib/serializers";

export const GET = withAuthId(async (_request, user, gestionId) => {
  const gestion = await obtenerGestionDeRepartidor(gestionId, user.id);
  if (!gestion) return jsonError("Gestión no encontrada", 404);
  return jsonOk({ gestion: serializarGestionDetalle(gestion) });
});
