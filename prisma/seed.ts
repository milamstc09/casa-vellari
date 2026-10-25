import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Instância do Better Auth só para o seed (sem plugin de cookies do Next)
const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "CLIENTE", input: false },
    },
  },
});

function capacidadeDaMesa(numero: number): number {
  if (numero <= 8) return 2;
  if (numero <= 14) return 4;
  if (numero <= 18) return 6;
  return 8;
}

async function criarMesas() {
  for (let numero = 1; numero <= 20; numero++) {
    const capacidade = capacidadeDaMesa(numero);
    await prisma.mesa.upsert({
      where: { numero },
      update: { capacidade },
      create: { numero, capacidade },
    });
  }
  const mesas = await prisma.mesa.findMany();
  const lugares = mesas.reduce((soma, m) => soma + m.capacidade, 0);
  console.log(`Mesas no banco: ${mesas.length} | Lugares: ${lugares}`);
}

async function criarFuncionario() {
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  const senha = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !senha) {
    console.log("SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD ausentes: funcionário não criado.");
    return;
  }

  const existente = await prisma.user.findUnique({ where: { email } });
  if (!existente) {
    await auth.api.signUpEmail({
      body: { name: "Equipe Casa Vellari", email, password: senha },
    });
  }
  await prisma.user.update({ where: { email }, data: { role: "FUNCIONARIO" } });
  console.log(`Funcionário pronto: ${email}`);
}

async function main() {
  await criarMesas();
  await criarFuncionario();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());