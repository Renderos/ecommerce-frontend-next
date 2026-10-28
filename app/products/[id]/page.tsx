import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { ProductImage } from "@/components/product-image";
import { DetailSkeleton } from "@/components/skeletons";
import { getProduct } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const product = await getProduct((await params).id);
  return product
    ? { title: product.name, description: product.description?.slice(0, 160) ?? undefined }
    : { title: "Producto no encontrado" };
}

export default function ProductPage({ params }: PageProps<"/products/[id]">) {
  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← Volver al catálogo
      </Link>
      <Suspense fallback={<DetailSkeleton />}>
        <ProductDetail id={params.then((p) => p.id)} />
      </Suspense>
    </div>
  );
}

async function ProductDetail({ id }: { id: Promise<string> }) {
  const product = await getProduct(await id);
  if (!product) notFound();

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-line bg-surface-2">
        <ProductImage product={product} sizes="(min-width: 768px) 50vw, 100vw" priority="high" />
      </div>
      <div className="flex flex-col gap-5">
        <div>
          {product.category && (
            <p className="text-sm font-medium uppercase tracking-wide text-muted">{product.category}</p>
          )}
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="mt-1 font-mono text-xs text-muted">SKU {product.sku}</p>
        </div>
        <p className="text-3xl font-bold tabular-nums">{formatMoney(product.price)}</p>
        <p className={product.in_stock ? "text-sm text-ok" : "text-sm text-danger"}>
          {product.in_stock ? `${product.stock} unidades disponibles` : "Sin stock por ahora"}
        </p>
        {product.description && <p className="leading-relaxed text-muted">{product.description}</p>}
        <AddToCart product={product} withQuantity />
        <Link href="/cart" className="text-center text-sm text-accent underline">
          Ir al carrito
        </Link>
      </div>
    </article>
  );
}
