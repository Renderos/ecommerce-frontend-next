"use client";

import { ErrorView } from "@/components/error-view";

export default function CheckoutError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorView error={error} retry={retry} title="Hubo un problema en el checkout" />;
}
