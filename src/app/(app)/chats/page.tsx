"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { ConversacionCard } from "@/components/chat/ConversacionCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { api, type Conversacion } from "@/lib/api-client";

type Filtro = "managers" | "consumers";

export default function ChatsPage() {
  const [filtro, setFiltro] = useState<Filtro>("managers");
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { conversaciones: lista } = await api.chat.conversaciones(filtro);
      setConversaciones(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div>
      <PageHeader title="Chats" subtitle="Conversaciones con tu equipo" />

      <div className="px-5 pb-6">
        <div className="mb-4 flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
          {(["managers", "consumers"] as const).map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setFiltro(opcion)}
              className={`
                flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200
                ${filtro === opcion
                  ? "bg-accent-blue text-white shadow-sm"
                  : "text-text-muted hover:text-text-cream"
                }
              `}
            >
              {opcion === "managers" ? "Managers" : "Consumidores"}
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner />}
        {!loading && error && (
          <ErrorMessage message={error} onRetry={cargar} />
        )}
        {!loading && !error && conversaciones.length === 0 && (
          <EmptyState
            icon={<MessageCircle className="h-6 w-6" />}
            title="Sin conversaciones"
            description={`No hay chats con ${filtro === "managers" ? "managers" : "consumidores"} por ahora.`}
          />
        )}
        {!loading && !error && conversaciones.length > 0 && (
          <div className="space-y-3">
            {conversaciones.map((conv) => (
              <ConversacionCard key={conv.id} conversacion={conv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
