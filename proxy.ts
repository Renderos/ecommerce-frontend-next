import { NextResponse, type NextRequest } from "next/server";

const TOKEN_COOKIE = "shop_token";
const PROTECTED = ["/checkout", "/orders"];
const GUEST_ONLY = ["/login", "/register"];

/**
 * Chequeo optimista de sesión (solo presencia de la cookie httpOnly).
 * La validación real del token la hace la API en cada request.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(TOKEN_COOKIE);

  if (!hasSession && PROTECTED.some((p) => pathname.startsWith(p))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  // ?expired=1 llega cuando la API rechazó el token: dejar pasar para volver a iniciar sesión
  if (hasSession && GUEST_ONLY.includes(pathname) && !request.nextUrl.searchParams.has("expired")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/login", "/register"],
};
