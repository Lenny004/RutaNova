"use client";

import { useEffect, useState, useCallback } from "react";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { GestionCard } from "@/components/gestiones/GestionCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { api, type Gestion } from "@/lib/api-client";

export default function GestionesPage() {
  const [gestiones, setGestiones] = useState<Gestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { gestiones: lista } = await api.gestiones.listar();
      setGestiones(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div>
      <PageHeader
        title="Gestiones"
        subtitle="Todas tus entregas asignadas"
      />

      <div className="px-5 pb-6">
        {loading && <LoadingSpinner />}
        {!loading && error && (
          <ErrorMessage message={error} onRetry={cargar} />
        )}
        {!loading && !error && gestiones.length === 0 && (
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="Sin gestiones"
            description="Cuando te asignen entregas, aparecerán aquí."
          />
        )}
        {!loading && !error && gestiones.length > 0 && (
          <div className="space-y-3">
            {gestiones.map((gestion) => (
              <GestionCard key={gestion.id} gestion={gestion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
