import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarMensaje } from "@/lib/serializers";
import { crearMensajeSchema } from "@/lib/validations/chat";
import { parseBody } from "@/lib/validations/common";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function verificarParticipacion(conversacionId: string, userId: string) {
  return prisma.participante.findFirst({
    where: { conversacionId, userId },
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { user, error } = await requireUser(request);
  if (!user) return jsonError(error ?? "No autenticado", 401);

  const { id } = await context.params;
  const participacion = await verificarParticipacion(id, user.id);

  if (!participacion) return jsonError("Conversación no encontrada", 404);

  const mensajes = await prisma.mensaje.findMany({
    where: { conversacionId: id },
    orderBy: { enviadoEn: "asc" },
  });

  return jsonOk({
    mensajes: mensajes.map((mensaje) => serializarMensaje(mensaje, user.id)),
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { user, error } = await requireUser(request);
  if (!user) return jsonError(error ?? "No autenticado", 401);

  const { id } = await context.params;
  const participacion = await verificarParticipacion(id, user.id);

  if (!participacion) return jsonError("Conversación no encontrada", 404);

  const parsed = await parseBody(request, crearMensajeSchema);
  if (parsed.error) return parsed.error;

  const { contenido } = parsed.data;

  const mensaje = await prisma.$transaction(async (tx) => {
    const creado = await tx.mensaje.create({
      data: {
        conversacionId: id,
        autorId: user.id,
        autorNombre: user.nombre,
        contenido,
      },
    });

    await tx.conversacion.update({
      where: { id },
      data: { actualizadoEn: new Date() },
    });

    return creado;
  });

  return jsonOk({ mensaje: serializarMensaje(mensaje, user.id) });
}
