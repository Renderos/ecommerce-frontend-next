import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold tracking-tight">Iniciar sesión</h1>
        <p className="mt-1 mb-6 text-sm text-muted">Accede para completar tu compra y ver tu historial.</p>
        <Suspense fallback={<div className="skeleton h-72 w-full" />}>
          <LoginFormWithParams searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function LoginFormWithParams({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/";
  return <LoginForm next={next} expired={sp.expired === "1"} />;
}
