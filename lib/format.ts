export function formatMoney(amount: number, currency = "usd") {
  return new Intl.NumberFormat("es-SV", { style: "currency", currency: currency.toUpperCase() }).format(amount);
}

export function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}
