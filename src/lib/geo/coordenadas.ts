/**
 * Utilidades geográficas y deep links de navegación.
 */

export const CENTRO_SAN_SALVADOR = {
  latitud: 13.6929,
  longitud: -89.2182,
} as const;

/** @deprecated Usar CENTRO_SAN_SALVADOR; se mantiene por compatibilidad temporal. */
export const SAN_SALVADOR_CENTER = {
  lat: CENTRO_SAN_SALVADOR.latitud,
  lng: CENTRO_SAN_SALVADOR.longitud,
};

export type Coordenada = {
  latitud: number;
  longitud: number;
};

export function enlaceWaze(latitud: number, longitud: number): string {
  return `https://waze.com/ul?ll=${latitud},${longitud}&navigate=yes`;
}

/** Alias histórico usado por pantallas existentes. */
export function wazeDeepLink(lat: number, lng: number): string {
  return enlaceWaze(lat, lng);
}

/**
 * Resuelve coordenadas de destino o origen, con fallback a San Salvador.
 */
export function resolverCoordenadasDestino(opciones: {
  destinoLat: number | null | undefined;
  destinoLng: number | null | undefined;
  origenLat?: number | null | undefined;
  origenLng?: number | null | undefined;
}): Coordenada {
  if (
    typeof opciones.destinoLat === "number" &&
    typeof opciones.destinoLng === "number"
  ) {
    return { latitud: opciones.destinoLat, longitud: opciones.destinoLng };
  }

  if (
    typeof opciones.origenLat === "number" &&
    typeof opciones.origenLng === "number"
  ) {
    return { latitud: opciones.origenLat, longitud: opciones.origenLng };
  }

  return {
    latitud: CENTRO_SAN_SALVADOR.latitud,
    longitud: CENTRO_SAN_SALVADOR.longitud,
  };
}
