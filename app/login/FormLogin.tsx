"use client";

import { useActionState } from "react";
import Link from "next/link";
import { entrar } from "./actions";
import type { EstadoForm } from "@/lib/validacoes/auth";

const campo =
  "w-full rounded-md border border-linha bg-papel px-3 py-2 text-tinta outline-none focus:border-verde";

export default function FormLogin() {
  const [estado, acao, pendente] = useActionState<EstadoForm, FormData>(entrar, {});

  return (
    <form action={acao} noValidate className="mt-6 space-y-4">
      {estado.erro && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-vermelho">
          {estado.erro}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={estado.valores?.email} className={campo} />
      </div>
      <div>
        <label htmlFor="senha" className="mb-1 block text-sm font-medium">Senha</label>
        <input id="senha" name="senha" type="password" autoComplete="current-password" className={campo} />
      </div>

      <button
        type="submit"
        disabled={pendente}
        className="w-full rounded-md bg-verde px-4 py-3 font-semibold text-papel hover:bg-verde2 disabled:opacity-60"
      >
        {pendente ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-sm">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-vermelho underline">Criar cadastro</Link>
      </p>
    </form>
  );
}