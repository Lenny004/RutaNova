export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  fotoUrl: string | null;
  calificacion: number;
  gestionesCompletadas: number;
  gestionesCanceladas: number;
  ubicacionLat?: number | null;
  ubicacionLng?: number | null;
  ubicacionDireccion?: string | null;
};

export type Gestion = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: "PENDIENTE" | "EN_CURSO" | "COMPLETADA" | "CANCELADA";
  fechaProgramada: string;
  receptorNombre: string;
  receptorDireccion: string;
  emisorNombre: string;
  progreso: number;
};

export type GestionDetalle = Gestion & {
  indicaciones: string | null;
  precauciones: string | null;
  empresaEnvio: string | null;
  origenLat: number | null;
  origenLng: number | null;
  origenNombre: string | null;
  destinoLat: number | null;
  destinoLng: number | null;
  emisorDireccion: string | null;
};

export type Conversacion = {
  id: string;
  contactoNombre: string;
  contactoFotoUrl: string | null;
  ultimoMensaje: string | null;
  rolContacto: "MANAGER" | "CONSUMER";
  actualizadoEn: string;
};

export type Mensaje = {
  id: string;
  contenido: string;
  enviadoEn: string;
  esMio: boolean;
  autorNombre: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  const response = await fetch(path, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Error en la solicitud";
    throw new ApiError(response.status, message);
  }

  return data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: Usuario; token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    me: () => request<{ user: Usuario }>("/api/auth/me"),

    logout: () =>
      request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),

    recuperar: (email: string) =>
      request<{ ok: boolean; message: string; resetToken?: string }>(
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
      request<{ ok: boolean }>("/api/auth/restablecer", {
        method: "POST",
        body: JSON.stringify({ token, password, confirmPassword }),
      }),
  },

  perfil: {
    obtener: () => request<{ user: Usuario }>("/api/perfil"),

    actualizar: (datos: { nombre?: string; telefono?: string }) =>
      request<{ user: Usuario }>("/api/perfil", {
        method: "PATCH",
        body: JSON.stringify(datos),
      }),
  },

  gestiones: {
    listar: () => request<{ gestiones: Gestion[] }>("/api/gestiones"),

    obtener: (id: string) =>
      request<{ gestion: GestionDetalle }>(`/api/gestiones/${id}`),

    iniciar: (id: string) =>
      request<{ gestion: GestionDetalle }>(`/api/gestiones/${id}/iniciar`, {
        method: "POST",
      }),

    cancelar: (id: string) =>
      request<{ gestion: GestionDetalle }>(`/api/gestiones/${id}/cancelar`, {
        method: "POST",
      }),

    qr: (id: string) =>
      request<{ codigo: string; payload: string }>(
        `/api/gestiones/${id}/qr`,
      ),
  },

  chat: {
    conversaciones: (filtro: "managers" | "consumers") =>
      request<{ conversaciones: Conversacion[] }>(
        `/api/chat/conversaciones?filtro=${filtro}`,
      ),

    mensajes: (id: string) =>
      request<{ mensajes: Mensaje[] }>(
        `/api/chat/conversaciones/${id}/mensajes`,
      ),

    enviar: (id: string, contenido: string) =>
      request<{ mensaje: Mensaje }>(
        `/api/chat/conversaciones/${id}/mensajes`,
        {
          method: "POST",
          body: JSON.stringify({ contenido }),
        },
      ),
  },
};

export const SAN_SALVADOR_CENTER = { lat: 13.6929, lng: -89.2182 };

export function wazeDeepLink(lat: number, lng: number): string {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}
