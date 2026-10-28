import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { StatusBadge } from "@/components/order-summary";
import { Pagination } from "@/components/pagination";
import { ListSkeleton } from "@/components/skeletons";
import { getOrders } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Mis compras" };

const FILTERS: { value?: OrderStatus; label: string }[] = [
  { label: "Todas" },
  { value: "paid", label: "Pagadas" },
  { value: "pending", label: "Pendientes" },
  { value: "failed", label: "Fallidas" },
  { value: "cancelled", label: "Canceladas" },
];

type Params = { status?: OrderStatus; page: number };

async function parse(searchParams: PageProps<"/orders">["searchParams"]): Promise<Params> {
  const sp = await searchParams;
  const status = FILTERS.find((f) => f.value && f.value === sp.status)?.value;
  return { status, page: Math.max(1, Number(sp.page) || 1) };
}

export default function OrdersPage({ searchParams }: PageProps<"/orders">) {
  const params = parse(searchParams);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis compras</h1>
        <p className="mt-1 text-muted">Historial de órdenes asociado a tu cuenta.</p>
      </div>
      <Suspense fallback={<div className="skeleton h-10 w-96 max-w-full" />}>
        <StatusTabs params={params} />
      </Suspense>
      {/* Sección pesada: se transmite en streaming, el encabezado se muestra al instante */}
      <Suspense fallback={<ListSkeleton rows={5} />}>
        <OrderList params={params} />
      </Suspense>
    </div>
  );
}

async function StatusTabs({ params }: { params: Promise<Params> }) {
  const { status } = await params;
  return (
    <nav aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const active = f.value === status;
        return (
          <Link
            key={f.label}
            href={f.value ? `/orders?status=${f.value}` : "/orders"}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              active ? "bg-ink text-bg" : "border border-line bg-surface hover:bg-surface-2"
            }`}
          >
            {f.label}
          </Link>
        );
      })}
    </nav>
  );
}

async function OrderList({ params }: { params: Promise<Params> }) {
  const filters = await params;
  const { data: orders, meta } = await getOrders(filters);

  if (orders.length === 0) {
    return (
      <div className="card text-center">
        <p className="font-semibold">Aún no tienes órdenes{filters.status ? " con este estado" : ""}.</p>
        <Link href="/" className="btn btn-primary mt-4">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="space-y-3">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/orders/${order.id}`}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-4 hover:border-accent"
            >
              <div className="min-w-48 flex-1">
                <p className="font-mono text-sm font-semibold">{order.order_number}</p>
                <p className="text-xs text-muted">
                  {formatDate(order.created_at)} · {order.items_count ?? order.items?.length ?? 0} artículo(s)
                </p>
              </div>
              <StatusBadge status={order.status} />
              <p className="w-28 text-right font-bold tabular-nums">{formatMoney(order.total, order.currency)}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination meta={meta} filters={{ status: filters.status }} base="/orders" />
    </div>
  );
}
