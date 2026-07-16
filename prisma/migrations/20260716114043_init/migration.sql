-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "telefono" TEXT,
    "empresa" TEXT,
    "fotoUrl" TEXT,
    "calificacion" REAL NOT NULL DEFAULT 0,
    "gestionesCompletadas" INTEGER NOT NULL DEFAULT 0,
    "gestionesCanceladas" INTEGER NOT NULL DEFAULT 0,
    "ubicacionLat" REAL,
    "ubicacionLng" REAL,
    "ubicacionDireccion" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Gestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repartidorId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "progreso" INTEGER NOT NULL DEFAULT 0,
    "fechaProgramada" DATETIME NOT NULL,
    "emisorNombre" TEXT NOT NULL,
    "emisorDireccion" TEXT,
    "receptorNombre" TEXT NOT NULL,
    "receptorDireccion" TEXT NOT NULL,
    "indicaciones" TEXT,
    "precauciones" TEXT,
    "empresaEnvio" TEXT,
    "origenNombre" TEXT,
    "origenLat" REAL,
    "origenLng" REAL,
    "destinoLat" REAL,
    "destinoLng" REAL,
    "codigoQr" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    CONSTRAINT "Gestion_repartidorId_fkey" FOREIGN KEY ("repartidorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conversacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Participante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversacionId" TEXT NOT NULL,
    "userId" TEXT,
    "nombre" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "rol" TEXT NOT NULL,
    CONSTRAINT "Participante_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "Conversacion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Participante_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversacionId" TEXT NOT NULL,
    "autorId" TEXT,
    "autorNombre" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "enviadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Mensaje_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "Conversacion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Mensaje_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participante_conversacionId_nombre_rol_key" ON "Participante"("conversacionId", "nombre", "rol");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
