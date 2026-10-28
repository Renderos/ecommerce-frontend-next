"use client";

import Link from "next/link";
import { useCart } from "./cart-store";

export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-surface-2"
      aria-label={`Carrito, ${count} artículos`}
    >
      <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
      </svg>
      <span className="hidden sm:inline">Carrito</span>
      <span className="min-w-5 rounded-full bg-accent px-1.5 text-center text-xs font-semibold text-accent-fg tabular-nums">
        {count}
      </span>
    </Link>
  );
}
