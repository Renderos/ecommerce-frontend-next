import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";
import { Steps } from "@/components/steps";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <Steps current={1} />
      <h1 className="text-3xl font-bold tracking-tight">Confirmar orden</h1>
      <Suspense fallback={<div className="skeleton h-5 w-64" />}>
        <BuyerInfo />
      </Suspense>
      <CheckoutForm />
    </div>
  );
}

async function BuyerInfo() {
  const user = await getSessionUser();
  if (!user) return null;
  return (
    <p className="text-sm text-muted">
      Comprando como <strong className="text-ink">{user.name}</strong> ({user.email})
    </p>
  );
}
