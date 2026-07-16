# Plan 0 — Detección de Tecnologías

**Producto:** RutaNova  
**Fuente:** Manual técnico / manual de usuario (app de gestiones de entrega para repartidores)  
**Fecha:** 2026-07-16

## 1. Resumen del sistema

RutaNova es una plataforma web orientada a repartidores que permite:

- Autenticación y recuperación de contraseña
- Home con mapa en tiempo real y módulos de acceso rápido
- Gestión de entregas (listado, estados, detalle, progreso)
- Inicio de envío con navegación (Waze) y código QR de validación
- Chat con filtros (Managers / Consumers)
- Perfil editable con estadísticas de desempeño

## 2. Stack tecnológico recomendado

| Capa | Tecnología | Versión objetivo |
|------|------------|------------------|
| Runtime | Node.js | 20+ LTS |
| Framework full-stack | Next.js (App Router) | 15.x |
| Lenguaje | TypeScript | 5.x |
| UI | React + Tailwind CSS | React 19 / Tailwind v4 |
| ORM / BD | Prisma + SQLite | Prisma 6.x |
| Auth | JWT (jose) + bcryptjs | — |
| Validación | Zod | 3.x |
| Mapas | Leaflet + react-leaflet | 1.9.x / 4.x |
| QR | qrcode | 1.5.x |
| Iconos | lucide-react | — |
| Tipografía | DM Sans + Fraunces (Google Fonts) | — |
| Pruebas | Vitest + Playwright (smoke) | — |
| Control de versiones | Git | — |

## 3. Justificación por tecnología

### Next.js + TypeScript
- Un solo repositorio para UI y API (`app/api`), ideal para MVP y despliegue simple.
- Tipado estricto reduce errores en dominio (gestiones, estados, chat).
- SSR/CSR híbrido: login y paneles rápidos; mapa y chat en cliente.

### React + Tailwind CSS v4
- Componentes reutilizables para pantallas del manual (login, home, gestiones, detalle, chat, perfil).
- Utility-first acelera UI profesional sin CSS monolítico.
- CSS-first (`@import "tailwindcss"`, `@theme`) alineado con Tailwind v4.

### Prisma + SQLite
- Esquema declarativo y migraciones reproducibles.
- SQLite sin servidor externo: desarrollo local inmediato y portable.
- Modelos claros: User, Gestion, Mensaje, Conversacion, PasswordResetToken.

### JWT + bcryptjs
- Sesiones stateless compatibles con API REST.
- Contraseñas hasheadas; flujo de recuperación con tokens de un solo uso.

### Zod
- Contratos de entrada/salida seguros en login, perfil, chat y gestiones.
- Mensajes de error consistentes con el manual (credenciales inválidas, contraseñas distintas, etc.).

### Leaflet
- Mapas interactivos sin dependencia de API key de pago en desarrollo.
- Suficiente para ubicación actual, destino y contexto de ruta.

### qrcode
- Generación del QR de validación en “envío en proceso”, requisito crítico del manual.

### Vitest / Playwright
- Unitarias de dominio y smoke E2E de flujos principales (login → gestiones → detalle).

## 4. Dependencias y compatibilidades

| Par | Compatibilidad | Notas |
|-----|----------------|-------|
| Next.js 15 ↔ React 19 | Compatible | Usar App Router |
| Prisma ↔ SQLite | Nativa | Archivo `prisma/dev.db` |
| react-leaflet ↔ React 19 | Requiere carga dinámica (`ssr: false`) | Evitar SSR de Leaflet |
| jose ↔ Edge/Node | Compatible | Tokens HS256 |
| Tailwind v4 ↔ PostCSS | Compatible | Sin `tailwind.config.js` legacy |

### Dependencias de entorno

- Node.js ≥ 20
- npm ≥ 10
- Variables: `DATABASE_URL`, `JWT_SECRET`, `APP_URL`

### Fuera de alcance del MVP (extensiones futuras)

- Notificaciones push / WebSocket en tiempo real (chat polling o SSE en v1)
- Integración nativa Waze (deep link web suficiente)
- Geolocalización continua en background (API Geolocation del navegador)
- PostgreSQL en producción (cambio de provider Prisma)

## 5. Arquitectura lógica

```
Cliente (Next.js UI)
  ├── Auth (login / recuperar / reset)
  ├── Home (mapa + accesos)
  ├── Gestiones / Detalle / Envío en proceso + QR
  ├── Chat (filtros + conversación)
  └── Perfil + estadísticas
        │
        ▼
API Routes (Next.js)
  ├── /api/auth/*
  ├── /api/gestiones/*
  ├── /api/chat/*
  └── /api/perfil/*
        │
        ▼
Prisma ORM → SQLite
```

## 6. Criterios de aceptación del Plan 0

- [x] Stack documentado con justificación
- [x] Compatibilidades y variables de entorno identificadas
- [x] Arquitectura alineada al manual de usuario
- [x] Base lista para planes de fase en `docs/`
