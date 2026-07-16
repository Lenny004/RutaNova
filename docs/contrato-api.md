# Contrato API — RutaNova

Base: `/api`. Auth: cookie `rutanova_token` (JWT) o header `Authorization: Bearer <token>`.

## Auth

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| POST | `/api/auth/login` | `{ email, password }` | `{ user, token }` |
| POST | `/api/auth/recuperar` | `{ email }` | `{ ok, message, resetToken? }` (token solo en dev) |
| POST | `/api/auth/restablecer` | `{ token, password, confirmPassword }` | `{ ok }` |
| GET | `/api/auth/me` | — | `{ user }` |
| POST | `/api/auth/logout` | — | `{ ok }` |

Usuario: `{ id, nombre, email, telefono, empresa, fotoUrl, calificacion, gestionesCompletadas, gestionesCanceladas }`

## Perfil

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| GET | `/api/perfil` | — | `{ user }` |
| PATCH | `/api/perfil` | `{ nombre?, telefono?, fotoUrl? }` | `{ user }` |

## Gestiones

| Método | Ruta | Respuesta |
|--------|------|-----------|
| GET | `/api/gestiones` | `{ gestiones: Gestion[] }` |
| GET | `/api/gestiones/[id]` | `{ gestion: GestionDetalle }` |
| POST | `/api/gestiones/[id]/iniciar` | `{ gestion }` |
| POST | `/api/gestiones/[id]/cancelar` | `{ gestion }` |
| POST | `/api/gestiones/[id]/completar` | `{ gestion }` |
| GET | `/api/gestiones/[id]/qr` | `{ codigo, payload }` |

`Gestion`: id, titulo, descripcion, estado, fechaProgramada, receptorNombre, receptorDireccion, emisorNombre, progreso (0-100).

`GestionDetalle` añade: indicaciones, precauciones, empresaEnvio, origenLat/Lng/Nombre, destinoLat/Lng, emisorDireccion.

Estados: `PENDIENTE` | `EN_CURSO` | `COMPLETADA` | `CANCELADA`.

## Chat

| Método | Ruta | Query/Body | Respuesta |
|--------|------|------------|-----------|
| GET | `/api/chat/conversaciones` | `?filtro=managers\|consumers` | `{ conversaciones }` |
| GET | `/api/chat/conversaciones/[id]/mensajes` | — | `{ mensajes }` |
| POST | `/api/chat/conversaciones/[id]/mensajes` | `{ contenido }` | `{ mensaje }` |

Conversación: `{ id, contactoNombre, contactoFotoUrl, ultimoMensaje, rolContacto, actualizadoEn }`  
Mensaje: `{ id, contenido, enviadoEn, esMio, autorNombre }`
