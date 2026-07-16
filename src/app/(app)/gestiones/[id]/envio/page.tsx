"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import { ExternalLink, QrCode } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { DynamicMap } from "@/components/map/DynamicMap";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { api, type GestionDetalle, wazeDeepLink } from "@/lib/api-client";

export default function EnvioPage() {
  const { id } = useParams<{ id: string }>();
  const [gestion, setGestion] = useState<GestionDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrLoading, setQrLoading] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { gestion: detalle } = await api.gestiones.obtener(id);
      setGestion(detalle);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function handleMostrarQr() {
    setQrLoading(true);
    try {
      const { payload } = await api.gestiones.qr(id);
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 256,
        margin: 2,
        color: { dark: "#0F1714", light: "#F3EDE2" },
      });
      setQrDataUrl(dataUrl);
      setQrOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar QR");
    } finally {
      setQrLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error && !gestion) {
    return (
      <div className="px-5 pt-6">
        <ErrorMessage message={error} onRetry={cargar} />
      </div>
    );
  }
  if (!gestion) return null;

  const destinoLat = gestion.destinoLat ?? 13.6929;
  const destinoLng = gestion.destinoLng ?? -89.2182;
  const origenLat = gestion.origenLat ?? destinoLat;
  const origenLng = gestion.origenLng ?? destinoLng;

  const markers = [
    ...(gestion.origenLat && gestion.origenLng
      ? [{ lat: origenLat, lng: origenLng, label: gestion.origenNombre ?? "Origen" }]
      : []),
    { lat: destinoLat, lng: destinoLng, label: gestion.receptorNombre },
  ];

  const route = [
    { lat: origenLat, lng: origenLng },
    { lat: destinoLat, lng: destinoLng },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Envío en curso"
        subtitle={gestion.receptorNombre}
        backHref={`/gestiones/${id}`}
      />

      <div className="space-y-4 px-5 pb-8">
        <DynamicMap
          center={{ lat: destinoLat, lng: destinoLng }}
          zoom={13}
          markers={markers}
          route={route}
          height="260px"
        />

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Destino
          </p>
          <p className="mt-1 font-medium text-text-cream">
            {gestion.receptorDireccion}
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="flex flex-col gap-2">
          <a
            href={wazeDeepLink(destinoLat, destinoLng)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button variant="secondary" fullWidth>
              <ExternalLink className="h-4 w-4" />
              Abrir en Waze
            </Button>
          </a>

          <Button
            variant="primary"
            fullWidth
            loading={qrLoading}
            onClick={handleMostrarQr}
          >
            <QrCode className="h-4 w-4" />
            Mostrar QR
          </Button>
        </div>
      </div>

      <Modal open={qrOpen} onClose={() => setQrOpen(false)} title="Código QR">
        <div className="flex flex-col items-center gap-4">
          {qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="Código QR de entrega"
              className="rounded-xl"
              width={256}
              height={256}
            />
          )}
          <p className="text-center text-sm text-text-muted">
            Muestra este código al receptor para confirmar la entrega.
          </p>
        </div>
      </Modal>
    </div>
  );
}
