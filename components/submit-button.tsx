"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText,
  className = "btn btn-primary w-full",
}: {
  children: React.ReactNode;
  pendingText: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-disabled={pending} className={className}>
      {pending ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
