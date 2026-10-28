import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/lib/api";
import { destroySession, getToken } from "@/lib/session";

/**
 * Route Handler de cierre de sesión: revoca el token en la API (Sanctum)
 * y elimina las cookies httpOnly. Se invoca con un <form method="post">.
 */
export async function POST(request: NextRequest) {
  const token = await getToken();
  if (token) {
    // Si la API falla, igual se cierra la sesión local
    await api("/auth/logout", { method: "POST", token }).catch(() => null);
  }
  await destroySession();

  return NextResponse.redirect(new URL("/", request.url), 303);
}
