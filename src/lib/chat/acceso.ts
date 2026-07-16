/**
 * Reglas de acceso y filtrado de conversaciones.
 */
import type { Participante } from "@prisma/client";
import { RolChat } from "@prisma/client";
import type { FiltroChat } from "@/types/dominio";

export function obtenerContactoConversacion(
  participantes: Participante[],
  userId: string,
): Participante | undefined {
  return participantes.find((participante) => participante.userId !== userId);
}

export function conversacionCoincideConFiltro(
  participantes: Participante[],
  userId: string,
  filtro: FiltroChat,
): boolean {
  const contacto = obtenerContactoConversacion(participantes, userId);
  if (!contacto) return false;
  if (filtro === "managers") return contacto.rol === RolChat.MANAGER;
  return contacto.rol === RolChat.CONSUMER;
}

/** Filtro compatible con handlers y tests (recibe la conversación completa). */
export function filtrarConversacionPorRol(
  conversacion: { participantes: Participante[] },
  userId: string,
  filtro: FiltroChat,
): boolean {
  return conversacionCoincideConFiltro(
    conversacion.participantes,
    userId,
    filtro,
  );
}
