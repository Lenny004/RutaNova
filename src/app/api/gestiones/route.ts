import { withAuth } from "@/lib/api/with-auth";
import { jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarGestion } from "@/lib/serializers";

export const GET = withAuth(async (_request, user) => {
  const gestiones = await prisma.gestion.findMany({
    where: { repartidorId: user.id },
    orderBy: { fechaProgramada: "asc" },
  });

  return jsonOk({
    gestiones: gestiones.map(serializarGestion),
  });
});
