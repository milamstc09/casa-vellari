import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";
import { nomeDaMesa } from "@/lib/mesas";
import FormMesa from "@/components/FormMesa";
import { editarMesa } from "../../actions";

export default async function EditarMesaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await exigirFuncionario();
  const { id } = await params;

  const mesa = await prisma.mesa.findUnique({ where: { id } });
  if (!mesa) notFound();

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-3xl text-verde">Editar {nomeDaMesa(mesa.numero)}</h1>
      <FormMesa
        acao={editarMesa}
        textoBotao="Salvar alterações"
        inicial={{ id: mesa.id, numero: mesa.numero, capacidade: mesa.capacidade }}
      />
    </main>
  );
}