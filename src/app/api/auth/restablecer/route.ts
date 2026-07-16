import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/http";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { restablecerSchema } from "@/lib/validations/auth";
import { parseBody } from "@/lib/validations/common";

export async function POST(request: NextRequest) {
  const parsed = await parseBody(request, restablecerSchema);
  if (parsed.error) return parsed.error;

  const { token, password } = parsed.data;

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return jsonError("Token inválido o expirado", 400);
  }

  const esMismaContrasena = await verifyPassword(
    password,
    resetToken.user.passwordHash,
  );
  if (esMismaContrasena) {
    return jsonError(
      "La nueva contraseña debe ser distinta a la actual",
      422,
    );
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
  ]);

  return jsonOk({ ok: true });
}
