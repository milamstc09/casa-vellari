import { prisma } from "@/lib/prisma";

export const HORARIOS = ["18:00", "19:00", "20:00", "21:00", "22:00"] as const;
export const DURACAO_HORAS = 2;
export const LIMITE_CANCELAMENTO_HORAS = 10;
const FUSO = "America/Sao_Paulo";
const HORA_MS = 60 * 60 * 1000;

// O restaurante fica no Rio (UTC-3) e a Vercel roda em UTC.
// Por isso a data e o horário digitados são sempre interpretados com -03:00.
export function criarInicio(data: string, horario: string): Date {
  return new Date(`${data}T${horario}:00-03:00`);
}

export function calcularFim(inicio: Date): Date {
  return new Date(inicio.getTime() + DURACAO_HORAS * HORA_MS);
}

export function limiteCancelamento(inicio: Date): Date {
  return new Date(inicio.getTime() - LIMITE_CANCELAMENTO_HORAS * HORA_MS);
}

export function podeCancelar(inicio: Date, agora: Date = new Date()): boolean {
  return agora.getTime() <= limiteCancelamento(inicio).getTime();
}

export function hojeNoRio(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: FUSO }); // AAAA-MM-DD
}

export function formatarData(d: Date): string {
  return d.toLocaleDateString("pt-BR", { timeZone: FUSO });
}

export function formatarHora(d: Date): string {
  return d.toLocaleTimeString("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit" });
}

export function formatarDataHora(d: Date): string {
  return `${formatarData(d)} às ${formatarHora(d)}`;
}

// Mesas com lugares suficientes e SEM reserva confirmada que se sobreponha ao intervalo.
// Conflito: reservaExistente.inicio < novoFim  E  reservaExistente.fim > novoInicio
export async function mesasDisponiveis(inicio: Date, fim: Date, pessoas: number) {
  return prisma.mesa.findMany({
    where: {
      capacidade: { gte: pessoas },
      reservas: {
        none: { status: "CONFIRMADA", inicio: { lt: fim }, fim: { gt: inicio } },
      },
    },
    orderBy: [{ capacidade: "asc" }, { numero: "asc" }],
  });
}

export async function reservaFuturaDoUsuario(userId: string) {
  return prisma.reserva.findFirst({
    where: { userId, status: "CONFIRMADA", inicio: { gt: new Date() } },
    include: { mesa: true },
    orderBy: { inicio: "asc" },
  });
}
