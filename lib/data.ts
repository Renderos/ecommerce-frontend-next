import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "./api";
import { requireToken } from "./session";
import type { Order, OrderStatus, Paginated, Product, ProductFilters } from "./types";

// Tags de caché que invalidan las Server Actions tras una mutación
export const TAGS = {
  products: "products",
  product: (id: number | string) => `product:${id}`,
} as const;

/* ------------------------------------------------------------------ */
/* Catálogo público: cacheado en el servidor ("use cache") con tags.   */
/* ------------------------------------------------------------------ */

export async function getProducts(filters: ProductFilters): Promise<Paginated<Product>> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("minutes");

  const qs = new URLSearchParams({ per_page: "12" });
  if (filters.search) qs.set("search", filters.search);
  if (filters.category) qs.set("category", filters.category);
  if (filters.sort) qs.set("sort", filters.sort);
  if (filters.in_stock) qs.set("in_stock", "1");
  if (filters.page && filters.page > 1) qs.set("page", String(filters.page));

  const res = await api<Product[]>(`/products?${qs}`);
  return { data: res.data, meta: res.meta! };
}

export async function getProduct(id: string): Promise<Product | null> {
  "use cache";
  cacheTag(TAGS.products, TAGS.product(id));
  cacheLife("minutes");

  if (!/^\d+$/.test(id)) return null;
  try {
    return (await api<Product>(`/products/${id}`)).data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

/** La API no expone categorías: se derivan del catálogo y se cachean más tiempo. */
export async function getCategories(): Promise<string[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("hours");

  const res = await api<Product[]>("/products?per_page=100");
  return [...new Set(res.data.map((p) => p.category).filter((c): c is string => !!c))].sort();
}

/* ------------------------------------------------------------------ */
/* Datos privados del usuario: siempre dinámicos (dependen de la       */
/* cookie), se refrescan con revalidatePath() tras cada mutación.      */
/* ------------------------------------------------------------------ */

async function authed<T>(path: string, next: string) {
  const token = await requireToken(next);
  try {
    return await api<T>(path, { token, cache: "no-store" });
  } catch (e) {
    // Token expirado o revocado: volver a iniciar sesión
    if (e instanceof ApiError && e.status === 401) redirect(`/login?next=${encodeURIComponent(next)}&expired=1`);
    throw e;
  }
}

export async function getOrders(params: { status?: OrderStatus; page?: number }): Promise<Paginated<Order>> {
  const qs = new URLSearchParams({ per_page: "10" });
  if (params.status) qs.set("status", params.status);
  if (params.page && params.page > 1) qs.set("page", String(params.page));

  const res = await authed<Order[]>(`/orders?${qs}`, "/orders");
  return { data: res.data, meta: res.meta! };
}

export async function getOrder(id: string, next: string): Promise<Order | null> {
  if (!/^\d+$/.test(id)) return null;
  try {
    return (await authed<Order>(`/orders/${id}`, next)).data;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) return null;
    throw e;
  }
}
