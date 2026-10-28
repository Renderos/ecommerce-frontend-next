"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  product_id: number;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  quantity: number;
};

const KEY = "shop_cart_v1";
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();
let cache: CartItem[] | null = null;

function read(): CartItem[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: CartItem[]) {
  cache = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Modo privado o almacenamiento lleno: el carrito sigue vivo en memoria
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Sincroniza el carrito entre pestañas
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const cart = {
  add(item: Omit<CartItem, "quantity">, quantity = 1) {
    const items = read();
    const existing = items.find((i) => i.product_id === item.product_id);
    const max = Math.min(item.stock, 50); // la API limita 50 unidades por línea
    write(
      existing
        ? items.map((i) =>
            i.product_id === item.product_id ? { ...i, ...item, quantity: Math.min(i.quantity + quantity, max) } : i,
          )
        : [...items, { ...item, quantity: Math.min(quantity, max) }],
    );
  },
  setQuantity(productId: number, quantity: number) {
    write(
      read()
        .map((i) => (i.product_id === productId ? { ...i, quantity: Math.min(quantity, i.stock, 50) } : i))
        .filter((i) => i.quantity > 0),
    );
  },
  remove(productId: number) {
    write(read().filter((i) => i.product_id !== productId));
  },
  clear() {
    write([]);
  },
};

/** Estado del carrito. En el servidor (y en la hidratación) devuelve un carrito vacío. */
export function useCart() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return { items, count, subtotal };
}

/** true después de hidratar: evita mostrar "carrito vacío" antes de leer localStorage. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
