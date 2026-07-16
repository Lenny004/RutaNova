"use client";

import { useCallback, useEffect, useState } from "react";
import { obtenerMensajeError } from "@/lib/errores";

type EstadoRecurso<T> = {
  datos: T | null;
  cargando: boolean;
  error: string;
  recargar: () => Promise<void>;
  establecerDatos: (valor: T | null | ((prev: T | null) => T | null)) => void;
};

/**
 * Encapsula el patrón loading/error/fetch repetido en pantallas.
 */
export function useRecursoAsincrono<T>(
  cargador: () => Promise<T>,
  dependencias: unknown[] = [],
): EstadoRecurso<T> {
  const [datos, establecerDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const resultado = await cargador();
      establecerDatos(resultado);
    } catch (err) {
      setError(obtenerMensajeError(err));
      establecerDatos(null);
    } finally {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { datos, cargando, error, recargar, establecerDatos };
}
