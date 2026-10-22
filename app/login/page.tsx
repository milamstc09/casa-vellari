import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import FormLogin from "./FormLogin";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/");

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <p className="text-xs tracking-[0.25em] text-vermelho">BENVENUTO</p>
      <h1 className="text-3xl text-verde">Acesse sua conta</h1>
      <FormLogin />
    </main>
  );
}