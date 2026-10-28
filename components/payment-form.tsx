"use client";

import { useActionState } from "react";
import { payOrderAction } from "@/app/actions/orders";
import { formatMoney } from "@/lib/format";
import type { FormState } from "@/lib/types";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

// PaymentMethods de prueba de Stripe: la API confirma el PaymentIntent en el servidor
const TEST_CARDS = [
  { id: "pm_card_visa", label: "Visa •••• 4242", hint: "Pago aprobado" },
  { id: "pm_card_mastercard", label: "Mastercard •••• 4444", hint: "Pago aprobado" },
  { id: "pm_card_chargeDeclined", label: "Visa •••• 0002", hint: "Rechazada (genérico)" },
  { id: "pm_card_chargeDeclinedInsufficientFunds", label: "Visa •••• 9995", hint: "Fondos insuficientes" },
];

export function PaymentForm({ orderId, total, currency }: { orderId: number; total: number; currency: string }) {
  const [state, action] = useActionState(payOrderAction.bind(null, orderId), {} as FormState);

  return (
    <form action={action} className="card space-y-4">
      <div>
        <h2 className="font-semibold">Método de pago</h2>
        <p className="text-sm text-muted">Modo prueba de Stripe: no se realizan cargos reales.</p>
      </div>
      <FormMessage state={state} />
      <fieldset className="space-y-2">
        <legend className="sr-only">Tarjeta de prueba</legend>
        {TEST_CARDS.map((card, i) => (
          <label
            key={card.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-line p-3 has-[:checked]:border-accent has-[:checked]:bg-accent/5"
          >
            <input type="radio" name="payment_method" value={card.id} defaultChecked={i === 0} className="accent-accent" />
            <span className="flex-1 font-medium">{card.label}</span>
            <span className="text-xs text-muted">{card.hint}</span>
          </label>
        ))}
      </fieldset>
      <SubmitButton pendingText="Procesando pago…">Pagar {formatMoney(total, currency)}</SubmitButton>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
        <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z" />
        </svg>
        El pago se procesa en el servidor; tu sesión nunca se expone al navegador.
      </p>
    </form>
  );
}
