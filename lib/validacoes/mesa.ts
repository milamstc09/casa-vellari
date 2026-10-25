import { z } from "zod";

export type EstadoMesa = {
  erro?: string;
  valores?: { numero?: string; capacidade?: string };
};

export const mesaSchema = z.object({
  numero: z.coerce
    .number({ error: "Informe o número da mesa." })
    .int("O número da mesa deve ser inteiro.")
    .min(1, "O número da mesa deve ser pelo menos 1.")
    .max(99, "O número da mesa deve ser no máximo 99."),
  capacidade: z.coerce
    .number({ error: "Informe a capacidade da mesa." })
    .int("A capacidade deve ser um número inteiro.")
    .min(1, "A capacidade deve ser de pelo menos 1 lugar.")
    .max(20, "A capacidade máxima é de 20 lugares."),
});
