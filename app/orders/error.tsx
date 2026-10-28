"use client";

import { ErrorView } from "@/components/error-view";

export default function OrdersError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorView error={error} retry={retry} title="No pudimos cargar tu historial" />;
}
