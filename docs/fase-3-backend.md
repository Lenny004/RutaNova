# Fase 3 — Backend (APIs y lógica)

## Objetivos

- Exponer APIs REST que cubran autenticación, gestiones, perfil y chat.
- Validar entradas con Zod y proteger rutas con JWT.

## Tareas

1. Utilidades: hash/verify password, firmar/verificar JWT, helpers Prisma.
2. Auth:
   - `POST /api/auth/login`
   - `POST /api/auth/recuperar`
   - `POST /api/auth/restablecer`
   - `POST /api/auth/logout` (cliente limpia cookie/token)
3. Perfil:
   - `GET /api/perfil`
   - `PATCH /api/perfil`
4. Gestiones:
   - `GET /api/gestiones`
   - `GET /api/gestiones/[id]`
   - `POST /api/gestiones/[id]/iniciar`
   - `POST /api/gestiones/[id]/cancelar`
   - `GET /api/gestiones/[id]/qr`
5. Chat:
   - `GET /api/chat/conversaciones?filtro=managers|consumers`
   - `GET /api/chat/conversaciones/[id]/mensajes`
   - `POST /api/chat/conversaciones/[id]/mensajes`
6. Errores HTTP consistentes (`401`, `404`, `400`, `422`).

## Criterios de aceptación

- [x] Login inválido responde error claro; login válido entrega token/sesión.
- [x] Recuperación genera token; restablecimiento actualiza contraseña.
- [x] Listado y detalle de gestiones respetan el usuario autenticado.
- [x] Iniciar gestión cambia estado a `EN_CURSO` y habilita QR.
- [x] Chat filtra por managers/consumers y permite enviar mensajes.
