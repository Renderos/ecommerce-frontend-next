"use client";

import { useEffect } from "react";
import { cart } from "./cart-store";

/** La orden ya existe en la API: el carrito local deja de ser necesario. */
export function ClearCart() {
  useEffect(() => {
    cart.clear();
  }, []);
  return null;
}
