import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { obtenerGestionDeRepartidor } from "@/lib/gestiones";
import { jsonError, jsonOk } from "@/lib/http";
import { serializarGestionDetalle } from "@/lib/serializers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { user, error } = await requireUser(request);
  if (!user) return jsonError(error ?? "No autenticado", 401);

  const { id } = await context.params;
  const gestion = await obtenerGestionDeRepartidor(id, user.id);

  if (!gestion) return jsonError("Gestión no encontrada", 404);

  return jsonOk({ gestion: serializarGestionDetalle(gestion) });
}
