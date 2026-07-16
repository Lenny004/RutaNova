import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarUsuario } from "@/lib/serializers";

export async function GET(request: NextRequest) {
  const { user, error } = await requireUser(request);
  if (!user) return jsonError(error ?? "No autenticado", 401);

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return jsonError("Usuario no encontrado", 404);

  return jsonOk({ user: serializarUsuario(dbUser) });
}
