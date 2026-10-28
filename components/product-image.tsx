import Image from "next/image";
import type { Product } from "@/lib/types";

const ALLOWED_HOSTS = ["placehold.co", "images.unsplash.com", "picsum.photos"];

/**
 * next/image optimiza (AVIF/WebP, tamaños responsivos, lazy loading) y reserva
 * espacio con `fill` + contenedor con aspect-ratio, evitando CLS.
 *
 * priority: "high" para la imagen LCP (fetchpriority=high), "eager" para el resto
 * de imágenes visibles sin hacer scroll; por defecto lazy.
 */
export function ProductImage({
  product,
  sizes,
  priority,
  className = "",
}: {
  product: Pick<Product, "name" | "image_url">;
  sizes: string;
  priority?: "high" | "eager";
  className?: string;
}) {
  let host = "";
  try {
    host = product.image_url ? new URL(product.image_url).hostname : "";
  } catch {}

  if (!product.image_url || !ALLOWED_HOSTS.includes(host)) {
    return (
      <div className="flex size-full items-center justify-center text-4xl font-bold text-muted/40" aria-hidden>
        {product.name.charAt(0)}
      </div>
    );
  }

  return (
    <Image
      src={product.image_url}
      alt={product.name}
      fill
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority === "high" ? "high" : undefined}
      className={`object-cover ${className}`}
    />
  );
}
