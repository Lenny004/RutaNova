/**
 * Mapea entidades Prisma a DTOs del contrato API.
 */
import type { Gestion, Mensaje, Participante, User } from "@prisma/client";
import { obtenerContactoConversacion } from "@/lib/chat/acceso";
import type {
  ConversacionResumen,
  GestionDetalle,
  GestionResumen,
  MensajeResumen,
  Usuario,
} from "@/types/dominio";

export type {
  ConversacionResumen,
  GestionDetalle,
  GestionResumen,
  MensajeResumen,
  Usuario,
};

/** @deprecated Preferir `Usuario` desde `@/types/dominio`. */
export type UsuarioPublico = Usuario;

export function serializarUsuario(
  user: Pick<
    User,
    | "id"
    | "nombre"
    | "email"
    | "telefono"
    | "empresa"
    | "fotoUrl"
    | "calificacion"
    | "gestionesCompletadas"
    | "gestionesCanceladas"
  > &
    Partial<
      Pick<User, "ubicacionLat" | "ubicacionLng" | "ubicacionDireccion">
    >,
): Usuario {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    telefono: user.telefono,
    empresa: user.empresa,
    fotoUrl: user.fotoUrl,
    calificacion: user.calificacion,
    gestionesCompletadas: user.gestionesCompletadas,
    gestionesCanceladas: user.gestionesCanceladas,
    ubicacionLat: user.ubicacionLat ?? null,
    ubicacionLng: user.ubicacionLng ?? null,
    ubicacionDireccion: user.ubicacionDireccion ?? null,
  };
}

export function serializarGestion(gestion: Gestion): GestionResumen {
  return {
    id: gestion.id,
    titulo: gestion.titulo,
    descripcion: gestion.descripcion,
    estado: gestion.estado,
    fechaProgramada: gestion.fechaProgramada.toISOString(),
    receptorNombre: gestion.receptorNombre,
    receptorDireccion: gestion.receptorDireccion,
    emisorNombre: gestion.emisorNombre,
    progreso: gestion.progreso,
  };
}

export function serializarGestionDetalle(gestion: Gestion): GestionDetalle {
  return {
    ...serializarGestion(gestion),
    indicaciones: gestion.indicaciones,
    precauciones: gestion.precauciones,
    empresaEnvio: gestion.empresaEnvio,
    origenLat: gestion.origenLat,
    origenLng: gestion.origenLng,
    origenNombre: gestion.origenNombre,
    destinoLat: gestion.destinoLat,
    destinoLng: gestion.destinoLng,
    emisorDireccion: gestion.emisorDireccion,
  };
}

export function serializarConversacion(
  conversacion: {
    id: string;
    actualizadoEn: Date;
    participantes: Participante[];
    mensajes: Mensaje[];
  },
  userId: string,
): ConversacionResumen | null {
  const contacto = obtenerContactoConversacion(
    conversacion.participantes,
    userId,
  );
  if (!contacto) return null;

  return {
    id: conversacion.id,
    contactoNombre: contacto.nombre,
    contactoFotoUrl: contacto.fotoUrl,
    ultimoMensaje: conversacion.mensajes[0]?.contenido ?? null,
    rolContacto: contacto.rol,
    actualizadoEn: conversacion.actualizadoEn.toISOString(),
  };
}

export function serializarMensaje(
  mensaje: Mensaje,
  userId: string,
): MensajeResumen {
  return {
    id: mensaje.id,
    contenido: mensaje.contenido,
    enviadoEn: mensaje.enviadoEn.toISOString(),
    esMio: mensaje.autorId === userId,
    autorNombre: mensaje.autorNombre,
  };
}

export { filtrarConversacionPorRol } from "@/lib/chat/acceso";
