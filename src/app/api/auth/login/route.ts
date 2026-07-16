import { NextRequest } from "next/server";
import { setAuthCookie, signToken } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { serializarUsuario } from "@/lib/serializers";
import { loginSchema } from "@/lib/validations/auth";
import { parseBody } from "@/lib/validations/common";

export async function POST(request: NextRequest) {
  const parsed = await parseBody(request, loginSchema);
  if (parsed.error) return parsed.error;

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return jsonError("Credenciales inválidas", 401);
  }

  const token = await signToken(user.id);
  await setAuthCookie(token);

  return jsonOk({
    user: serializarUsuario(user),
    token,
  });
}
