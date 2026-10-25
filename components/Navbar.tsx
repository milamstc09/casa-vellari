import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sair } from "@/app/actions/sair";

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="bg-verde text-papel">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-widest">
          <span className="rounded bg-vermelho px-2 py-1 text-sm">CV</span>
          CASA VELLARI
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {session ? (
            <>
                            {session.user.role === "FUNCIONARIO" && (
                  <Link href="/admin" className="hover:underline">Admin</Link>
                )}
              <span className="max-w-[10rem] truncate">Olá, {session.user.name}</span>
              <form action={sair}>
                <button type="submit" className="rounded border border-papel/60 px-3 py-1 hover:bg-verde2">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Entrar</Link>
              <Link href="/cadastro" className="rounded bg-vermelho px-3 py-1 hover:opacity-90">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}