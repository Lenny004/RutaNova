"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ConversacionCard } from "@/components/chat/ConversacionCard";
import { PageHeader } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useRecursoAsincrono } from "@/hooks/useRecursoAsincrono";
import { api } from "@/lib/api-client";
import type { FiltroChat } from "@/types/dominio";

const ETIQUETAS_FILTRO: Record<FiltroChat, string> = {
  managers: "Managers",
  consumers: "Consumidores",
};

export default function ChatsPage() {
  const [filtro, setFiltro] = useState<FiltroChat>("managers");

  const {
    datos: conversaciones,
    cargando,
    error,
    recargar,
  } = useRecursoAsincrono(async () => {
    const respuesta = await api.chat.conversaciones(filtro);
    return respuesta.conversaciones;
  }, [filtro]);

  const lista = conversaciones ?? [];

  return (
    <div>
      <PageHeader title="Chats" subtitle="Conversaciones con tu equipo" />

      <div className="px-5 pb-6">
        <div className="mb-4 flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
          {(Object.keys(ETIQUETAS_FILTRO) as FiltroChat[]).map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setFiltro(opcion)}
              className={`
                flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200
                ${
                  filtro === opcion
                    ? "bg-accent-blue text-white shadow-sm"
                    : "text-text-muted hover:text-text-cream"
                }
              `}
            >
              {ETIQUETAS_FILTRO[opcion]}
            </button>
          ))}
        </div>

        {cargando && <LoadingSpinner />}
        {!cargando && error && (
          <ErrorMessage message={error} onRetry={recargar} />
        )}
        {!cargando && !error && lista.length === 0 && (
          <EmptyState
            icon={<MessageCircle className="h-6 w-6" />}
            title="Sin conversaciones"
            description="No hay chats en este filtro por ahora."
          />
        )}
        {!cargando && !error && lista.length > 0 && (
          <div className="space-y-2">
            {lista.map((conversacion) => (
              <ConversacionCard
                key={conversacion.id}
                conversacion={conversacion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
