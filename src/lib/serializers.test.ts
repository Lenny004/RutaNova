import { EstadoGestion, RolChat } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  filtrarConversacionPorRol,
  serializarConversacion,
  serializarGestion,
  serializarGestionDetalle,
  serializarMensaje,
  serializarUsuario,
} from "@/lib/serializers";

const fecha = new Date("2024-08-13T16:30:00.000Z");

const gestionBase = {
  id: "gest-1",
  repartidorId: "user-1",
  titulo: "Entrega de documentos",
  descripcion: "Contratos para firma",
  estado: EstadoGestion.PENDIENTE,
  progreso: 15,
  fechaProgramada: fecha,
  emisorNombre: "La Colonia",
  emisorDireccion: "Plaza Las Américas",
  receptorNombre: "Santa Elena",
  receptorDireccion: "Calle Principal",
  indicaciones: "Solicitar identificación",
  precauciones: "Maletín bloqueado",
  empresaEnvio: "QuickLoans",
  origenNombre: "Origen",
  origenLat: 13.7,
  origenLng: -89.22,
  destinoLat: 13.67,
  destinoLng: -89.24,
  codigoQr: "RN-001",
  creadoEn: fecha,
  actualizadoEn: fecha,
};

const usuarioBase = {
  id: "user-1",
  nombre: "Carlos Andrade",
  email: "carlos.andrade@rutanova.app",
  telefono: "23432312",
  empresa: "RutaNova Logistics",
  fotoUrl: "https://example.com/avatar.svg",
  calificacion: 9,
  gestionesCompletadas: 10,
  gestionesCanceladas: 2,
};

describe("serializers", () => {
  it("serializa usuario sin campos sensibles", () => {
    expect(serializarUsuario(usuarioBase)).toEqual({
      id: usuarioBase.id,
      nombre: usuarioBase.nombre,
      email: usuarioBase.email,
      telefono: usuarioBase.telefono,
      empresa: usuarioBase.empresa,
      fotoUrl: usuarioBase.fotoUrl,
      calificacion: usuarioBase.calificacion,
      gestionesCompletadas: usuarioBase.gestionesCompletadas,
      gestionesCanceladas: usuarioBase.gestionesCanceladas,
    });
  });

  it("serializa gestión con fecha ISO", () => {
    expect(serializarGestion(gestionBase)).toEqual({
      id: gestionBase.id,
      titulo: gestionBase.titulo,
      descripcion: gestionBase.descripcion,
      estado: gestionBase.estado,
      fechaProgramada: fecha.toISOString(),
      receptorNombre: gestionBase.receptorNombre,
      receptorDireccion: gestionBase.receptorDireccion,
      emisorNombre: gestionBase.emisorNombre,
      progreso: gestionBase.progreso,
    });
  });

  it("serializa detalle de gestión con campos extendidos", () => {
    const detalle = serializarGestionDetalle(gestionBase);

    expect(detalle.indicaciones).toBe(gestionBase.indicaciones);
    expect(detalle.origenLat).toBe(gestionBase.origenLat);
    expect(detalle.emisorDireccion).toBe(gestionBase.emisorDireccion);
    expect(detalle.fechaProgramada).toBe(fecha.toISOString());
  });

  it("serializa conversación con contacto y último mensaje", () => {
    const conversacion = {
      id: "conv-1",
      actualizadoEn: fecha,
      participantes: [
        {
          id: "p-1",
          conversacionId: "conv-1",
          userId: "user-1",
          nombre: "Carlos",
          fotoUrl: null,
          rol: RolChat.REPARTIDOR,
        },
        {
          id: "p-2",
          conversacionId: "conv-1",
          userId: "mgr-1",
          nombre: "María",
          fotoUrl: "https://example.com/maria.svg",
          rol: RolChat.MANAGER,
        },
      ],
      mensajes: [
        {
          id: "m-1",
          conversacionId: "conv-1",
          autorId: "mgr-1",
          autorNombre: "María",
          contenido: "¿Llegaste al punto?",
          enviadoEn: fecha,
        },
      ],
    };

    expect(serializarConversacion(conversacion, "user-1")).toEqual({
      id: "conv-1",
      contactoNombre: "María",
      contactoFotoUrl: "https://example.com/maria.svg",
      ultimoMensaje: "¿Llegaste al punto?",
      rolContacto: RolChat.MANAGER,
      actualizadoEn: fecha.toISOString(),
    });
  });

  it("serializa mensaje marcando esMio según autor", () => {
    const mensaje = {
      id: "m-1",
      conversacionId: "conv-1",
      autorId: "user-1",
      autorNombre: "Carlos",
      contenido: "En camino",
      enviadoEn: fecha,
    };

    expect(serializarMensaje(mensaje, "user-1").esMio).toBe(true);
    expect(serializarMensaje(mensaje, "otro-user").esMio).toBe(false);
  });

  it("filtra conversaciones por rol del contacto", () => {
    const conversacion = {
      participantes: [
        { userId: "user-1", nombre: "Carlos", rol: RolChat.REPARTIDOR },
        { userId: "mgr-1", nombre: "María", rol: RolChat.MANAGER },
      ],
    };

    expect(filtrarConversacionPorRol(conversacion, "user-1", "managers")).toBe(
      true,
    );
    expect(
      filtrarConversacionPorRol(conversacion, "user-1", "consumers"),
    ).toBe(false);
  });
});
