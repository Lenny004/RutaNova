import { withAuth } from "@/lib/api/with-auth";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarUsuario } from "@/lib/serializers";

export const GET = withAuth(async (_request, user) => {
  const usuarioBd = await prisma.user.findUnique({ where: { id: user.id } });
  if (!usuarioBd) return jsonError("Usuario no encontrado", 404);
  return jsonOk({ user: serializarUsuario(usuarioBd) });
});
