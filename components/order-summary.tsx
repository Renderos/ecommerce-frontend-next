import { formatDate, formatMoney } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Pendiente de pago", className: "bg-warn-bg text-warn" },
  paid: { label: "Pagada", className: "bg-ok-bg text-ok" },
  failed: { label: "Pago fallido", className: "bg-danger-bg text-danger" },
  cancelled: { label: "Cancelada", className: "bg-surface-2 text-muted" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS[status] ?? { label: status, className: "bg-surface-2 text-muted" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.className}`}>{s.label}</span>;
}

export function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-sm text-muted">{order.order_number}</p>
          <p className="text-xs text-muted">{formatDate(order.created_at)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {order.items && order.items.length > 0 && (
        <ul className="divide-y divide-line text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3 py-2">
              <span>
                {item.product_name} <span className="text-muted">× {item.quantity}</span>
              </span>
              <span className="tabular-nums">{formatMoney(item.subtotal, order.currency)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="space-y-1 border-t border-line pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="tabular-nums">{formatMoney(order.subtotal, order.currency)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Impuestos</dt>
          <dd className="tabular-nums">{formatMoney(order.tax, order.currency)}</dd>
        </div>
        <div className="flex justify-between text-base font-bold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatMoney(order.total, order.currency)}</dd>
        </div>
      </dl>

      {order.shipping_address && (
        <p className="text-sm">
          <span className="text-muted">Envío: </span>
          {order.shipping_address}
        </p>
      )}
    </div>
  );
}
