import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/permissoes";
import FormCadastro from "./FormCadastro";

export default async function CadastroPage() {
  if (await obterSessao()) redirect("/");

  return (
    <main className="account-area section">
      <div className="section-heading">
        <p className="eyebrow">BENVENUTO</p>
        <h2>Crie sua conta</h2>
      </div>
      <div className="account-card">
        <FormCadastro />
      </div>
    </main>
  );
}
