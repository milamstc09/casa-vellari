import { exigirFuncionario } from "@/lib/permissoes";
import FormMesa from "@/components/FormMesa";
import { criarMesa } from "../actions";

export default async function NovaMesaPage() {
  await exigirFuncionario();

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-3xl text-verde">Nova mesa</h1>
      <FormMesa acao={criarMesa} textoBotao="Criar mesa" />
    </main>
  );
}