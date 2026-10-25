# Casa Vellari

**Nicho:** Restaurante com reserva de mesas · **Grupo:** [PREENCHER nº da planilha]
**Dupla:** [PREENCHER Nome 1] (@milamstc09) · [PREENCHER Nome 2] (@usuario-github-2)
**Sistema no ar:** https://casa-vellari.vercel.app

## O que o sistema faz

Casa Vellari é um restaurante italiano fictício em Ipanema (Rio de Janeiro). O site tem página inicial
com a história do restaurante, cardápio público com busca, cadastro e login de clientes, reserva de mesas
e uma área administrativa para funcionários.

- Cliente: cadastra-se, faz login, reserva uma mesa (data, horário de 18h a 22h e número de pessoas),
  vê a própria reserva futura e pode cancelá-la até 10 horas antes.
- Funcionário: gerencia mesas (CRUD), pratos do cardápio (CRUD com foto) e reservas.
- Cada reserva dura 2 horas. O sistema impede duas reservas na mesma mesa em horários que se sobrepõem
  e só oferece mesas com lugares suficientes.
- Cada cliente pode ter somente uma reserva futura por vez.
- Todos os dados do site são fictícios.

## Páginas para testar

- Pública: `/`
- Cardápio: `/cardapio`
- Busca que encontra: `/cardapio?busca=lasanha` (troque por um prato que exista, ex.: `/cardapio?busca=burrata`)
- Busca sem resultado: `/cardapio?busca=xyzabc`
- Versão do deploy: `/api/versao`
- Protegida (pede login): `/admin` (funcionário) · `/minha-conta` e `/reservar` (cliente logado)

## Banco de dados

PostgreSQL (Neon) acessado pelo Prisma 7. As migrations ficam em `prisma/migrations`.

| Tabela | Principais campos |
|---|---|
| `user` | id, name, email, role (`CLIENTE` ou `FUNCIONARIO`) |
| `session`, `account`, `verification` | tabelas do Better Auth (a senha fica em `account`, com hash) |
| `Mesa` | id, numero (único), capacidade |
| `Reserva` | id, userId, mesaId, inicio, fim, pessoas, status (`CONFIRMADA`/`CANCELADA`), canceladaEm |
| `Prato` | id, nome, descricao, preco, categoria, imagemUrl (Vercel Blob), criadoPorId |

Relações:

- **Mesa 1 ─── N Reserva** (uma mesa tem várias reservas em datas e horários diferentes).
  Uma mesa com reservas não pode ser excluída.
- User 1 ─── N Reserva
- User 1 ─── N Prato (autoria)

## Como rodar no computador

1. `git clone https://github.com/milamstc09/casa-vellari.git` e `cd casa-vellari`
2. `npm install`
3. Copie `.env.example` para `.env` e preencha (use um branch **dev** do Neon, nunca o de produção).
4. `npx prisma migrate dev` (cria as tabelas) e depois `npx prisma generate`
5. `npx prisma db seed` (20 mesas, conta de funcionário e 27 pratos)
6. `npm run dev` e abra http://localhost:3000

## Como usamos a IA

- IA usada: Claude (Anthropic)
- Os 3 pedidos (prompts) que mais ajudaram: [PREENCHER]
- Um erro da IA que percebemos e como corrigimos (arquivo e o que mudou): [PREENCHER com um erro REAL]
- O que aprendemos: [PREENCHER]
