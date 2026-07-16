import { withAuth } from "@/lib/api/with-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarUsuario } from "@/lib/serializers";
import { parseBody } from "@/lib/validations/common";
import { actualizarPerfilSchema } from "@/lib/validations/perfil";

export const GET = withAuth(async (_request, user) => {
  // requireUser ya resolvió sesión; reconsultamos para campos frescos de BD.
  const usuarioBd = await prisma.user.findUnique({ where: { id: user.id } });
  if (!usuarioBd) return jsonError("Usuario no encontrado", 404);
  return jsonOk({ user: serializarUsuario(usuarioBd) });
});

export const PATCH = withAuth(async (request, user) => {
  const parseado = await parseBody(request, actualizarPerfilSchema);
  if (parseado.error) return parseado.error;

  const { nombre, telefono, fotoUrl } = parseado.data;

  const usuarioActualizado = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(nombre !== undefined ? { nombre } : {}),
      ...(telefono !== undefined ? { telefono } : {}),
      ...(fotoUrl !== undefined ? { fotoUrl } : {}),
    },
  });

  return jsonOk({ user: serializarUsuario(usuarioActualizado) });
});
