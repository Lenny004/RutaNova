"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type MapMarker = {
  lat: number;
  lng: number;
  label: string;
};

type DynamicMapProps = {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  route?: { lat: number; lng: number }[];
  height?: string;
  className?: string;
};

const LeafletMap = dynamic(
  () => import("./LeafletMap").then((m) => m.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[220px] items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <LoadingSpinner label="Cargando mapa…" />
      </div>
    ),
  },
);

export function DynamicMap(props: DynamicMapProps) {
  return <LeafletMap {...props} />;
}
