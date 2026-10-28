import type { FormState } from "@/lib/types";

export function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p role={state.ok ? "status" : "alert"} className={state.ok ? "alert alert-ok" : "alert alert-error"}>
      {state.message}
    </p>
  );
}

export function FieldError({ state, name }: { state: FormState; name: string }) {
  const errors = state.errors?.[name];
  if (!errors?.length) return null;
  return (
    <p id={`${name}-error`} className="mt-1 text-sm text-danger">
      {errors[0]}
    </p>
  );
}
