import { z } from "zod";

export type EstadoForm = {
  erro?: string;
  valores?: { nome?: string; email?: string };
};

export const cadastroSchema = z
  .object({
    nome: z.string().trim().min(3, "Informe seu nome completo."),
    email: z.email("Informe um e-mail válido."),
    senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
    confirmarSenha: z.string(),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não conferem.",
    path: ["confirmarSenha"],
  });

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe sua senha."),
});