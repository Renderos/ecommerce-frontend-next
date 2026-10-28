"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createOrderAction } from "@/app/actions/orders";
import { formatMoney } from "@/lib/format";
import type { FormState } from "@/lib/types";
import { useCart, useHydrated } from "./cart-store";
import { FieldError, FormMessage } from "./form-message";
import { ListSkeleton } from "./skeletons";
import { SubmitButton } from "./submit-button";

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const hydrated = useHydrated();
  const [state, action] = useActionState(createOrderAction, {} as FormState);

  if (!hydrated) return <ListSkeleton rows={2} />;

  if (items.length === 0) {
    return (
      <div className="card text-center">
        <p className="font-semibold">No hay productos en tu carrito.</p>
        <Link href="/" className="btn btn-primary mt-4">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  // Solo viajan IDs y cantidades: precios y totales los calcula la API
  const payload = JSON.stringify(items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })));

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="card space-y-4">
        <h2 className="font-semibold">Datos de envío</h2>
        <FormMessage state={state} />
        <input type="hidden" name="items" value={payload} />
        <div>
          <label htmlFor="shipping_address" className="label">
            Dirección de envío
          </label>
          <textarea
            id="shipping_address"
            name="shipping_address"
            rows={3}
            maxLength={255}
            required
            defaultValue={state.fields?.shipping_address}
            placeholder="Calle, número, colonia, ciudad"
            className="input"
          />
          <FieldError state={state} name="shipping_address" />
        </div>
        <div>
          <label htmlFor="notes" className="label">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            maxLength={500}
            defaultValue={state.fields?.notes}
            className="input"
          />
        </div>
      </div>

      <aside className="card h-fit space-y-4">
        <h2 className="font-semibold">Tu pedido</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.product_id} className="flex justify-between gap-3">
              <span>
                {i.name} <span className="text-muted">× {i.quantity}</span>
              </span>
              <span className="tabular-nums">{formatMoney(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line pt-3 font-semibold">
          <span>Subtotal estimado</span>
          <span className="tabular-nums">{formatMoney(subtotal)}</span>
        </div>
        <SubmitButton pendingText="Creando orden…">Crear orden y continuar al pago</SubmitButton>
        <Link href="/cart" className="block text-center text-sm text-muted hover:text-ink">
          Editar carrito
        </Link>
      </aside>
    </form>
  );
}
