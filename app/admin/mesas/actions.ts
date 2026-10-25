"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";
import { nomeDaMesa } from "@/lib/mesas";
import { mesaSchema, type EstadoMesa } from "@/lib/validacoes/mesa";

function lerCampos(formData: FormData) {
  return {
    numero: String(formData.get("numero") ?? ""),
    capacidade: String(formData.get("capacidade") ?? ""),
  };
}

export async function criarMesa(
  _estadoAnterior: EstadoMesa,
  formData: FormData
): Promise<EstadoMesa> {
  await exigirFuncionario();

  const valores = lerCampos(formData);
  const resultado = mesaSchema.safeParse(valores);
  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message, valores };
  }

  const repetida = await prisma.mesa.findUnique({
    where: { numero: resultado.data.numero },
  });
  if (repetida) {
    return { erro: `Já existe a ${nomeDaMesa(resultado.data.numero)}.`, valores };
  }

  try {
    await prisma.mesa.create({ data: resultado.data });
  } catch {
    return { erro: "Não foi possível salvar a mesa. Tente novamente.", valores };
  }

  revalidatePath("/admin/mesas");
  redirect("/admin/mesas?ok=" + encodeURIComponent("Mesa criada com sucesso."));
}

export async function editarMesa(
  _estadoAnterior: EstadoMesa,
  formData: FormData
): Promise<EstadoMesa> {
  await exigirFuncionario();

  const id = String(formData.get("id") ?? "");
  const valores = lerCampos(formData);

  const resultado = mesaSchema.safeParse(valores);
  if (!resultado.success) {
    return { erro: resultado.error.issues[0].message, valores };
  }

  const atual = await prisma.mesa.findUnique({ where: { id } });
  if (!atual) {
    return { erro: "Mesa não encontrada.", valores };
  }

  const outra = await prisma.mesa.findUnique({
    where: { numero: resultado.data.numero },
  });
  if (outra && outra.id !== id) {
    return { erro: `Já existe a ${nomeDaMesa(resultado.data.numero)}.`, valores };
  }

  try {
    await prisma.mesa.update({ where: { id }, data: resultado.data });
  } catch {
    return { erro: "Não foi possível salvar a mesa. Tente novamente.", valores };
  }

  revalidatePath("/admin/mesas");
  redirect("/admin/mesas?ok=" + encodeURIComponent("Mesa atualizada com sucesso."));
}

export async function excluirMesa(formData: FormData) {
  await exigirFuncionario();

  const id = String(formData.get("id") ?? "");

  const reservas = await prisma.reserva.count({ where: { mesaId: id } });
  if (reservas > 0) {
    redirect(
      "/admin/mesas?erro=" +
        encodeURIComponent("Esta mesa possui reservas e não pode ser excluída.")
    );
  }

  await prisma.mesa.deleteMany({ where: { id } });

  revalidatePath("/admin/mesas");
  redirect("/admin/mesas?ok=" + encodeURIComponent("Mesa excluída."));
}