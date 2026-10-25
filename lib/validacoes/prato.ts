import { z } from "zod";
import { VALORES_CATEGORIA } from "@/lib/pratos";

export type EstadoPrato = {
  erro?: string;
  valores?: { nome?: string; descricao?: string; preco?: string; categoria?: string };
};

export const pratoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Informe o nome do prato.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),
  descricao: z
    .string()
    .trim()
    .min(10, "A descrição precisa ter pelo menos 10 caracteres.")
    .max(300, "A descrição deve ter no máximo 300 caracteres."),
  preco: z.coerce
    .number({ error: "Informe um preço válido." })
    .positive("O preço deve ser maior que zero.")
    .max(9999, "O preço máximo é R$ 9.999,00."),
  categoria: z.enum(VALORES_CATEGORIA, { error: "Escolha uma categoria." }),
});
