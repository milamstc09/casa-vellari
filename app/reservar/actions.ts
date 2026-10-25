"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirLogin } from "@/lib/permissoes";
import { criarInicio, calcularFim } from "@/lib/reservas";
import { reservaSchema } from "@/lib/validacoes/reserva";

function voltar(params: Record<string, string>, erro: string): never {
  const q = new URLSearchParams({ ...params, erro });
  redirect(`/reservar?${q.toString()}`);
}

export async function criarReserva(formData: FormData) {
  const session = await exigirLogin();

  const dados = {
    data: String(formData.get("data") ?? ""),
    horario: String(formData.get("horario") ?? ""),
    pessoas: String(formData.get("pessoas") ?? ""),
    mesaId: String(formData.get("mesaId") ?? ""),
  };
  const busca = { data: dados.data, horario: dados.horario, pessoas: dados.pessoas };

  const resultado = reservaSchema.safeParse(dados);
  if (!resultado.success) {
    return voltar(busca, resultado.error.issues[0].message);
  }
  const { data, horario, pessoas, mesaId } = resultado.data;

  const inicio = criarInicio(data, horario);
  if (Number.isNaN(inicio.getTime())) {
    return voltar(busca, "Data inválida.");
  }
  if (inicio.getTime() <= Date.now()) {
    return voltar(busca, "Escolha uma data e um horário futuros.");
  }
  const fim = calcularFim(inicio);

  let erro: string | undefined;
  try {
    erro = await prisma.$transaction(
      async (tx): Promise<string | undefined> => {
        // Regra: somente UMA reserva futura por cliente
        const jaTem = await tx.reserva.findFirst({
          where: { userId: session.user.id, status: "CONFIRMADA", inicio: { gt: new Date() } },
        });
        if (jaTem) return "Você já possui uma reserva futura. Cancele-a para fazer outra.";

        const mesa = await tx.mesa.findUnique({ where: { id: mesaId } });
        if (!mesa) return "Mesa não encontrada.";
        if (mesa.capacidade < pessoas) return "Esta mesa não comporta essa quantidade de pessoas.";

        // Regra: sem conflito de horário na mesma mesa
        const conflito = await tx.reserva.findFirst({
          where: { mesaId, status: "CONFIRMADA", inicio: { lt: fim }, fim: { gt: inicio } },
        });
        if (conflito) return "Esta mesa acabou de ser reservada. Escolha outra mesa.";

        await tx.reserva.create({
          data: { userId: session.user.id, mesaId, inicio, fim, pessoas },
        });
        return undefined;
      },
      { isolationLevel: "Serializable" }
    );
  } catch {
    return voltar(busca, "Não foi possível concluir a reserva. Tente novamente.");
  }

  if (erro) return voltar(busca, erro);

  revalidatePath("/minha-conta");
  revalidatePath("/admin/reservas");
  redirect("/minha-conta?ok=" + encodeURIComponent("Reserva confirmada com sucesso!"));
}
