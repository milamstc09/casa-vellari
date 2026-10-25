import { exigirFuncionario } from "@/lib/permissoes";
import FormPrato from "@/components/FormPrato";
import { criarPrato } from "../actions";

export default async function NovoPratoPage() {
  await exigirFuncionario();

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#123b2b" }}>
        Novo prato
      </h2>
      <FormPrato acao={criarPrato} textoBotao="Criar prato" />
    </main>
  );
}
