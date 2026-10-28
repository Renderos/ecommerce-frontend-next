"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { cart, useCart, useHydrated } from "./cart-store";
import { ListSkeleton } from "./skeletons";

export function CartView() {
  const { items, count, subtotal } = useCart();
  const hydrated = useHydrated();

  if (!hydrated) return <ListSkeleton rows={3} />;

  if (items.length === 0) {
    return (
      <div className="card text-center">
        <p className="font-semibold">Tu carrito está vacío.</p>
        <Link href="/" className="btn btn-primary mt-4">
          Explorar el catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {items.map((item) => (
          <li key={item.product_id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-40 flex-1">
              <Link href={`/products/${item.product_id}`} className="font-semibold hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-muted tabular-nums">{formatMoney(item.price)} c/u</p>
            </div>
            <div className="flex items-center rounded-xl border border-line" role="group" aria-label={`Cantidad de ${item.name}`}>
              <button
                onClick={() => cart.setQuantity(item.product_id, item.quantity - 1)}
                className="px-3 py-2 hover:bg-surface-2"
                aria-label="Quitar uno"
              >
                −
              </button>
              <span className="w-10 text-center tabular-nums" aria-live="polite">
                {item.quantity}
              </span>
              <button
                onClick={() => cart.setQuantity(item.product_id, item.quantity + 1)}
                disabled={item.quantity >= Math.min(item.stock, 50)}
                className="px-3 py-2 hover:bg-surface-2 disabled:opacity-40"
                aria-label="Agregar uno"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-semibold tabular-nums">{formatMoney(item.price * item.quantity)}</p>
            <button
              onClick={() => cart.remove(item.product_id)}
              className="text-sm text-danger hover:underline"
              aria-label={`Eliminar ${item.name} del carrito`}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <aside className="card h-fit space-y-4">
        <h2 className="font-semibold">Resumen</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Artículos</dt>
            <dd className="tabular-nums">{count}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatMoney(subtotal)}</dd>
          </div>
        </dl>
        <p className="text-xs text-muted">Impuestos y total final los calcula la API al crear la orden.</p>
        <Link href="/checkout" className="btn btn-primary w-full">
          Continuar al checkout
        </Link>
        <button onClick={() => cart.clear()} className="btn btn-secondary w-full">
          Vaciar carrito
        </button>
      </aside>
    </div>
  );
}
