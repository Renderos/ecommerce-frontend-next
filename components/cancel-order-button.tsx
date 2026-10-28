"use client";

import { useActionState } from "react";
import { cancelOrderAction } from "@/app/actions/orders";
import type { FormState } from "@/lib/types";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

export function CancelOrderButton({ orderId }: { orderId: number }) {
  const [state, action] = useActionState(async () => cancelOrderAction(orderId), {} as FormState);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("¿Cancelar esta orden? El stock reservado se liberará.")) e.preventDefault();
      }}
      className="space-y-2"
    >
      <FormMessage state={state} />
      {!state.ok && (
        <SubmitButton pendingText="Cancelando…" className="btn btn-danger">
          Cancelar orden
        </SubmitButton>
      )}
    </form>
  );
}
