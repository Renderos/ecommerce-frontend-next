import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { CancelOrderButton } from "@/components/cancel-order-button";
import { ClearCart } from "@/components/clear-cart";
import { OrderSummary } from "@/components/order-summary";
import { PaymentForm } from "@/components/payment-form";
import { ListSkeleton } from "@/components/skeletons";
import { Steps } from "@/components/steps";
import { getOrder } from "@/lib/data";

export const metadata: Metadata = { title: "Pago" };

export default function PaymentPage({ params, searchParams }: PageProps<"/checkout/[orderId]">) {
  return (
    <div className="space-y-6">
      <Steps current={2} />
      <h1 className="text-3xl font-bold tracking-tight">Pagar orden</h1>
      <Suspense fallback={null}>
        <ClearCartIfNew searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<ListSkeleton rows={3} />}>
        <Payment orderId={params.then((p) => p.orderId)} />
      </Suspense>
    </div>
  );
}

/** Solo se vacía el carrito al llegar desde la creación de la orden (?new=1). */
async function ClearCartIfNew({ searchParams }: Pick<PageProps<"/checkout/[orderId]">, "searchParams">) {
  return (await searchParams).new === "1" ? <ClearCart /> : null;
}

async function Payment({ orderId }: { orderId: Promise<string> }) {
  const id = await orderId;
  const order = await getOrder(id, `/checkout/${id}`);
  if (!order) notFound();
  if (order.status === "paid") redirect(`/checkout/${order.id}/success`);

  if (order.status === "cancelled") {
    return (
      <div className="card text-center">
        <p className="font-semibold">Esta orden fue cancelada.</p>
        <Link href="/" className="btn btn-primary mt-4">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <OrderSummary order={order} />
        <CancelOrderButton orderId={order.id} />
      </div>
      <PaymentForm orderId={order.id} total={order.total} currency={order.currency} />
    </div>
  );
}
