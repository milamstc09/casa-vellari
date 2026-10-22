import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl text-verde">Casa Vellari</h1>
      <p className="mt-2 text-muted-foreground">Cucina italiana, con anima carioca.</p>
      <p className="mt-6 text-sm">
        {session ? `Sessão ativa: ${session.user.email}` : "Você não está conectado."}
      </p>
    </main>
  );
}