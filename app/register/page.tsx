import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage({ searchParams }: PageProps<"/register">) {
  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold tracking-tight">Crear cuenta</h1>
        <p className="mt-1 mb-6 text-sm text-muted">Regístrate como cliente para comprar.</p>
        <Suspense fallback={<div className="skeleton h-96 w-full" />}>
          <RegisterFormWithParams searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function RegisterFormWithParams({ searchParams }: Pick<PageProps<"/register">, "searchParams">) {
  const sp = await searchParams;
  return <RegisterForm next={typeof sp.next === "string" ? sp.next : "/"} />;
}
