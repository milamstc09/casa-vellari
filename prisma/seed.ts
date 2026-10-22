import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function capacidadeDaMesa(numero: number): number {
  if (numero <= 8) return 2;
  if (numero <= 14) return 4;
  if (numero <= 18) return 6;
  return 8;
}

async function main() {
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());