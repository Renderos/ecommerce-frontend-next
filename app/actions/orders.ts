"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { TAGS } from "@/lib/data";
import { destroySession, getToken } from "@/lib/session";
import type { FormState, Order, PayResult } from "@/lib/types";

async function tokenOrLogin(next: string) {
  const token = await getToken();
  if (!token) redirect(`/login?next=${encodeURIComponent(next)}`);
  return token;
}

async function handleError(e: unknown, next: string): Promise<FormState> {
  if (e instanceof ApiError) {
    if (e.status === 401) {
      await destroySession();
      redirect(`/login?next=${encodeURIComponent(next)}&expired=1`);
    }
    return { message: e.message, errors: e.errors };
  }
  return { message: "Ocurrió un error inesperado. Intenta de nuevo." };
}

/** Invalida todo lo que cambia cuando una orden cambia de estado. */
function refreshAfterOrderChange(order: Pick<Order, "id">, productIds: number[] = []) {
  // El stock reservado/liberado cambia el catálogo: updateTag garantiza "read-your-own-writes"
  updateTag(TAGS.products);
  productIds.forEach((id) => updateTag(TAGS.product(id)));
  // Vistas privadas (no cacheadas en servidor): se purga el Router Cache del cliente
  revalidatePath("/orders");
  revalidatePath(`/orders/${order.id}`);
  revalidatePath(`/checkout/${order.id}`);
}

type CartLine = { product_id: number; quantity: number };

function parseItems(raw: FormDataEntryValue | null): CartLine[] | null {
  try {
    const items = JSON.parse(String(raw ?? "[]"));
    if (!Array.isArray(items) || items.length === 0) return null;
    const lines = items.map((i) => ({ product_id: Number(i.product_id), quantity: Number(i.quantity) }));
    const valid = lines.every((l) => Number.isInteger(l.product_id) && Number.isInteger(l.quantity) && l.quantity > 0);
    return valid ? lines : null;
  } catch {
    return null;
  }
}

export async function createOrderAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token = await tokenOrLogin("/checkout");
  const fields = {
    shipping_address: String(formData.get("shipping_address") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };
  const items = parseItems(formData.get("items"));
  if (!items) return { message: "Tu carrito está vacío o no es válido.", fields };

  let order: Order;
  try {
    // Solo se envían IDs y cantidades: la API toma los precios del catálogo
    const res = await api<Order>("/orders", {
      method: "POST",
      token,
      body: { items, shipping_address: fields.shipping_address || null, notes: fields.notes || null },
    });
    order = res.data;
  } catch (e) {
    return { ...(await handleError(e, "/checkout")), fields };
  }

  refreshAfterOrderChange(order, items.map((i) => i.product_id));
  redirect(`/checkout/${order.id}?new=1`);
}

export async function payOrderAction(orderId: number, _prev: FormState, formData: FormData): Promise<FormState> {
  const next = `/checkout/${orderId}`;
  const token = await tokenOrLogin(next);
  const paymentMethod = String(formData.get("payment_method") ?? "");

  if (!/^pm_[A-Za-z0-9_]+$/.test(paymentMethod)) {
    return { message: "Selecciona un método de pago válido." };
  }

  let result: PayResult;
  try {
    const res = await api<PayResult>(`/orders/${orderId}/pay`, {
      method: "POST",
      token,
      body: { payment_method: paymentMethod },
    });
    result = res.data;
  } catch (e) {
    // Una tarjeta rechazada deja la orden en "failed": también hay que refrescar el historial
    refreshAfterOrderChange({ id: orderId });
    return handleError(e, next);
  }

  refreshAfterOrderChange(result.order);

  if (result.payment.status !== "succeeded") {
    return {
      message: result.requires_action
        ? "El banco requiere autenticación 3D Secure. Usa otra tarjeta de prueba."
        : `El pago quedó en estado "${result.payment.status}". Revisa tu historial en unos segundos.`,
    };
  }

  redirect(`/checkout/${orderId}/success`);
}

export async function cancelOrderAction(orderId: number): Promise<FormState> {
  const next = `/orders/${orderId}`;
  const token = await tokenOrLogin(next);

  let order: Order;
  try {
    order = (await api<Order>(`/orders/${orderId}/cancel`, { method: "POST", token })).data;
  } catch (e) {
    return handleError(e, next);
  }

  refreshAfterOrderChange(order, order.items?.map((i) => i.product_id));
  return { ok: true, message: "Orden cancelada. El stock fue liberado." };
}
