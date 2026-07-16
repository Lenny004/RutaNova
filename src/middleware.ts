import { NextResponse, type NextRequest } from "next/server";

const RUTAS_PUBLICAS = [
  "/login",
  "/recuperar",
  "/api/auth/login",
  "/api/auth/recuperar",
  "/api/auth/restablecer",
];

function esRutaPublica(pathname: string): boolean {
  return RUTAS_PUBLICAS.some(
    (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`),
  );
}

/**
 * Guard ligero de cookie de sesión.
 * La validación JWT completa sigue en AuthProvider / requireUser.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("rutanova_token")?.value;
  const publica = esRutaPublica(pathname);

  if (!token && !publica && !pathname.startsWith("/api/")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && (pathname === "/login" || pathname.startsWith("/recuperar"))) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
