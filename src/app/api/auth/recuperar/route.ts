import { randomBytes } from "crypto";
import { NextRequest } from "next/server";
import { jsonOk } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { recuperarSchema } from "@/lib/validations/auth";
import { parseBody } from "@/lib/validations/common";

const MENSAJE_RECUPERACION =
  "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.";

export async function POST(request: NextRequest) {
  const parsed = await parseBody(request, recuperarSchema);
  if (parsed.error) return parsed.error;

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  let resetToken: string | undefined;

  if (user) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    if (process.env.NODE_ENV !== "production") {
      resetToken = token;
    }
  }

  return jsonOk({
    ok: true,
    message: MENSAJE_RECUPERACION,
    ...(resetToken ? { resetToken } : {}),
  });
}
