import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthPayload, User } from "./types";

// Ambas cookies son httpOnly: JavaScript del navegador no puede leerlas (mitiga XSS).
export const TOKEN_COOKIE = "shop_token";
const USER_COOKIE = "shop_user";

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 días si la API no define expiración

export type SessionUser = Pick<User, "id" | "name" | "email" | "role">;

export async function createSession({ token, user, expires_at }: AuthPayload) {
  const store = await cookies();
  const expires = expires_at ? new Date(expires_at) : new Date(Date.now() + DEFAULT_MAX_AGE * 1000);
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };

  const sessionUser: SessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  store.set(TOKEN_COOKIE, token, options);
  store.set(USER_COOKIE, JSON.stringify(sessionUser), options);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(USER_COOKIE);
}

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

/** Usuario guardado al iniciar sesión (evita llamar a /auth/me en cada render del navbar). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const raw = (await cookies()).get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

/** Para vistas protegidas: devuelve el token o redirige al login. */
export async function requireToken(next: string): Promise<string> {
  const token = await getToken();
  if (!token) redirect(`/login?next=${encodeURIComponent(next)}`);
  return token;
}
