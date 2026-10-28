import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CancelOrderButton } from "@/components/cancel-order-button";
import { OrderSummary } from "@/components/order-summary";
import { ListSkeleton } from "@/components/skeletons";
import { getOrder } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Detalle de orden" };

export default function OrderPage({ params }: PageProps<"/orders/[id]">) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/orders" className="text-sm text-muted hover:text-ink">
        ← Mis compras
      </Link>
      <Suspense fallback={<ListSkeleton rows={3} />}>
        <OrderDetail id={params.then((p) => p.id)} />
      </Suspense>
    </div>
  );
}

async function OrderDetail({ id }: { id: Promise<string> }) {
  const orderId = await id;
  const order = await getOrder(orderId, `/orders/${orderId}`);
  if (!order) notFound();

  const payable = order.status === "pending" || order.status === "failed";
  const payment = order.latest_payment;

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Orden {order.order_number}</h1>
      <OrderSummary order={order} />

      {payment && (
        <section className="card space-y-2 text-sm">
          <h2 className="font-semibold">Último pago</h2>
          <p>
            <span className="text-muted">Estado:</span> {payment.status} ·{" "}
            <span className="tabular-nums">{formatMoney(payment.amount, payment.currency)}</span>
          </p>
          {payment.failure_message && <p className="text-danger">{payment.failure_message}</p>}
          <p className="text-muted">{formatDate(payment.paid_at ?? payment.created_at)}</p>
        </section>
      )}

      {payable && (
        <div className="flex flex-wrap items-start gap-3">
          <Link href={`/checkout/${order.id}`} className="btn btn-primary">
            {order.status === "failed" ? "Reintentar pago" : "Pagar ahora"}
          </Link>
          <CancelOrderButton orderId={order.id} />
        </div>
      )}
    </>
  );
}
