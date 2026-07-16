"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MessageCircle, MapPin, Navigation } from "lucide-react";
import { useAuth } from "@/components/layout/AuthProvider";
import { DynamicMap } from "@/components/map/DynamicMap";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { api, type Gestion, SAN_SALVADOR_CENTER } from "@/lib/api-client";

export default function HomePage() {
  const { user } = useAuth();
  const [gestiones, setGestiones] = useState<Gestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.gestiones
      .listar()
      .then(({ gestiones: lista }) => setGestiones(lista))
      .catch(() => setGestiones([]))
      .finally(() => setLoading(false));
  }, []);

  const activas = gestiones.filter(
    (g) => g.estado === "PENDIENTE" || g.estado === "EN_CURSO",
  ).length;

  const ubicacion = {
    lat: user.ubicacionLat ?? SAN_SALVADOR_CENTER.lat,
    lng: user.ubicacionLng ?? SAN_SALVADOR_CENTER.lng,
  };

  const hora = new Date().getHours();
  const saludo =
    hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="animate-fade-in">
      <header className="px-5 pt-8 pb-4">
        <p className="text-sm text-text-muted">{saludo},</p>
        <h1 className="font-display text-2xl text-text-cream">
          {user.nombre.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {activas > 0
            ? `Tienes ${activas} gestión${activas > 1 ? "es" : ""} activa${activas > 1 ? "s" : ""}`
            : "Sin gestiones activas por ahora"}
        </p>
      </header>

      <section className="px-5 pb-4">
        <div className="overflow-hidden rounded-xl border border-white/10">
          <DynamicMap
            center={ubicacion}
            zoom={14}
            markers={[
              {
                lat: ubicacion.lat,
                lng: ubicacion.lng,
                label: user.ubicacionDireccion ?? "Tu ubicación",
              },
            ]}
            height="200px"
          />
        </div>
        {user.ubicacionDireccion && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
            <Navigation className="h-3.5 w-3.5 text-accent-green" />
            {user.ubicacionDireccion}
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3 px-5 pb-6">
        <Link
          href="/gestiones"
          className="module-card col-span-2 flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:col-span-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-amber/15 text-accent-amber">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-text-cream">Gestiones</h2>
            <p className="text-xs text-text-muted">
              {loading ? "…" : `${gestiones.length} en total`}
            </p>
          </div>
        </Link>

        <Link
          href="/chats"
          className="module-card flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-text-cream">Chats</h2>
            <p className="text-xs text-text-muted">Managers y consumidores</p>
          </div>
        </Link>

        <div className="module-card flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green/15 text-accent-green">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-text-cream">Dirección actual</h2>
            <p className="truncate text-xs text-text-muted">
              {user.ubicacionDireccion ?? "San Salvador, SV"}
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : activas > 0 ? (
        <section className="px-5 pb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Próximas gestiones
          </h2>
          <div className="space-y-2">
            {gestiones
              .filter((g) => g.estado === "PENDIENTE" || g.estado === "EN_CURSO")
              .slice(0, 2)
              .map((g) => (
                <Link
                  key={g.id}
                  href={`/gestiones/${g.id}`}
                  className="module-card block rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <p className="font-medium text-text-cream">{g.titulo}</p>
                  <p className="text-xs text-text-muted">{g.receptorDireccion}</p>
                </Link>
              ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
