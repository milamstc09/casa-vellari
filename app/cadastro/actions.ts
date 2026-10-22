"use server";

import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { cadastroSchema, type EstadoForm } from "@/lib/validacoes/auth";

export async function cadastrar(
  _estadoAnterior: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const valores = {
    nome: String(formData.get("nome") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const resultado = cadastroSchema.safeParse({
    ...valores,
    senha: String(formData.get("senha") ?? ""),
    confirmarSenha: String(formData.get("confirmarSenha") ?? ""),
  });

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message, valores };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: resultado.data.nome,
        email: resultado.data.email,
        password: resultado.data.senha,
      },
    });
  } catch (e) {
    if (e instanceof APIError) {
      return {
        erro: "Não foi possível criar o cadastro. Este e-mail já pode estar em uso.",
        valores,
      };
    }
    throw e;
  }

  redirect("/");
}