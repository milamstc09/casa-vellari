import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Instância do Better Auth só para o seed (sem o plugin de cookies do Next)
const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "CLIENTE", input: false },
    },
  },
});

type Cat =
  | "ENTRADAS"
  | "MASSAS_LONGAS"
  | "MASSAS_RECHEADAS"
  | "CARNES"
  | "SOBREMESAS"
  | "BEBIDAS";

const foto = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
const MASSA = foto("photo-1473093295043-cdd812d0e601");
const CARNE = foto("photo-1544025162-d76694265947");
const DOCE = foto("photo-1578985545062-69928b1d9587");

const pratos: {
  nome: string;
  categoria: Cat;
  preco: number;
  descricao: string;
  imagem: string;
}[] = [
  { nome: "Burrata Vellari", categoria: "ENTRADAS", preco: 58, descricao: "Burrata cremosa, tomates-cereja, pesto de manjericão e azeite.", imagem: foto("photo-1608039829572-78524f79c4c7") },
  { nome: "Carpaccio di Manzo", categoria: "ENTRADAS", preco: 64, descricao: "Filé-mignon fatiado, rúcula, parmesão e molho de mostarda.", imagem: foto("photo-1547592180-85f173990554") },
  { nome: "Arancini di Parmigiano", categoria: "ENTRADAS", preco: 48, descricao: "Bolinho crocante de risoto, queijo e molho de tomate.", imagem: foto("photo-1572695157366-5e585ab2b69f") },
  { nome: "Polpo alla Griglia", categoria: "ENTRADAS", preco: 76, descricao: "Polvo grelhado, batatas, ervas e azeite de limão-siciliano.", imagem: foto("photo-1559737558-2f5a35f4523b") },
  { nome: "Spaghetti alla Carbonara", categoria: "MASSAS_LONGAS", preco: 82, descricao: "Spaghetti, guanciale, gema de ovo, pecorino romano e pimenta-do-reino.", imagem: MASSA },
  { nome: "Tagliatelle al Ragù", categoria: "MASSAS_LONGAS", preco: 88, descricao: "Tagliatelle artesanal com ragù de carne cozido lentamente e parmesão.", imagem: MASSA },
  { nome: "Linguine ai Gamberi", categoria: "MASSAS_LONGAS", preco: 108, descricao: "Linguine, camarões, tomate-cereja, alho, vinho branco e ervas.", imagem: MASSA },
  { nome: "Spaghetti al Pomodoro", categoria: "MASSAS_LONGAS", preco: 72, descricao: "Spaghetti artesanal, molho de tomates italianos, manjericão e parmesão.", imagem: MASSA },
  { nome: "Pappardelle al Funghi", categoria: "MASSAS_LONGAS", preco: 94, descricao: "Pappardelle artesanal, mix de cogumelos, creme de parmesão e ervas frescas.", imagem: MASSA },
  { nome: "Ravioli di Burrata", categoria: "MASSAS_RECHEADAS", preco: 94, descricao: "Recheado com burrata, molho de tomates assados e manjericão.", imagem: MASSA },
  { nome: "Ravioli di Zucca", categoria: "MASSAS_RECHEADAS", preco: 88, descricao: "Recheado de abóbora, manteiga de sálvia e parmesão.", imagem: MASSA },
  { nome: "Tortellini di Carne", categoria: "MASSAS_RECHEADAS", preco: 92, descricao: "Recheado com carne e molho de parmesão.", imagem: MASSA },
  { nome: "Cappelletti ai Funghi", categoria: "MASSAS_RECHEADAS", preco: 98, descricao: "Recheado com cogumelos, creme de parmesão e azeite trufado.", imagem: MASSA },
  { nome: "Ravioli di Spinaci e Ricotta", categoria: "MASSAS_RECHEADAS", preco: 90, descricao: "Espinafre e ricota, molho de manteiga e ervas.", imagem: MASSA },
  { nome: "Filetto Vellari", categoria: "CARNES", preco: 158, descricao: "Filé-mignon grelhado, molho de vinho tinto e purê de batatas.", imagem: CARNE },
  { nome: "Bistecca alla Fiorentina", categoria: "CARNES", preco: 218, descricao: "Corte bovino grelhado ao estilo toscano, com batatas rústicas e ervas.", imagem: CARNE },
  { nome: "Osso Buco alla Milanese", categoria: "CARNES", preco: 168, descricao: "Carne cozida lentamente com ervas e vinho branco, acompanhada de risoto.", imagem: CARNE },
  { nome: "Costolette d'Agnello", categoria: "CARNES", preco: 178, descricao: "Costeletas de cordeiro grelhadas com ervas e batatas douradas.", imagem: CARNE },
  { nome: "Tiramisù Vellari", categoria: "SOBREMESAS", preco: 46, descricao: "Clássico italiano com café, mascarpone, cacau e biscoito champagne.", imagem: foto("photo-1571877227200-a0d98ea607e9") },
  { nome: "Panna Cotta", categoria: "SOBREMESAS", preco: 42, descricao: "Panna cotta de baunilha e frutas vermelhas.", imagem: foto("photo-1488477181946-6428a0291777") },
  { nome: "Cannoli Siciliano", categoria: "SOBREMESAS", preco: 44, descricao: "Massa crocante recheada com ricota, pistache e chocolate.", imagem: DOCE },
  { nome: "Torta al Cioccolato", categoria: "SOBREMESAS", preco: 48, descricao: "Chocolate intenso e ganache.", imagem: DOCE },
  { nome: "Aperol Spritz", categoria: "BEBIDAS", preco: 46, descricao: "Aperol, espumante e água com gás.", imagem: foto("photo-1513558161293-c35c0016808b") },
  { nome: "Negroni", categoria: "BEBIDAS", preco: 52, descricao: "Gin, vermute rosso e bitter.", imagem: foto("photo-1513558161293-c35c0016808b") },
  { nome: "Vinho Tinto — taça", categoria: "BEBIDAS", preco: 38, descricao: "Seleção da casa.", imagem: foto("photo-1510812431401-41d2bd2722f3") },
  { nome: "Água com gás", categoria: "BEBIDAS", preco: 9, descricao: "Água mineral com gás.", imagem: foto("photo-1548839140-29a749e1cf4d") },
  { nome: "Limonada Siciliana", categoria: "BEBIDAS", preco: 22, descricao: "Limão-siciliano, água e um toque de frescor.", imagem: foto("photo-1513558161293-c35c0016808b") },
];

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

