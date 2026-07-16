# Evaluación Fase 4 — Frontend (pantallas del manual)

**Fecha:** 2026-07-16  
**Rama:** `develop`  
**Evaluador:** Agente QA/Validación

## Resumen ejecutivo

El frontend está en estado **parcial (~25%)**. Existe identidad visual (Tailwind v4, tokens de marca), componentes UI reutilizables y cliente API tipado, pero **no hay pantallas de producto** más allá del template por defecto de Next.js en `/`.

## Inventario UI

| Elemento | Estado | Ubicación |
|----------|--------|-----------|
| Tokens de marca (colores, tipografías) | ✅ | `globals.css`, `layout.tsx` |
| Componentes UI (Button, Input, Modal, etc.) | ✅ | `src/components/ui/` |
| AppShell + BottomNav | ✅ | `src/components/layout/AppShell.tsx` |
| AuthProvider | ✅ | `src/components/layout/AuthProvider.tsx` |
| Cliente API tipado | ✅ | `src/lib/api-client.ts` |
| Helpers de formato | ✅ | `src/lib/format.ts` |
| Página Login | ❌ | No existe `src/app/login/page.tsx` |
| Home con mapa | ❌ | `page.tsx` es template Next.js |
| Gestiones (lista/detalle/envío) | ❌ | Sin rutas `/gestiones` |
| Chat | ❌ | Sin rutas `/chats` |
| Perfil | ❌ | Sin ruta `/perfil` |
| Recuperar/restablecer contraseña | ❌ | Sin rutas auth |

## Criterios de aceptación (fase-4-frontend.md)

| Criterio | Estado |
|----------|--------|
| Todas las pantallas del manual existen y son usables | ❌ No cumplido |
| UI responsive con identidad RutaNova | ⚠️ Parcial — estilos listos, pantallas faltantes |
| Flujos E2E con backend real | ❌ No verificable sin pantallas |
| Sin placeholders vacíos | ❌ Home actual es placeholder de Next.js |

## Calidad de código (lo existente)

**Fortalezas**

- Componentes UI con clases Tailwind v4 y tokens `@theme` de marca.
- `BottomNav` con safe-area y estados activos.
- `api-client.ts` centraliza fetch con tipos alineados al contrato API.
- `EstadoBadge` preparado para estados de gestión.

**Áreas de mejora**

- `AppShell`/`BottomNav` no integrados en `layout.tsx` ni `page.tsx`.
- Sin manejo global de errores de red en cliente.
- Falta integración Leaflet en pantallas (dependencia instalada).

## Integración

- Backend (Fase 3) listo; frontend no consume APIs aún en rutas visibles.
- `AuthProvider` existe pero no envuelve la app en `layout.tsx`.

## Deuda técnica

| Ítem | Severidad | Notas |
|------|-----------|-------|
| Pantallas del manual sin implementar | Crítica | Bloquea demo de producto |
| Template Next.js en `/` | Alta | Sustituir por home RutaNova |
| Rutas de navegación rotas | Alta | BottomNav apunta a `/gestiones`, `/chats`, `/perfil` inexistentes |
| Sin estados loading/error en vistas | Media | Componentes existen pero no usados |
| Mapa Leaflet sin componente | Media | `react-leaflet` instalado sin uso |

## Próximos pasos recomendados

1. Envolver app con `AuthProvider` + redirección login/home.
2. Implementar rutas: `/login`, `/`, `/gestiones`, `/gestiones/[id]`, `/chats`, `/chats/[id]`, `/perfil`.
3. Conectar cada vista con `api-client.ts`.
4. Smoke manual: login → gestiones → iniciar → QR → chat → perfil.

## Veredicto

**Fase 4: PARCIAL (~25%)** — Fundación visual y cliente API listos; falta implementar todas las pantallas y flujos del manual.
