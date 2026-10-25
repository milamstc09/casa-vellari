import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";
import FormPrato from "@/components/FormPrato";
import { editarPrato } from "../../actions";

export default async function EditarPratoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirFuncionario();
  const { id } = await params;

  const prato = await prisma.prato.findUnique({ where: { id } });
  if (!prato) notFound();

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#123b2b" }}>
        Editar prato
      </h2>
      <FormPrato
        acao={editarPrato}
        textoBotao="Salvar alterações"
        inicial={{
          id: prato.id,
          nome: prato.nome,
          descricao: prato.descricao,
          preco: Number(prato.preco).toFixed(2).replace(".", ","),
          categoria: prato.categoria,
          imagemUrl: prato.imagemUrl,
        }}
      />
    </main>
  );
}
