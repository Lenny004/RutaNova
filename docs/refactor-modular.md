# Refactor modular — RutaNova

## Módulos añadidos

| Módulo | Responsabilidad |
|--------|-----------------|
| `src/types/dominio.ts` | DTOs únicos (Usuario, Gestion, Chat) |
| `src/lib/gestiones/dominio.ts` | Reglas y consultas de gestiones |
| `src/lib/geo/coordenadas.ts` | Centro mapa, Waze, resolución coords |
| `src/lib/chat/acceso.ts` | Filtros y contacto de conversación |
| `src/lib/api/with-auth.ts` | Wrappers auth para route handlers |
| `src/hooks/useRecursoAsincrono.ts` | Fetch/loading/error reutilizable |
| `src/components/gestiones/ProgresoBar.tsx` | Barra de progreso compartida |
| `src/middleware.ts` | Guard de cookie + redirects auth |

## Mejoras de legibilidad

- Nombres descriptivos en español para dominio (`puedeIniciarGestion` vs UI `puedeAbrirEnvioEnCurso`).
- Cliente HTTP sin mezclar utilidades geo.
- Serializers delegan filtrado de chat a `lib/chat`.
- Comentarios solo donde aclaran contrato o trampa semántica.
