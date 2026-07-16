# Fase 2 — Base de datos y dominio

## Objetivos

- Modelar el dominio del manual: usuarios, gestiones, chat, tokens de recuperación.
- Sembrar datos demo realistas (repartidor, gestiones, conversaciones).

## Tareas

1. Definir esquema Prisma: `User`, `Gestion`, `Conversacion`, `Participante`, `Mensaje`, `PasswordResetToken`.
2. Enums: `EstadoGestion` (PENDIENTE, EN_CURSO, COMPLETADA, CANCELADA), `RolChat` (MANAGER, CONSUMER, REPARTIDOR).
3. Crear migración inicial y cliente Prisma.
4. Seed con usuario demo, gestiones de ejemplo (documentos legales, tarjetas, efectivo), chats y mensajes.
5. Documentar relaciones y campos clave en este archivo (actualizar tras implementación).

## Criterios de aceptación

- [x] Migración aplica sin errores (`npx prisma migrate dev`).
- [x] Seed crea al menos 1 repartidor, 3 gestiones y 2 conversaciones.
- [x] Relaciones User ↔ Gestion / Mensaje son consistentes.
- [x] Contraseñas en seed están hasheadas.
