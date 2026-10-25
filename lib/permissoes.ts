import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function obterSessao() {
  return auth.api.getSession({ headers: await headers() });
}

// Exige usuário logado. Sem sessão, manda para o login.
export async function exigirLogin() {
  const session = await obterSessao();
  if (!session) redirect("/login");
  return session;
}

// Exige funcionário. Cliente logado volta para a página inicial.
export async function exigirFuncionario() {
  const session = await exigirLogin();
  if (session.user.role !== "FUNCIONARIO") redirect("/");
  return session;
}