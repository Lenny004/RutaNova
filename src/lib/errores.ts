/**
 * Normaliza errores desconocidos a mensajes legibles para la UI.
 */
export function obtenerMensajeError(
  error: unknown,
  mensajeFallback = "Ocurrió un error inesperado",
): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return mensajeFallback;
}
