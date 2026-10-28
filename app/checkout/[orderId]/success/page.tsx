import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { OrderSummary } from "@/components/order-summary";
import { ListSkeleton } from "@/components/skeletons";
import { Steps } from "@/components/steps";
import { getOrder } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Compra confirmada" };

export default function SuccessPage({ params }: PageProps<"/checkout/[orderId]/success">) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Steps current={3} />
      <Suspense fallback={<ListSkeleton rows={3} />}>
        <Confirmation orderId={params.then((p) => p.orderId)} />
      </Suspense>
    </div>
  );
}

async function Confirmation({ orderId }: { orderId: Promise<string> }) {
  const id = await orderId;
  const order = await getOrder(id, `/checkout/${id}/success`);
  if (!order) notFound();
  // Solo se confirma lo que la API reporta como pagado
  if (order.status !== "paid") redirect(`/checkout/${order.id}`);

  const payment = order.latest_payment;

  return (
    <>
      <div className="card text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-ok-bg text-2xl text-ok" aria-hidden>
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">¡Gracias por tu compra!</h1>
        <p className="mt-2 text-muted">
          Tu pago de la orden <span className="font-mono">{order.order_number}</span> fue aprobado el{" "}
          {formatDate(order.paid_at)}
        </p>
        {payment?.stripe_payment_intent_id && (
          <p className="mt-2 font-mono text-xs text-muted">Stripe: {payment.stripe_payment_intent_id}</p>
        )}
      </div>
      <OrderSummary order={order} />
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/orders" className="btn btn-primary">
          Ver mis compras
        </Link>
        <Link href="/" className="btn btn-secondary">
          Seguir comprando
        </Link>
      </div>
    </>
  );
}
