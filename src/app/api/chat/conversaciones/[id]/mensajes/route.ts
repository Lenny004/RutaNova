import { withAuthId } from "@/lib/api/with-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarMensaje } from "@/lib/serializers";
import { crearMensajeSchema } from "@/lib/validations/chat";
import { parseBody } from "@/lib/validations/common";

async function obtenerParticipacion(
  conversacionId: string,
  userId: string,
) {
  return prisma.participante.findFirst({
    where: { conversacionId, userId },
  });
}

export const GET = withAuthId(async (_request, user, conversacionId) => {
  const participacion = await obtenerParticipacion(conversacionId, user.id);
  if (!participacion) return jsonError("Conversación no encontrada", 404);

  const mensajes = await prisma.mensaje.findMany({
    where: { conversacionId },
    orderBy: { enviadoEn: "asc" },
  });

  return jsonOk({
    mensajes: mensajes.map((mensaje) => serializarMensaje(mensaje, user.id)),
  });
});

export const POST = withAuthId(async (request, user, conversacionId) => {
  const participacion = await obtenerParticipacion(conversacionId, user.id);
  if (!participacion) return jsonError("Conversación no encontrada", 404);

  const parseado = await parseBody(request, crearMensajeSchema);
  if (parseado.error) return parseado.error;

  const { contenido } = parseado.data;

  const mensajeCreado = await prisma.$transaction(async (tx) => {
    const mensaje = await tx.mensaje.create({
      data: {
        conversacionId,
        autorId: user.id,
        autorNombre: user.nombre,
        contenido,
      },
    });

    await tx.conversacion.update({
      where: { id: conversacionId },
      data: { actualizadoEn: new Date() },
    });

    return mensaje;
  });

  return jsonOk({ mensaje: serializarMensaje(mensajeCreado, user.id) });
});
