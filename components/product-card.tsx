import Link from "next/link";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AddToCart } from "./add-to-cart";
import { ProductImage } from "./product-image";

export function ProductCard({ product, priority }: { product: Product; priority?: "high" | "eager" }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <Link href={`/products/${product.id}`} className="relative block aspect-[3/2] overflow-hidden bg-surface-2">
        <ProductImage
          product={product}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="transition-transform duration-300 group-hover:scale-105"
        />
        {!product.in_stock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-surface">
            Agotado
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          {product.category && <p className="text-xs font-medium uppercase tracking-wide text-muted">{product.category}</p>}
          <h2 className="mt-1 font-semibold leading-snug">
            <Link href={`/products/${product.id}`} className="hover:underline">
              {product.name}
            </Link>
          </h2>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-bold tabular-nums">{formatMoney(product.price)}</span>
          {product.in_stock && <span className="text-xs text-muted">{product.stock} disponibles</span>}
        </div>
        <AddToCart product={product} />
      </div>
    </article>
  );
}
