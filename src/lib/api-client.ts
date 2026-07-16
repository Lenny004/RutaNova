/**
 * Cliente HTTP tipado para consumir las APIs de RutaNova desde el navegador.
 */
import type {
  Conversacion,
  FiltroChat,
  Gestion,
  GestionDetalle,
  Mensaje,
  Usuario,
} from "@/types/dominio";

export type {
  Conversacion,
  Gestion,
  GestionDetalle,
  Mensaje,
  Usuario,
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function solicitarJson<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  const encabezados: HeadersInit = {
    ...(opciones.body ? { "Content-Type": "application/json" } : {}),
    ...opciones.headers,
  };

  const respuesta = await fetch(ruta, {
    ...opciones,
    credentials: "include",
    headers: encabezados,
  });

  const cuerpo = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const mensaje =
      typeof cuerpo.error === "string"
        ? cuerpo.error
        : "Error en la solicitud";
    throw new ApiError(respuesta.status, mensaje);
  }

  return cuerpo as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      solicitarJson<{ user: Usuario; token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    me: () => solicitarJson<{ user: Usuario }>("/api/auth/me"),

    logout: () =>
      solicitarJson<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),

    recuperar: (email: string) =>
      solicitarJson<{ ok: boolean; message: string; resetToken?: string }>(
        "/api/auth/recuperar",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        },
      ),

    restablecer: (
      token: string,
      password: string,
      confirmPassword: string,
    ) =>
      solicitarJson<{ ok: boolean }>("/api/auth/restablecer", {
        method: "POST",
        body: JSON.stringify({ token, password, confirmPassword }),
      }),
  },

  perfil: {
    obtener: () => solicitarJson<{ user: Usuario }>("/api/perfil"),

    actualizar: (datos: { nombre?: string; telefono?: string }) =>
      solicitarJson<{ user: Usuario }>("/api/perfil", {
        method: "PATCH",
        body: JSON.stringify(datos),
      }),
  },

  gestiones: {
    listar: () => solicitarJson<{ gestiones: Gestion[] }>("/api/gestiones"),

    obtener: (id: string) =>
      solicitarJson<{ gestion: GestionDetalle }>(`/api/gestiones/${id}`),

    iniciar: (id: string) =>
      solicitarJson<{ gestion: GestionDetalle }>(
        `/api/gestiones/${id}/iniciar`,
        { method: "POST" },
      ),

    cancelar: (id: string) =>
      solicitarJson<{ gestion: GestionDetalle }>(
        `/api/gestiones/${id}/cancelar`,
        { method: "POST" },
      ),

    qr: (id: string) =>
      solicitarJson<{ codigo: string; payload: string }>(
        `/api/gestiones/${id}/qr`,
      ),
  },

  chat: {
    conversaciones: (filtro: FiltroChat) =>
      solicitarJson<{ conversaciones: Conversacion[] }>(
        `/api/chat/conversaciones?filtro=${filtro}`,
      ),

    mensajes: (id: string) =>
      solicitarJson<{ mensajes: Mensaje[] }>(
        `/api/chat/conversaciones/${id}/mensajes`,
      ),

    enviar: (id: string, contenido: string) =>
      solicitarJson<{ mensaje: Mensaje }>(
        `/api/chat/conversaciones/${id}/mensajes`,
        {
          method: "POST",
          body: JSON.stringify({ contenido }),
        },
      ),
  },
};

/** Reexportaciones geo para no romper imports existentes. */
export {
  SAN_SALVADOR_CENTER,
  wazeDeepLink,
} from "@/lib/geo/coordenadas";