async function criarFuncionario(): Promise<string | null> {
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  const senha = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !senha) {
    console.log("SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD ausentes: funcionário não criado.");
    return null;
  }

  const existente = await prisma.user.findUnique({ where: { email } });
  if (!existente) {
    await auth.api.signUpEmail({
      body: { name: "Equipe Casa Vellari", email, password: senha },
    });
  }
  const user = await prisma.user.update({
    where: { email },
    data: { role: "FUNCIONARIO" },
  });
  console.log(`Funcionário pronto: ${email}`);
  return user.id;
}

async function criarPratos(funcionarioId: string) {
  let criados = 0;
  for (const p of pratos) {
    const existe = await prisma.prato.findFirst({ where: { nome: p.nome } });
    if (existe) continue;
    await prisma.prato.create({
      data: {
        nome: p.nome,
        descricao: p.descricao,
        preco: p.preco,
        categoria: p.categoria,
        imagemUrl: p.imagem,
        criadoPorId: funcionarioId,
      },
    });
    criados++;
  }
  const total = await prisma.prato.count();
  console.log(`Pratos criados agora: ${criados} | Total no banco: ${total}`);
}

async function main() {
  await criarMesas();
  const funcionarioId = await criarFuncionario();
  if (funcionarioId) await criarPratos(funcionarioId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
