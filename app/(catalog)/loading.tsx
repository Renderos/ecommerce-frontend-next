import { FiltersForm } from "@/components/catalog-filters";
import { ProductGridSkeleton } from "@/components/skeletons";

// Fallback del segmento del catálogo mientras se resuelve la navegación
export default function CatalogLoading() {
  return (
    <div className="space-y-8">
      <div className="skeleton h-44 w-full rounded-3xl" />
      <FiltersForm />
      <ProductGridSkeleton />
    </div>
  );
}
