import { withAuthId } from "@/lib/api/with-auth";
import {
  construirPayloadQr,
  obtenerGestionDeRepartidor,
} from "@/lib/gestiones";
import { jsonError, jsonOk } from "@/lib/http";

export const GET = withAuthId(async (_request, user, gestionId) => {
  const gestion = await obtenerGestionDeRepartidor(gestionId, user.id);
  if (!gestion) return jsonError("Gestión no encontrada", 404);

  const codigo = gestion.codigoQr ?? `RN-${gestion.id.slice(0, 8)}`;
  return jsonOk({
    codigo,
    payload: construirPayloadQr(gestion.id, codigo),
  });
});
