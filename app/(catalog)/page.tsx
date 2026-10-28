import Link from "next/link";
import { Suspense } from "react";
import { CatalogFilters, FiltersForm } from "@/components/catalog-filters";
import { Pagination } from "@/components/pagination";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/skeletons";
import { getProducts } from "@/lib/data";
import type { ProductFilters } from "@/lib/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function parseFilters(sp: Awaited<SearchParams>): ProductFilters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  const sort = one(sp.sort);
  return {
    search: one(sp.search)?.slice(0, 100),
    category: one(sp.category),
    sort: sort && ["name", "-name", "price", "-price", "-created_at"].includes(sort) ? sort : undefined,
    in_stock: one(sp.in_stock) === "1",
    page: Math.max(1, Number(one(sp.page)) || 1),
  };
}

export default function CatalogPage({ searchParams }: PageProps<"/">) {
  return (
    <div className="space-y-8">
      {/* Contenido estático: forma parte del shell prerenderizado (LCP rápido) */}
      <section className="rounded-3xl bg-accent px-6 py-10 text-accent-fg sm:px-10">
        <p className="text-sm font-medium uppercase tracking-widest opacity-80">Catálogo</p>
        <h1 className="mt-2 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
          Productos seleccionados, pago seguro con Stripe.
        </h1>
        <p className="mt-3 max-w-lg opacity-90">Agrega al carrito, crea tu orden y paga en segundos.</p>
      </section>

      <Suspense fallback={<FiltersForm />}>
        <CatalogFilters searchParams={searchParams.then(parseFilters)} />
      </Suspense>

      {/* Sección pesada: el listado se transmite en streaming detrás de su propio Suspense */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid filtersPromise={searchParams.then(parseFilters)} />
      </Suspense>
    </div>
  );
}

async function ProductGrid({ filtersPromise }: { filtersPromise: Promise<ProductFilters> }) {
  const filters = await filtersPromise;
  const { data: products, meta } = await getProducts(filters);

  if (products.length === 0) {
    return (
      <div className="card text-center">
        <p className="font-semibold">No encontramos productos con esos filtros.</p>
        <Link href="/" className="mt-3 inline-block text-sm text-accent underline">
          Ver todo el catálogo
        </Link>
      </div>
    );
  }

  return (
    <section aria-label="Productos" className="space-y-6">
      <p className="text-sm text-muted">
        {meta.total} {meta.total === 1 ? "producto" : "productos"}
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          // Las primeras imágenes (above the fold) se cargan con prioridad para mejorar el LCP
          <ProductCard key={p.id} product={p} priority={i === 0 ? "high" : i < 4 ? "eager" : undefined} />
        ))}
      </div>
      <Pagination meta={meta} filters={filters} />
    </section>
  );
}
