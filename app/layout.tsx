import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { CartButton } from "@/components/cart-button";
import { UserMenu } from "@/components/user-menu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Mercado Seguro", template: "%s · Mercado Seguro" },
  description: "Tienda en línea construida con Next.js que consume la API de e-commerce (Laravel + Stripe).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 btn btn-primary">
          Saltar al contenido
        </a>
        <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
            <Link href="/" aria-label="Mercado Seguro, inicio" className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg" aria-hidden>
                M
              </span>
              <span className="hidden sm:inline">Mercado Seguro</span>
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium" aria-label="Principal">
              <Link href="/" className="rounded-lg px-3 py-2 hover:bg-surface-2">
                Catálogo
              </Link>
              <Link href="/orders" className="rounded-lg px-3 py-2 hover:bg-surface-2">
                Mis compras
              </Link>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <CartButton />
              {/* Lee la cookie de sesión: se transmite en streaming sin bloquear el shell estático */}
              <Suspense fallback={<div className="skeleton h-9 w-24 rounded-full" />}>
                <UserMenu />
              </Suspense>
            </div>
          </div>
        </header>
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-line py-6 text-center text-sm text-muted">
          Proyecto académico · Next.js + API Laravel 12 · Pagos en modo prueba con Stripe
        </footer>
      </body>
    </html>
  );
}
