import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "rutanova_token";
const TOKEN_TTL = "7d";

export type SessionUser = {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  fotoUrl: string | null;
  calificacion: number;
  gestionesCompletadas: number;
  gestionesCanceladas: number;
  ubicacionLat: number | null;
  ubicacionLng: number | null;
  ubicacionDireccion: string | null;
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no está configurado");
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export function toSessionUser(user: {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  fotoUrl: string | null;
  calificacion: number;
  gestionesCompletadas: number;
  gestionesCanceladas: number;
  ubicacionLat: number | null;
  ubicacionLng: number | null;
  ubicacionDireccion: string | null;
}): SessionUser {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    telefono: user.telefono,
    empresa: user.empresa,
    fotoUrl: user.fotoUrl,
    calificacion: user.calificacion,
    gestionesCompletadas: user.gestionesCompletadas,
    gestionesCanceladas: user.gestionesCanceladas,
    ubicacionLat: user.ubicacionLat,
    ubicacionLng: user.ubicacionLng,
    ubicacionDireccion: user.ubicacionDireccion,
  };
}

export async function getUserFromToken(token: string | undefined | null) {
  if (!token) return null;
  const userId = await verifyToken(token);
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? toSessionUser(user) : null;
}

export function extractTokenFromRequest(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return request.cookies.get(COOKIE_NAME)?.value ?? null;
}

export async function requireUser(request: NextRequest) {
  const token = extractTokenFromRequest(request);
  const user = await getUserFromToken(token);
  if (!user) {
    return { user: null as SessionUser | null, error: "No autenticado" };
  }
  return { user, error: null as string | null };
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
