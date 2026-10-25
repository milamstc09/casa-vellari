import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/permissoes";
import FormLogin from "./FormLogin";

export default async function LoginPage() {
  if (await obterSessao()) redirect("/");

  return (
    <main className="account-area section">
      <div className="section-heading">
        <p className="eyebrow">BENVENUTO</p>
        <h2>Acesse sua conta</h2>
      </div>
      <div className="account-card">
        <FormLogin />
      </div>
    </main>
  );
}
