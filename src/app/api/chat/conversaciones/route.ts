import { withAuth } from "@/lib/api/with-auth";
import { filtrarConversacionPorRol } from "@/lib/chat/acceso";
import { jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarConversacion } from "@/lib/serializers";
import { conversacionesQuerySchema } from "@/lib/validations/chat";
import { parseQuery } from "@/lib/validations/common";

export const GET = withAuth(async (request, user) => {
  const parseado = parseQuery(
    request.nextUrl.searchParams,
    conversacionesQuerySchema,
  );
  if (parseado.error) return parseado.error;

  const { filtro } = parseado.data;

  const conversaciones = await prisma.conversacion.findMany({
    where: {
      participantes: {
        some: { userId: user.id },
      },
    },
    include: {
      participantes: true,
      mensajes: {
        orderBy: { enviadoEn: "desc" },
        take: 1,
      },
    },
    orderBy: { actualizadoEn: "desc" },
  });

  const conversacionesFiltradas = conversaciones
    .filter((conversacion) =>
      filtrarConversacionPorRol(conversacion, user.id, filtro),
    )
    .map((conversacion) => serializarConversacion(conversacion, user.id))
    .filter(
      (conversacion): conversacion is NonNullable<typeof conversacion> =>
        conversacion !== null,
    );

  return jsonOk({ conversaciones: conversacionesFiltradas });
});
