import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarGestion } from "@/lib/serializers";

export async function GET(request: NextRequest) {
  const { user, error } = await requireUser(request);
  if (!user) return jsonError(error ?? "No autenticado", 401);

  const gestiones = await prisma.gestion.findMany({
    where: { repartidorId: user.id },
    orderBy: { fechaProgramada: "asc" },
  });

  return jsonOk({
    gestiones: gestiones.map(serializarGestion),
  });
}
