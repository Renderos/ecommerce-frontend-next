import { getCategories } from "@/lib/data";
import type { ProductFilters } from "@/lib/types";

/** Lee los filtros de la URL y las categorías (cacheadas). */
export async function CatalogFilters({ searchParams }: { searchParams: Promise<ProductFilters> }) {
  const filters = await searchParams;
  const categories = await getCategories();
  return <FiltersForm filters={filters} categories={categories} />;
}

/**
 * Formulario GET: funciona sin JavaScript y deja los filtros en la URL (compartibles).
 * También se usa como fallback de Suspense con valores vacíos: mismo alto = sin CLS.
 */
export function FiltersForm({ filters = {}, categories = [] }: { filters?: ProductFilters; categories?: string[] }) {
  return (
    <form method="get" role="search" className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-3">
      <div className="min-w-48 flex-1">
        <label htmlFor="search" className="sr-only">
          Buscar
        </label>
        <input
          id="search"
          name="search"
          type="search"
          defaultValue={filters.search}
          placeholder="Buscar por nombre, descripción o SKU…"
          className="input"
        />
      </div>
      <div>
        <label htmlFor="category" className="sr-only">
          Categoría
        </label>
        <select id="category" name="category" defaultValue={filters.category ?? ""} className="input">
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="sort" className="sr-only">
          Ordenar
        </label>
        <select id="sort" name="sort" defaultValue={filters.sort ?? ""} className="input">
          <option value="">Nombre (A-Z)</option>
          <option value="price">Precio: menor a mayor</option>
          <option value="-price">Precio: mayor a menor</option>
          <option value="-created_at">Más recientes</option>
        </select>
      </div>
      <label className="flex items-center gap-2 px-2 py-2.5 text-sm">
        <input type="checkbox" name="in_stock" value="1" defaultChecked={filters.in_stock} className="size-4 accent-accent" />
        Solo con stock
      </label>
      <button type="submit" className="btn btn-primary">
        Filtrar
      </button>
    </form>
  );
}
