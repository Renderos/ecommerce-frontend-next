"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";
import type { FormState } from "@/lib/types";
import { FieldError, FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";

const initial: FormState = {};

function Field({
  name,
  label,
  state,
  ...props
}: { name: string; label: string; state: FormState } & React.InputHTMLAttributes<HTMLInputElement>) {
  const invalid = !!state.errors?.[name];
  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="input"
        aria-invalid={invalid}
        aria-describedby={invalid ? `${name}-error` : undefined}
        defaultValue={props.type === "password" ? undefined : state.fields?.[name]}
        {...props}
      />
      <FieldError state={state} name={name} />
    </div>
  );
}

export function LoginForm({ next, expired }: { next: string; expired: boolean }) {
  const [state, action] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {expired && !state.message && (
        <p className="alert bg-warn-bg text-warn">Tu sesión expiró. Inicia sesión de nuevo.</p>
      )}
      <FormMessage state={state} />
      <Field name="email" label="Correo electrónico" type="email" autoComplete="email" required state={state} />
      <Field name="password" label="Contraseña" type="password" autoComplete="current-password" required state={state} />
      <SubmitButton pendingText="Ingresando…">Iniciar sesión</SubmitButton>
      <p className="text-center text-sm text-muted">
        ¿No tienes cuenta?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-medium text-accent underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, action] = useActionState(registerAction, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <FormMessage state={state} />
      <Field name="name" label="Nombre completo" autoComplete="name" required minLength={2} maxLength={100} state={state} />
      <Field name="email" label="Correo electrónico" type="email" autoComplete="email" required state={state} />
      <Field name="phone" label="Teléfono (opcional)" type="tel" autoComplete="tel" state={state} />
      <Field
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        state={state}
      />
      <p className="-mt-2 text-xs text-muted">Mínimo 8 caracteres, con mayúsculas, minúsculas, números y símbolos.</p>
      <Field
        name="password_confirmation"
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        required
        state={state}
      />
      <SubmitButton pendingText="Creando cuenta…">Crear cuenta</SubmitButton>
      <p className="text-center text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-accent underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
