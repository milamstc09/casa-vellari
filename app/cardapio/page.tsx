import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIAS } from "@/lib/pratos";
import CardPrato from "@/components/CardPrato";

export const dynamic = "force-dynamic";

export default async function CardapioPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string; categoria?: string }>;
}) {
  const sp = await searchParams;
  const busca = (sp.busca ?? "").trim().slice(0, 60);
  const categoria = CATEGORIAS.find((c) => c.valor === sp.categoria)?.valor;

  const pratos = await prisma.prato.findMany({
    where: {
      categoria: categoria ?? undefined,
      OR: busca
        ? [
            { nome: { contains: busca, mode: "insensitive" } },
            { descricao: { contains: busca, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: [{ categoria: "asc" }, { nome: "asc" }],
  });

  function link(cat?: string) {
    const q = new URLSearchParams();
    if (busca) q.set("busca", busca);
    if (cat) q.set("categoria", cat);
    const texto = q.toString();
    return texto ? `/cardapio?${texto}` : "/cardapio";
  }

  return (
    <main className="menu-section section">
      <div className="section-heading">
        <p className="eyebrow">IL NOSTRO MENU</p>
        <h2>
          Cardápio <em>Casa Vellari</em>
        </h2>
        <p>Pesquise um prato pelo nome ou pela descrição.</p>
      </div>

      <form action="/cardapio" method="get" className="lookup-form" style={{ margin: "0 auto 24px" }}>
        <input
          type="search"
          name="busca"
          defaultValue={busca}
          placeholder="Ex.: lasanha, burrata, tiramisù"
          aria-label="Buscar no cardápio"
        />
        {categoria && <input type="hidden" name="categoria" value={categoria} />}
        <button type="submit" className="btn btn-dark">
          Buscar
        </button>
      </form>

      <div className="category-filters">
        <Link href={link()} className={`filter-btn ${!categoria ? "active" : ""}`}>
          Todos
        </Link>
        {CATEGORIAS.map((c) => (
          <Link
            key={c.valor}
            href={link(c.valor)}
            className={`filter-btn ${categoria === c.valor ? "active" : ""}`}
          >
            {c.rotulo}
          </Link>
        ))}
      </div>

      {pratos.length === 0 ? (
        <p className="muted" style={{ textAlign: "center" }} role="status">
          {busca || categoria
            ? "Nenhum prato encontrado para sua busca."
            : "O cardápio ainda está vazio."}
        </p>
      ) : (
        <div className="menu-grid">
          {pratos.map((p) => (
            <CardPrato key={p.id} prato={{ ...p, preco: Number(p.preco) }} />
          ))}
        </div>
      )}
    </main>
  );
}
