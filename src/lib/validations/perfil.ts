import { z } from "zod";

export const actualizarPerfilSchema = z
  .object({
    nombre: z.string().min(1, "El nombre no puede estar vacío").optional(),
    telefono: z.string().nullable().optional(),
    fotoUrl: z.string().url("URL de foto inválida").nullable().optional(),
  })
  .refine(
    (data) =>
      data.nombre !== undefined ||
      data.telefono !== undefined ||
      data.fotoUrl !== undefined,
    { message: "Debes enviar al menos un campo para actualizar" },
  );
