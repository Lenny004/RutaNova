/**
 * Helpers para proteger route handlers y tipar contextos dinámicos.
 */
import type { NextRequest } from "next/server";
import { requireUser, type SessionUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";

export type ContextoRutaConId = {
  params: Promise<{ id: string }>;
};

type HandlerAutenticado = (
  request: NextRequest,
  user: SessionUser,
) => Promise<Response>;

type HandlerAutenticadoConId = (
  request: NextRequest,
  user: SessionUser,
  id: string,
) => Promise<Response>;

/** Envuelve un handler exigiendo usuario autenticado. */
export function withAuth(handler: HandlerAutenticado) {
  return async (request: NextRequest) => {
    const { user, error } = await requireUser(request);
    if (!user) {
      return jsonError(error ?? "No autenticado", 401);
    }
    return handler(request, user);
  };
}

/** Envuelve un handler con auth + parámetro dinámico `id`. */
export function withAuthId(handler: HandlerAutenticadoConId) {
  return async (request: NextRequest, context: ContextoRutaConId) => {
    const { user, error } = await requireUser(request);
    if (!user) {
      return jsonError(error ?? "No autenticado", 401);
    }
    const { id } = await context.params;
    return handler(request, user, id);
  };
}
