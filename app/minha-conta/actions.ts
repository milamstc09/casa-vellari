"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirLogin } from "@/lib/permissoes";
import { podeCancelar } from "@/lib/reservas";

export async function cancelarReserva(formData: FormData) {
  const session = await exigirLogin();
  const id = String(formData.get("id") ?? "");

  // O "userId" no filtro garante que o cliente só mexe na PRÓPRIA reserva.
  const reserva = await prisma.reserva.findFirst({
    where: { id, userId: session.user.id, status: "CONFIRMADA" },
  });
  if (!reserva) {
    redirect("/minha-conta?erro=" + encodeURIComponent("Reserva não encontrada."));
  }

  if (!podeCancelar(reserva.inicio)) {
    redirect(
      "/minha-conta?erro=" +
        encodeURIComponent("O prazo de cancelamento (até 10 horas antes) já passou.")
    );
  }

  await prisma.reserva.update({
    where: { id: reserva.id },
    data: { status: "CANCELADA", canceladaEm: new Date() },
  });

  revalidatePath("/minha-conta");
  revalidatePath("/admin/reservas");
  redirect("/minha-conta?ok=" + encodeURIComponent("Reserva cancelada."));
}
