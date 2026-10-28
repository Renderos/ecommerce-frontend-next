import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-lg text-center">
      <p className="text-5xl font-bold text-muted">404</p>
      <h1 className="mt-3 text-lg font-semibold">No encontramos lo que buscas</h1>
      <p className="mt-2 text-sm text-muted">El producto u orden no existe o no tienes acceso.</p>
      <Link href="/" className="btn btn-primary mt-6">
        Volver al catálogo
      </Link>
    </div>
  );
}
