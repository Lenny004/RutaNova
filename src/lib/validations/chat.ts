import { z } from "zod";

export const conversacionesQuerySchema = z.object({
  filtro: z.enum(["managers", "consumers"], {
    errorMap: () => ({ message: "El filtro debe ser managers o consumers" }),
  }),
});

export const crearMensajeSchema = z.object({
  contenido: z
    .string()
    .min(1, "El mensaje no puede estar vacío")
    .max(2000, "El mensaje es demasiado largo"),
});
