import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";
import { nomeDaMesa } from "@/lib/mesas";
import BotaoExcluir from "@/components/BotaoExcluir";
import { excluirMesa } from "../actions";

export default async function DetalheMesaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirFuncionario();
  const { id } = await params;

  const mesa = await prisma.mesa.findUnique({
    where: { id },
    include: { _count: { select: { reservas: true } } },
  });
  if (!mesa) notFound();

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <Link href="/admin/mesas" className="text-sm text-vermelho underline">
        ← Mesas
      </Link>
      <h1 className="mt-2 text-3xl text-verde">{nomeDaMesa(mesa.numero)}</h1>

      <dl className="mt-6 space-y-2 rounded-lg border border-linha bg-papel p-4">
        <div className="flex justify-between">
          <dt>Capacidade</dt>
          <dd className="font-semibold">{mesa.capacidade} lugares</dd>
        </div>
        <div className="flex justify-between">
          <dt>Reservas registradas</dt>
          <dd className="font-semibold">{mesa._count.reservas}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/mesas/${mesa.id}/editar`}
          className="rounded-md bg-verde px-4 py-2 font-semibold text-papel hover:bg-verde2"
        >
          Editar
        </Link>
        <form action={excluirMesa}>
          <input type="hidden" name="id" value={mesa.id} />
          <BotaoExcluir confirmacao={`Excluir a ${nomeDaMesa(mesa.numero)}?`} />
        </form>
      </div>
    </main>
  );
}