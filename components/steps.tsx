export function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Orden", "Pago", "Confirmación"];
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Progreso de compra">
      {steps.map((s, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "current" : "todo";
        return (
          <li key={s} className="flex items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
            <span
              className={`grid size-6 place-items-center rounded-full text-xs font-bold ${
                state === "todo" ? "bg-surface-2 text-muted" : "bg-accent text-accent-fg"
              }`}
            >
              {state === "done" ? "✓" : n}
            </span>
            <span className={state === "current" ? "font-semibold" : "text-muted"}>{s}</span>
            {n < steps.length && <span className="mx-1 h-px w-6 bg-line" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
