/**
 * Punto de entrada del dominio de gestiones (compatibilidad de imports).
 */
export {
  PROGRESO_MINIMO_INICIO,
  construirPayloadQr,
  debeIncrementarCancelaciones,
  obtenerGestionDeRepartidor,
  puedeAbrirEnvioEnCurso,
  puedeCancelar,
  puedeCancelarGestion,
  puedeCompletarGestion,
  puedeIniciar,
  puedeIniciarGestion,
  progresoAlIniciar,
} from "@/lib/gestiones/dominio";
