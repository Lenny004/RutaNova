"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Send } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { MensajeBubble } from "@/components/chat/MensajeBubble";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { api, type Mensaje } from "@/lib/api-client";

export default function ChatDetallePage() {
  const { id } = useParams<{ id: string }>();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { mensajes: lista } = await api.chat.mensajes(id);
      setMensajes(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    const texto = contenido.trim();
    if (!texto) return;

    setSending(true);
    setError("");
    try {
      const { mensaje } = await api.chat.enviar(id, texto);
      setMensajes((prev) => [...prev, mensaje]);
      setContenido("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col">
      <PageHeader title="Conversación" backHref="/chats" />

      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        {loading && <LoadingSpinner />}
        {!loading && error && mensajes.length === 0 && (
          <ErrorMessage message={error} onRetry={cargar} />
        )}
        {!loading &&
          mensajes.map((mensaje) => (
            <MensajeBubble key={mensaje.id} mensaje={mensaje} />
          ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleEnviar}
        className="sticky bottom-20 border-t border-white/10 bg-bg-charcoal/95 px-5 py-3 backdrop-blur-md"
      >
        {error && mensajes.length > 0 && (
          <p className="mb-2 text-xs text-accent-action">{error}</p>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Escribe un mensaje…"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-text-cream placeholder:text-text-muted focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !contenido.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-blue text-white transition-all hover:bg-accent-blue/90 disabled:opacity-50 active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
