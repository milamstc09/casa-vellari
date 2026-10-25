import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";
import { formatarPreco, rotuloCategoria } from "@/lib/pratos";
import BotaoExcluir from "@/components/BotaoExcluir";
import { excluirPrato } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPratosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await exigirFuncionario();
  const { ok, erro } = await searchParams;

  const pratos = await prisma.prato.findMany({
    orderBy: [{ categoria: "asc" }, { nome: "asc" }],
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#123b2b" }}>
            Cardápio
          </h2>
          <p className="muted">{pratos.length} pratos cadastrados</p>
        </div>
        <Link
          href="/admin/pratos/novo"
          className="rounded-md bg-verde px-4 py-2 font-semibold text-papel hover:bg-verde2"
        >
          Novo prato
        </Link>
      </div>

      {ok && (
        <p role="status" style={{ color: "#123b2b", margin: "12px 0" }}>
          {ok}
        </p>
      )}
      {erro && (
        <p role="alert" style={{ color: "#a92e2b", margin: "12px 0" }}>
          {erro}
        </p>
      )}

      {pratos.length === 0 ? (
        <p className="mt-8">Nenhum prato cadastrado.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {pratos.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-linha bg-papel px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-verde">{p.nome}</p>
                <p className="text-sm">
                  {rotuloCategoria(p.categoria)} · {formatarPreco(Number(p.preco))}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/pratos/${p.id}`}
                  className="rounded-md border border-linha px-3 py-1 text-sm hover:bg-creme"
                >
                  Ver
                </Link>
                <Link
                  href={`/admin/pratos/${p.id}/editar`}
                  className="rounded-md border border-linha px-3 py-1 text-sm hover:bg-creme"
                >
                  Editar
                </Link>
                <form action={excluirPrato}>
                  <input type="hidden" name="id" value={p.id} />
                  <BotaoExcluir confirmacao={`Excluir "${p.nome}"?`} />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
