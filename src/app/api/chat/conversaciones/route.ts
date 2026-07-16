import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import {
  filtrarConversacionPorRol,
  serializarConversacion,
} from "@/lib/serializers";
import { conversacionesQuerySchema } from "@/lib/validations/chat";
import { parseQuery } from "@/lib/validations/common";

export async function GET(request: NextRequest) {
  const { user, error } = await requireUser(request);
  if (!user) return jsonError(error ?? "No autenticado", 401);

  const parsed = parseQuery(request.nextUrl.searchParams, conversacionesQuerySchema);
  if (parsed.error) return parsed.error;

  const { filtro } = parsed.data;

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

  const filtradas = conversaciones
    .filter((conversacion) =>
      filtrarConversacionPorRol(conversacion, user.id, filtro),
    )
    .map((conversacion) => serializarConversacion(conversacion, user.id))
    .filter((conversacion): conversacion is NonNullable<typeof conversacion> =>
      conversacion !== null,
    );

  return jsonOk({ conversaciones: filtradas });
}
