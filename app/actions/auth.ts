"use server";

import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { createSession } from "@/lib/session";
import type { AuthPayload, FormState } from "@/lib/types";

/** Solo rutas internas: evita open redirects con ?next=https://sitio-malicioso */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function toFormState(e: unknown): FormState {
  if (e instanceof ApiError) return { message: e.message, errors: e.errors };
  return { message: "Ocurrió un error inesperado. Intenta de nuevo." };
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { message: "Completa el correo y la contraseña.", fields: { email } };
  }

  try {
    const res = await api<AuthPayload>("/auth/login", {
      method: "POST",
      body: { email, password, device_name: "nextjs-web" },
    });
    await createSession(res.data);
  } catch (e) {
    return { ...toFormState(e), fields: { email } };
  }

  redirect(safeNext(formData.get("next")));
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const body = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    password: String(formData.get("password") ?? ""),
    password_confirmation: String(formData.get("password_confirmation") ?? ""),
  };

  const fields = { name: body.name, email: body.email, phone: body.phone ?? "" };

  if (body.password !== body.password_confirmation) {
    return { message: "Revisa los campos marcados.", errors: { password: ["Las contraseñas no coinciden."] }, fields };
  }

  try {
    const res = await api<AuthPayload>("/auth/register", { method: "POST", body });
    await createSession(res.data);
  } catch (e) {
    return { ...toFormState(e), fields };
  }

  redirect(safeNext(formData.get("next")));
}
