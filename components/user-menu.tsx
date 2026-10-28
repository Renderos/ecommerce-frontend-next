import Link from "next/link";
import { getSessionUser } from "@/lib/session";

export async function UserMenu() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <Link href="/login" className="btn btn-primary rounded-full py-2">
        Iniciar sesión
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-32 truncate text-sm text-muted md:inline" title={user.email}>
        Hola, {user.name.split(" ")[0]}
      </span>
      <form action="/api/auth/logout" method="post">
        <button type="submit" className="btn btn-secondary rounded-full py-2">
          Salir
        </button>
      </form>
    </div>
  );
}
