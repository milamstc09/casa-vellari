import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";
import { formatarPreco, rotuloCategoria } from "@/lib/pratos";
import CardPrato from "@/components/CardPrato";

export const dynamic = "force-dynamic";

export default async function DetalhePratoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirFuncionario();
  const { id } = await params;

  const prato = await prisma.prato.findUnique({
    where: { id },
    include: { criadoPor: { select: { name: true } } },
  });
  if (!prato) notFound();

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <Link href="/admin/pratos" className="text-sm text-vermelho underline">
        ← Cardápio
      </Link>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#123b2b" }}>
        {prato.nome}
      </h2>
      <p className="muted" style={{ marginBottom: 16 }}>
        {rotuloCategoria(prato.categoria)} · {formatarPreco(Number(prato.preco))} · cadastrado por{" "}
        {prato.criadoPor.name}
      </p>
      <CardPrato prato={{ ...prato, preco: Number(prato.preco) }} />
      <Link
        href={`/admin/pratos/${prato.id}/editar`}
        className="mt-6 inline-block rounded-md bg-verde px-4 py-2 font-semibold text-papel hover:bg-verde2"
      >
        Editar
      </Link>
    </main>
  );
}
