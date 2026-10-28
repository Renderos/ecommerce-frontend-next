import "server-only";

import type { ApiEnvelope } from "./types";

const BASE_URL = (process.env.API_BASE_URL ?? "http://localhost:8000/api").replace(/\/+$/, "");

/** Error normalizado a partir del formato de error de la API ({ message, error_code, errors }). */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiOptions = Omit<RequestInit, "body"> & {
  token?: string;
  body?: unknown;
};

/**
 * Cliente HTTP del lado servidor. El token Bearer viaja solo entre Next.js y Laravel;
 * nunca se expone al navegador.
 */
export async function api<T>(path: string, { token, body, headers, ...init }: ApiOptions = {}): Promise<ApiEnvelope<T>> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("No se pudo conectar con la API. Verifica que el servidor esté en línea.", 503, "NETWORK_ERROR");
  }

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    throw new ApiError(
      json?.message ?? `La API respondió con estado ${res.status}.`,
      res.status,
      json?.error_code,
      json?.errors,
    );
  }

  return json as ApiEnvelope<T>;
}
