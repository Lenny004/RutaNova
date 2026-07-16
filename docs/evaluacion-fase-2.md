# Evaluación Fase 2 — Base de datos y dominio

**Fecha:** 2026-07-16  
**Rama:** `develop`  
**Evaluador:** Agente QA/Validación

## Resumen ejecutivo

La fase de base de datos está **completa**. El esquema Prisma modela el dominio del manual, el seed es realista y las utilidades de dominio (password, gestiones, serializers) están tipadas y cubiertas por tests unitarios.

## Criterios de aceptación

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| Migración aplica sin errores | ✅ Cumplido | `prisma/migrations/`, `npm run db:migrate` |
| Seed: ≥1 repartidor, 3 gestiones, 2 conversaciones | ✅ Cumplido | `prisma/seed.ts` — Carlos Andrade + 3 gestiones + chats |
| Relaciones User ↔ Gestion / Mensaje consistentes | ✅ Cumplido | FKs en `schema.prisma`, seed con `repartidorId` y `autorId` |
| Contraseñas hasheadas en seed | ✅ Cumplido | `bcrypt.hash("RutaNova2024!", 10)` |
| Reglas de gestión testeables | ✅ Cumplido | `src/lib/gestiones-rules.ts` + `gestiones-rules.test.ts` |

## Calidad de código

**Fortalezas**

- Enums `EstadoGestion` y `RolChat` alineados con contrato API.
- Serializers puros sin exponer `passwordHash` ni campos internos.
- `hashPassword` / `verifyPassword` encapsulan bcrypt con factor 10.
- Reglas de negocio (`puedeIniciar`, `puedeCancelar`, `progresoAlIniciar`) extraídas como funciones puras.

**Áreas de mejora**

- Las rutas API de gestiones duplican lógica de reglas en lugar de importar `gestiones-rules.ts` (refactor menor pendiente).
- SQLite es adecuado para demo; producción requerirá PostgreSQL y revisión de índices.

## Integración

- Cliente Prisma singleton en `src/lib/prisma.ts`.
- Tipos Prisma reutilizados en serializers y validaciones Zod.
- Tests de serializers validan contrato JSON (fechas ISO, campos públicos).

## Tests ejecutados

```
npm test
```

Cobertura actual (unitaria):

- `password.test.ts` — hash, verify, salts distintos
- `gestiones-rules.test.ts` — transiciones de estado y progreso mínimo (40)
- `serializers.test.ts` — usuario, gestión, detalle, chat, filtros por rol

## Deuda técnica

| Ítem | Severidad | Notas |
|------|-----------|-------|
| Reglas no usadas aún en route handlers | Baja | Riesgo de divergencia tests vs API |
| Sin tests de integración con BD | Media | Prisma mockeado solo en serializers |
| `debeIncrementarCancelaciones` en `gestiones.ts` vs `puedeCancelar` en rules | Baja | Misma semántica; consolidar en un módulo |

## Veredicto

**Fase 2: APROBADA** — Dominio sólido y semilla demo lista para consumo de APIs.
