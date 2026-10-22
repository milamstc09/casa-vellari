"use server";

import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { loginSchema, type EstadoForm } from "@/lib/validacoes/auth";

export async function entrar(
  _estadoAnterior: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const valores = { email: String(formData.get("email") ?? "") };

  const resultado = loginSchema.safeParse({
    ...valores,
    senha: String(formData.get("senha") ?? ""),
  });

  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message, valores };
  }

  try {
    await auth.api.signInEmail({
      body: { email: resultado.data.email, password: resultado.data.senha },
    });
  } catch (e) {
    if (e instanceof APIError) {
      return { erro: "E-mail ou senha incorretos.", valores };
    }
    throw e;
  }

  redirect("/");
}