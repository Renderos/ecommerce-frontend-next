"use client";

import { ErrorView } from "@/components/error-view";

export default function ProductError({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorView error={error} retry={retry} title="No pudimos cargar este producto" />;
}
