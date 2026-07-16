import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializarUsuario } from "@/lib/serializers";
import { actualizarPerfilSchema } from "@/lib/validations/perfil";
import { parseBody } from "@/lib/validations/common";

export async function GET(request: NextRequest) {
  const { user, error } = await requireUser(request);
  if (!user) return jsonError(error ?? "No autenticado", 401);

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return jsonError("Usuario no encontrado", 404);

  return jsonOk({ user: serializarUsuario(dbUser) });
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireUser(request);
  if (!user) return jsonError(error ?? "No autenticado", 401);

  const parsed = await parseBody(request, actualizarPerfilSchema);
  if (parsed.error) return parsed.error;

  const { nombre, telefono, fotoUrl } = parsed.data;

  const actualizado = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(nombre !== undefined ? { nombre } : {}),
      ...(telefono !== undefined ? { telefono } : {}),
      ...(fotoUrl !== undefined ? { fotoUrl } : {}),
    },
  });

  return jsonOk({ user: serializarUsuario(actualizado) });
}
