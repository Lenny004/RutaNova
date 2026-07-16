import type { Gestion, Mensaje, Participante, User } from "@prisma/client";
import { RolChat } from "@prisma/client";

export type UsuarioPublico = {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  fotoUrl: string | null;
  calificacion: number;
  gestionesCompletadas: number;
  gestionesCanceladas: number;
};

export type GestionResumen = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: Gestion["estado"];
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
  rolContacto: RolChat;
  actualizadoEn: string;
};

export type MensajeResumen = {
  id: string;
  contenido: string;
  enviadoEn: string;
  esMio: boolean;
  autorNombre: string;
};

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
  >,
): UsuarioPublico {
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
  const contacto = conversacion.participantes.find(
    (participante) => participante.userId !== userId,
  );
  if (!contacto) return null;

  const ultimoMensaje = conversacion.mensajes[0]?.contenido ?? null;

  return {
    id: conversacion.id,
    contactoNombre: contacto.nombre,
    contactoFotoUrl: contacto.fotoUrl,
    ultimoMensaje,
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

export function filtrarConversacionPorRol(
  conversacion: {
    participantes: Participante[];
  },
  userId: string,
  filtro: "managers" | "consumers",
): boolean {
  const contacto = conversacion.participantes.find(
    (participante) => participante.userId !== userId,
  );
  if (!contacto) return false;
  if (filtro === "managers") return contacto.rol === RolChat.MANAGER;
  return contacto.rol === RolChat.CONSUMER;
}
