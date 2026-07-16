"use client";

import { Package } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { GestionCard } from "@/components/gestiones/GestionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useRecursoAsincrono } from "@/hooks/useRecursoAsincrono";
import { api } from "@/lib/api-client";

export default function GestionesPage() {
  const {
    datos: gestiones,
    cargando,
    error,
    recargar,
  } = useRecursoAsincrono(async () => {
    const respuesta = await api.gestiones.listar();
    return respuesta.gestiones;
  }, []);

  const lista = gestiones ?? [];

  return (
    <div>
      <PageHeader
        title="Gestiones"
        subtitle="Todas tus entregas asignadas"
      />

      <div className="px-5 pb-6">
        {cargando && <LoadingSpinner />}
        {!cargando && error && (
          <ErrorMessage message={error} onRetry={recargar} />
        )}
        {!cargando && !error && lista.length === 0 && (
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="Sin gestiones"
            description="Cuando te asignen entregas, aparecerán aquí."
          />
        )}
        {!cargando && !error && lista.length > 0 && (
          <div className="space-y-3">
            {lista.map((gestion) => (
              <GestionCard key={gestion.id} gestion={gestion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
