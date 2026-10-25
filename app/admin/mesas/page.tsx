import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";
import { nomeDaMesa } from "@/lib/mesas";
import BotaoExcluir from "@/components/BotaoExcluir";
import { excluirMesa } from "./actions";

export default async function MesasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await exigirFuncionario();
  const { ok, erro } = await searchParams;

  const mesas = await prisma.mesa.findMany({
    orderBy: { numero: "asc" },
    include: { _count: { select: { reservas: true } } },
  });
  const lugares = mesas.reduce((soma, m) => soma + m.capacidade, 0);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/admin" className="text-sm text-vermelho underline">
        ← Painel
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl text-verde">Mesas</h1>
          <p className="text-sm">
            {mesas.length} mesas · {lugares} lugares
          </p>
        </div>
        <Link
          href="/admin/mesas/nova"
          className="rounded-md bg-verde px-4 py-2 font-semibold text-papel hover:bg-verde2"
        >
          Nova mesa
        </Link>
      </div>

      {ok && (
        <p role="status" className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-verde">
          {ok}
        </p>
      )}
      {erro && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-vermelho">
          {erro}
        </p>
      )}

      {mesas.length === 0 ? (
        <p className="mt-8">Nenhuma mesa cadastrada.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {mesas.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-linha bg-papel px-4 py-3"
            >
              <div>
                <p className="font-semibold text-verde">{nomeDaMesa(m.numero)}</p>
                <p className="text-sm">
                  {m.capacidade} lugares · {m._count.reservas} reserva(s)
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/mesas/${m.id}`}
                  className="rounded-md border border-linha px-3 py-1 text-sm hover:bg-creme"
                >
                  Ver
                </Link>
                <Link
                  href={`/admin/mesas/${m.id}/editar`}
                  className="rounded-md border border-linha px-3 py-1 text-sm hover:bg-creme"
                >
                  Editar
                </Link>
                <form action={excluirMesa}>
                  <input type="hidden" name="id" value={m.id} />
                  <BotaoExcluir confirmacao={`Excluir a ${nomeDaMesa(m.numero)}?`} />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}