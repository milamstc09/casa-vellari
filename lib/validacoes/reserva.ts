import { z } from "zod";
import { HORARIOS } from "@/lib/reservas";

export const buscaReservaSchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Escolha uma data válida."),
  horario: z.enum(HORARIOS, { error: "Escolha um horário entre 18:00 e 22:00." }),
  pessoas: z.coerce
    .number({ error: "Informe o número de pessoas (de 1 a 8)." })
    .int("Informe o número de pessoas (de 1 a 8).")
    .min(1, "Informe o número de pessoas (de 1 a 8).")
    .max(8, "O restaurante atende até 8 pessoas por mesa."),
});

export const reservaSchema = buscaReservaSchema.extend({
  mesaId: z.string().min(1, "Escolha uma mesa."),
});
