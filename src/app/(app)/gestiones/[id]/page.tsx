"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, AlertTriangle, Info, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { EstadoBadge } from "@/components/ui/EstadoBadge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ProgresoBar } from "@/components/gestiones/ProgresoBar";
import { api, type GestionDetalle } from "@/lib/api-client";
import { obtenerMensajeError } from "@/lib/errores";
import { formatFecha } from "@/lib/format";
import { puedeAbrirEnvioEnCurso } from "@/lib/gestiones";

export default function GestionDetallePage() {
  const { id: gestionId } = useParams<{ id: string }>();
  const router = useRouter();
  const [gestion, setGestion] = useState<GestionDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [accionEnCurso, setAccionEnCurso] = useState(false);

  const cargarDetalle = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const { gestion: detalle } = await api.gestiones.obtener(gestionId);
      setGestion(detalle);
    } catch (err) {
      setError(obtenerMensajeError(err, "Error al cargar la gestión"));
    } finally {
      setCargando(false);
    }
  }, [gestionId]);

  useEffect(() => {
    void cargarDetalle();
  }, [cargarDetalle]);

  async function iniciarGestion() {
    if (!gestion) return;
    setAccionEnCurso(true);
    try {
      const { gestion: gestionActualizada } = await api.gestiones.iniciar(
        gestion.id,
      );
      setGestion(gestionActualizada);
      router.push(`/gestiones/${gestion.id}/envio`);
    } catch (err) {
      setError(obtenerMensajeError(err, "No se pudo iniciar la gestión"));
    } finally {
      setAccionEnCurso(false);
    }
  }

  if (cargando) return <LoadingSpinner />;
  if (error && !gestion) {
    return (
      <div className="px-5 pt-6">
        <ErrorMessage message={error} onRetry={cargarDetalle} />
      </div>
    );
  }
  if (!gestion) return null;

  const puedeAbrirEnvio = puedeAbrirEnvioEnCurso(gestion.estado);

  return (
    <div className="animate-fade-in">
      <PageHeader title={gestion.titulo} backHref="/gestiones" />

      <div className="space-y-4 px-5 pb-8">
        <div className="flex items-center gap-2">
          <EstadoBadge estado={gestion.estado} />
          <span className="text-sm text-text-muted">
            {formatFecha(gestion.fechaProgramada)}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-text-cream/90">
          {gestion.descripcion}
        </p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Receptor
              </p>
              <p className="font-medium text-text-cream">{gestion.receptorNombre}</p>
              <p className="text-sm text-text-muted">{gestion.receptorDireccion}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent-amber" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Emisor
              </p>
              <p className="font-medium text-text-cream">{gestion.emisorNombre}</p>
              {gestion.emisorDireccion && (
                <p className="text-sm text-text-muted">{gestion.emisorDireccion}</p>
              )}
            </div>
          </div>

          {gestion.empresaEnvio && (
            <p className="text-sm text-text-muted">
              Empresa: <span className="text-text-cream">{gestion.empresaEnvio}</span>
            </p>
          )}
        </div>

        {gestion.indicaciones && (
          <div className="rounded-xl border border-accent-blue/20 bg-accent-blue/10 p-4">
            <div className="flex items-center gap-2 text-accent-blue">
              <Info className="h-4 w-4" />
              <span className="text-sm font-semibold">Indicaciones</span>
            </div>
            <p className="mt-2 text-sm text-text-cream/90">{gestion.indicaciones}</p>
          </div>
        )}

        {gestion.precauciones && (
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">
            <div className="flex items-center gap-2 text-orange-300">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-semibold">Precauciones</span>
            </div>
            <p className="mt-2 text-sm text-text-cream/90">{gestion.precauciones}</p>
          </div>
        )}

        <ProgresoBar progreso={gestion.progreso} />

        {error && <ErrorMessage message={error} />}

        {puedeAbrirEnvio && (
          <div className="flex flex-col gap-2 pt-2">
            {gestion.estado === "EN_CURSO" ? (
              <Button
                fullWidth
                onClick={() => router.push(`/gestiones/${gestion.id}/envio`)}
              >
                Continuar envío
              </Button>
            ) : (
              <Button
                fullWidth
                loading={accionEnCurso}
                onClick={iniciarGestion}
              >
                Comenzar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
