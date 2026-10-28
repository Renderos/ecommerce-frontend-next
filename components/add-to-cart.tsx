"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { cart } from "./cart-store";

type Props = {
  product: Pick<Product, "id" | "name" | "price" | "image_url" | "stock">;
  withQuantity?: boolean;
};

export function AddToCart({ product, withQuantity = false }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const max = Math.min(product.stock, 50);

  if (product.stock <= 0) {
    return (
      <button disabled className="btn btn-secondary w-full">
        Agotado
      </button>
    );
  }

  function add() {
    cart.add(
      { product_id: product.id, name: product.name, price: product.price, image_url: product.image_url, stock: product.stock },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex gap-2">
      {withQuantity && (
        <label className="sr-only" htmlFor={`qty-${product.id}`}>
          Cantidad
        </label>
      )}
      {withQuantity && (
        <input
          id={`qty-${product.id}`}
          type="number"
          min={1}
          max={max}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(max, Number(e.target.value) || 1)))}
          className="input w-20 text-center"
        />
      )}
      <button onClick={add} className="btn btn-primary flex-1" aria-live="polite">
        {added ? "✓ Agregado" : "Agregar al carrito"}
      </button>
    </div>
  );
}
