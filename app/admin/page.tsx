import { exigirFuncionario } from "@/lib/permissoes";

export default async function AdminPage() {
  const session = await exigirFuncionario();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-xs tracking-[0.25em] text-vermelho">ÁREA INTERNA</p>
      <h1 className="text-3xl text-verde">Painel administrativo</h1>
      <p className="mt-4 text-sm">Conectado como {session.user.email}</p>
    </main>
  );
}