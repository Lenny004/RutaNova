# Coordinación de agentes — RutaNova

## Agentes designados

| Agente | Responsabilidad | Paths principales | Estado |
|--------|-----------------|-------------------|--------|
| Base de datos | Esquema, migración, seed | `prisma/**` | Completado (orquestador) |
| Backend | APIs y lógica de dominio | `src/app/api/**`, `src/lib/validations/**` | En paralelo |
| Frontend | UI y experiencia | `src/app/**` (no api), `src/components/**` | En paralelo |
| QA / Validación | Tests y evaluaciones | `tests/**`, `docs/evaluacion-*.md` | En paralelo |

## Reglas anti-conflicto

1. Una sola rama de desarrollo: `develop`.
2. Backend no modifica pantallas; Frontend no modifica APIs ni Prisma.
3. Contrato compartido en `docs/contrato-api.md`.
4. Helpers compartidos (`src/lib/auth.ts`, `prisma.ts`, `password.ts`, `http.ts`) los mantiene el orquestador salvo helpers puros de QA.
5. Commits atómicos frecuentes con gitmoji en español.

## Orden de integración

1. Fundación + BD (hecho)
2. Backend + Frontend en paralelo sobre el contrato
3. QA valida y documenta evaluaciones por fase
4. Orquestador resuelve conflictos, pulido UI y cierre Fase 5
