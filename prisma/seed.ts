import { PrismaClient, EstadoGestion, RolChat } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.mensaje.deleteMany();
  await prisma.participante.deleteMany();
  await prisma.conversacion.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.gestion.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("RutaNova2024!", 10);

  const carlos = await prisma.user.create({
    data: {
      nombre: "Carlos Andrade",
      email: "carlos.andrade@rutanova.app",
      passwordHash,
      telefono: "23432312",
      empresa: "RutaNova Logistics",
      fotoUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Carlos",
      calificacion: 9.0,
      gestionesCompletadas: 0,
      gestionesCanceladas: 2,
      ubicacionLat: 13.6929,
      ubicacionLng: -89.2182,
      ubicacionDireccion: "San Salvador, El Salvador",
    },
  });

  await prisma.gestion.createMany({
    data: [
      {
        repartidorId: carlos.id,
        titulo: "Entrega de Documentos Legales",
        descripcion: "Contratos y acuerdos de préstamo para firma autorizada.",
        estado: EstadoGestion.PENDIENTE,
        progreso: 15,
        fechaProgramada: new Date("2024-08-13T16:30:00"),
        emisorNombre: "Supermercado La Colonia",
        emisorDireccion: "Plaza Las Américas",
        receptorNombre: "Residencial Santa Elena",
        receptorDireccion: "Calle Principal, Residencial Santa Elena",
        indicaciones:
          "Entregar solo a una persona autorizada, solicitando una copia de su identificación y firma.",
        precauciones:
          "Transportar en un maletín bloqueado con combinación, evitando la exposición directa a condiciones climáticas extremas.",
        empresaEnvio: "QuickLoans",
        origenNombre: "Supermercado La Colonia",
        origenLat: 13.701,
        origenLng: -89.224,
        destinoLat: 13.6765,
        destinoLng: -89.2482,
        codigoQr: `RN-DOC-${carlos.id.slice(0, 8)}`,
      },
      {
        repartidorId: carlos.id,
        titulo: "Entrega de Tarjetas de Crédito",
        descripcion: "Entrega segura de tarjetas selladas a sucursal bancaria.",
        estado: EstadoGestion.PENDIENTE,
        progreso: 0,
        fechaProgramada: new Date("2024-08-14T10:00:00"),
        emisorNombre: "Banco Atlántida",
        emisorDireccion: "Centro Financiero",
        receptorNombre: "Sucursal Escalón",
        receptorDireccion: "Blvd. Escalón, San Salvador",
        indicaciones: "Solicitar sello de recepción en la bitácora de la sucursal.",
        precauciones: "No abrir el sobre; mantener cadena de custodia.",
        empresaEnvio: "RutaNova Secure",
        origenNombre: "Banco Atlántida",
        origenLat: 13.698,
        origenLng: -89.23,
        destinoLat: 13.71,
        destinoLng: -89.24,
        codigoQr: `RN-TAR-${carlos.id.slice(0, 8)}`,
      },
      {
        repartidorId: carlos.id,
        titulo: "Entrega de Efectivo para Sucursales",
        descripcion: "Traslado de efectivo operativo a caja de sucursal.",
        estado: EstadoGestion.CANCELADA,
        progreso: 0,
        fechaProgramada: new Date("2024-08-12T09:00:00"),
        emisorNombre: "Tesorería Central",
        emisorDireccion: "Zona Rosa",
        receptorNombre: "Sucursal Metrocentro",
        receptorDireccion: "Metrocentro, San Salvador",
        indicaciones: "Cancelada por el gestor por cambio de ventana horaria.",
        precauciones: "Unidad blindada recomendada.",
        empresaEnvio: "CashMove",
        origenNombre: "Tesorería Central",
        origenLat: 13.705,
        origenLng: -89.21,
        destinoLat: 13.7055,
        destinoLng: -89.2115,
        codigoQr: `RN-EFE-${carlos.id.slice(0, 8)}`,
      },
    ],
  });

  const convManagers = await prisma.conversacion.create({
    data: {
      titulo: "Coordinación Managers",
      participantes: {
        create: [
          {
            userId: carlos.id,
            nombre: carlos.nombre,
            fotoUrl: carlos.fotoUrl,
            rol: RolChat.REPARTIDOR,
          },
          {
            nombre: "David Wayne",
            fotoUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=David",
            rol: RolChat.MANAGER,
          },
        ],
      },
      mensajes: {
        create: [
          {
            autorNombre: "David Wayne",
            contenido: "Thanks a bunch! Have a great day!",
          },
          {
            autorId: carlos.id,
            autorNombre: carlos.nombre,
            contenido: "¡Listo, voy en camino!",
          },
        ],
      },
    },
  });

  const convAndres = await prisma.conversacion.create({
    data: {
      titulo: "Andrés Flores",
      participantes: {
        create: [
          {
            userId: carlos.id,
            nombre: carlos.nombre,
            fotoUrl: carlos.fotoUrl,
            rol: RolChat.REPARTIDOR,
          },
          {
            nombre: "Andrés Flores",
            fotoUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Andres",
            rol: RolChat.MANAGER,
          },
        ],
      },
      mensajes: {
        create: [
          {
            autorNombre: "Andrés Flores",
            contenido: "Hola Sosa",
          },
        ],
      },
    },
  });

  await prisma.conversacion.create({
    data: {
      titulo: "Cliente Residencial",
      participantes: {
        create: [
          {
            userId: carlos.id,
            nombre: carlos.nombre,
            fotoUrl: carlos.fotoUrl,
            rol: RolChat.REPARTIDOR,
          },
          {
            nombre: "Ana Consumer",
            fotoUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ana",
            rol: RolChat.CONSUMER,
          },
        ],
      },
      mensajes: {
        create: [
          {
            autorNombre: "Ana Consumer",
            contenido: "¿A qué hora llega la entrega?",
          },
        ],
      },
    },
  });

  console.log("Seed OK", {
    user: carlos.email,
    conversaciones: [convManagers.id, convAndres.id],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
