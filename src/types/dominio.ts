/**
 * Tipos de dominio compartidos entre API, serializers y cliente HTTP.
 * Fuente única para evitar drift entre capas.
 */

export type EstadoGestion =
  | "PENDIENTE"
  | "EN_CURSO"
  | "COMPLETADA"
  | "CANCELADA";

export type RolContactoChat = "MANAGER" | "CONSUMER" | "REPARTIDOR";

export type FiltroChat = "managers" | "consumers";

/** Usuario expuesto al cliente (sesión / perfil). */
export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  fotoUrl: string | null;
  calificacion: number;
  gestionesCompletadas: number;
  gestionesCanceladas: number;
  ubicacionLat?: number | null;
  ubicacionLng?: number | null;
  ubicacionDireccion?: string | null;
};

export type GestionResumen = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: EstadoGestion;
  fechaProgramada: string;
  receptorNombre: string;
  receptorDireccion: string;
  emisorNombre: string;
  progreso: number;
};

export type GestionDetalle = GestionResumen & {
  indicaciones: string | null;
  precauciones: string | null;
  empresaEnvio: string | null;
  origenLat: number | null;
  origenLng: number | null;
  origenNombre: string | null;
  destinoLat: number | null;
  destinoLng: number | null;
  emisorDireccion: string | null;
};

export type ConversacionResumen = {
  id: string;
  contactoNombre: string;
  contactoFotoUrl: string | null;
  ultimoMensaje: string | null;
  rolContacto: RolContactoChat;
  actualizadoEn: string;
};

export type MensajeResumen = {
  id: string;
  contenido: string;
  enviadoEn: string;
  esMio: boolean;
  autorNombre: string;
};

/** Alias legibles usados por el cliente HTTP. */
export type Gestion = GestionResumen;
export type Conversacion = ConversacionResumen;
export type Mensaje = MensajeResumen;
