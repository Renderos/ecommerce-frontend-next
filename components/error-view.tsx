"use client";

import Link from "next/link";
import { useEffect } from "react";

/** UI compartida por los error.tsx de cada segmento. */
export function ErrorView({ error, retry, title }: { error: unknown; retry: () => void; title: string }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // En producción Next.js oculta el mensaje de errores del servidor; se muestra uno genérico
  const message =
    error instanceof Error && error.message && !error.message.includes("Server Components render")
      ? error.message
      : "Ocurrió un problema al cargar esta sección.";

  return (
    <div role="alert" className="card mx-auto max-w-lg text-center">
      <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-danger-bg text-xl text-danger" aria-hidden>
        !
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={() => retry()} className="btn btn-primary">
          Reintentar
        </button>
        <Link href="/" className="btn btn-secondary">
          Ir al catálogo
        </Link>
      </div>
    </div>
  );
}
