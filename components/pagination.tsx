import Link from "next/link";
import type { PaginationMeta } from "@/lib/types";

type Query = Record<string, string | number | boolean | undefined>;

function href(base: string, query: Query, page: number) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === false || v === "" || k === "page") continue;
    qs.set(k, v === true ? "1" : String(v));
  }
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

export function Pagination({ meta, filters, base = "/" }: { meta: PaginationMeta; filters: Query; base?: string }) {
  if (meta.last_page <= 1) return null;
  const { current_page: page, last_page: last } = meta;

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(base, filters, page - 1)} className="btn btn-secondary">
          ← Anterior
        </Link>
      ) : (
        <span className="btn btn-secondary opacity-50">← Anterior</span>
      )}
      <span className="px-3 text-sm text-muted tabular-nums">
        Página {page} de {last}
      </span>
      {page < last ? (
        <Link href={href(base, filters, page + 1)} className="btn btn-secondary">
          Siguiente →
        </Link>
      ) : (
        <span className="btn btn-secondary opacity-50">Siguiente →</span>
      )}
    </nav>
  );
}
