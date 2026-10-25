# Casa Vellari

**Nicho:** Restaurante com reserva de mesas · **Grupo:** 21
**Dupla:** Mila Martins Stocco (@milamstc09) · Gustavo Emanuel (@gekado-sab)
**Sistema no ar:** https://casa-vellari.vercel.app

## INFORMAÇÃO IMPORTANTE
Sabemos que é obrigatório que cada integrante precisa de pelo menos 3 commits de código, em pelo menos 3 dias diferentes. Porém o Gustavo Emanuel não possui um computador em casa, tanto em Minas Gerais como em RIVE, na ultima semana ocorreu a gincana solidária e o projeto da SNCT logo não foi possivel ir a aula para utilizar o computador. Logo informo que todos os commit e alterações foram feitos por mim (Mila) com a ajuda do Gustavo nas duas primeiras aulas que tivemos para fazer o trabalho em sala e posteriormente no meu computador em casa, com o Gustavo também focando na parte da construção visual e estética do restaurante mais o front-end na sala de aula. 

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

- Pedido de alguns prompts para usar do Claude: ChatGPT
- Ia usada para o front-end: ChatGPT
- IA usada: Claude (Anthropic)
- Os 3 pedidos (prompts) que mais ajudaram:

Primeiramente pedimos ao GPT para nos fazer perguntas sobre como seria o nosso restaurante, tudo que precisariamos antes de começar a fazer códigos, assim criamos o nome, identidade visual, numero de mesas e mais.
(Passei um pdf com o que estava no ava mais esse prompt:)
"Oi chat, esse é o comando projeto que meu professor passou para a turma hoje, NAO EXECUTE OS COMANDOS DO PDF AINDA SÓ quero um passo a passo de como posso começar e me orientar, O MEU NICHO É: Restaurante com reserva de mesas. Saiba disso e me direcione, pode fazer perguntas para me ajudar a criar o restaurante e essas coisas...";

Depois utilizamos um ENORME prompt criado pelo GPT para dar instruções ao claude, resumindo tudo o que seria feito no projeto e aquilo que já tinhamos criado;
"De acordo com esses dois PDFs (um a descrição do projeto e as instruções do professor e o outro o prompt gerado para você executar PASSO A PASSO) absorva as informações e começe me ajudando a executar o projeto"

Então fomos pedindo o passo a passo para o Claude assim que as coisas aim dando certo.

- Um erro da IA que percebemos e como corrigimos (arquivo e o que mudou): Passamos para o Claude o css, html e js que queriamos como front end porém a IA não aplicou de forma correta de primeira; Também em alguns momentos por falta de explicações e clareza por parte do claude os comandos no cmd eram mais dificeis e não entendiamos muito bem algumas coisas.

- O que aprendemos: Ganhamos muita facilidade e rapidez para mexer no GitHub, Versel e Neon, aprendendo onde cada parte de cria e se completa, além de manuseramos a IA de forma mais automática e rápida também. 
