import { z } from "zod";
import { jsonError } from "@/lib/http";

export async function parseBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<
  { data: z.infer<T>; error: null } | { data: null; error: Response }
> {
  try {
    const json: unknown = await request.json();
    const result = schema.safeParse(json);
    if (!result.success) {
      const message = result.error.errors.map((issue) => issue.message).join(", ");
      return { data: null, error: jsonError(message, 422) };
    }
    return { data: result.data, error: null };
  } catch {
    return { data: null, error: jsonError("Cuerpo JSON inválido", 400) };
  }
}

export function parseQuery<T extends z.ZodType>(
  searchParams: URLSearchParams,
  schema: T,
):
  | { data: z.infer<T>; error: null }
  | { data: null; error: Response } {
  const raw = Object.fromEntries(searchParams.entries());
  const result = schema.safeParse(raw);
  if (!result.success) {
    const message = result.error.errors.map((issue) => issue.message).join(", ");
    return { data: null, error: jsonError(message, 422) };
  }
  return { data: result.data, error: null };
}
