"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { SAN_SALVADOR_CENTER } from "@/lib/api-client";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type MapMarker = {
  lat: number;
  lng: number;
  label: string;
  color?: "green" | "amber";
};

type LeafletMapProps = {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  route?: { lat: number; lng: number }[];
  height?: string;
  className?: string;
};

export function LeafletMap({
  center,
  zoom = 13,
  markers = [],
  route,
  height = "220px",
  className = "",
}: LeafletMapProps) {
  useEffect(() => {
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  const mapCenter = center ?? SAN_SALVADOR_CENTER;

  return (
    <div className={`overflow-hidden rounded-xl border border-white/10 ${className}`}>
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        style={{ height, width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {route && route.length > 1 && (
          <Polyline
            positions={route.map((p) => [p.lat, p.lng] as [number, number])}
            pathOptions={{ color: "#E8A54B", weight: 4, opacity: 0.8 }}
          />
        )}
        {markers.map((marker, i) => (
          <Marker key={`${marker.lat}-${marker.lng}-${i}`} position={[marker.lat, marker.lng]}>
            <Popup>{marker.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
