"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";

export async function cancelarReservaAdmin(formData: FormData) {
  await exigirFuncionario();
  const id = String(formData.get("id") ?? "");

  const resultado = await prisma.reserva.updateMany({
    where: { id, status: "CONFIRMADA" },
    data: { status: "CANCELADA", canceladaEm: new Date() },
  });

  revalidatePath("/admin/reservas");
  revalidatePath("/minha-conta");

  if (resultado.count === 0) {
    redirect("/admin/reservas?erro=" + encodeURIComponent("Reserva não encontrada ou já cancelada."));
  }
  redirect("/admin/reservas?ok=" + encodeURIComponent("Reserva cancelada."));
}
