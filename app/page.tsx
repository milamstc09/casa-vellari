import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CardPrato from "@/components/CardPrato";

export const dynamic = "force-dynamic";

const DESTAQUES = [
  "Burrata Vellari",
  "Tagliatelle al Ragù",
  "Ravioli di Burrata",
  "Filetto Vellari",
  "Tiramisù Vellari",
  "Aperol Spritz",
];

export default async function Home() {
  let pratos = await prisma.prato.findMany({
    where: { nome: { in: DESTAQUES } },
    orderBy: { categoria: "asc" },
  });
  if (pratos.length < 3) {
    pratos = await prisma.prato.findMany({ orderBy: { createdAt: "asc" }, take: 6 });
  }

  return (
    <main>
      <section className="hero" id="inicio">
        <div className="hero-content">
          <p className="eyebrow">IPANEMA · RIO DE JANEIRO</p>
          <h1>
            Uma mesa italiana.
            <br />
            <em>Uma alma carioca.</em>
          </h1>
          <p className="hero-copy">
            Receitas artesanais, ingredientes selecionados e bons momentos para compartilhar.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/reservar">
              Reserve sua mesa
            </Link>
            <Link className="btn btn-outline" href="/cardapio">
              Conheça o cardápio
            </Link>
          </div>
        </div>
        <div className="hero-note">
          <span>La vita è più bella</span>
          <span>quando condivisa.</span>
        </div>
      </section>

      <section className="intro section" id="historia">
        <div className="intro-image" role="img" aria-label="Mesa elegante com comida italiana" />
        <div className="intro-text">
          <p className="eyebrow">BENVENUTI A CASA</p>
          <h2>
            Conheça a <em>Casa Vellari</em>
          </h2>
          <p>
            A Casa Vellari nasceu em 2018, em Ipanema, do sonho de uma família apaixonada pela
            cozinha italiana e pela hospitalidade carioca. O que começou como um pequeno
            restaurante de bairro virou um espaço moderno e aconchegante, de luz suave, madeira
            clara e mesas pensadas para boas conversas.
          </p>
          <p>
            Nossa proposta é simples: massas feitas todos os dias, ingredientes selecionados,
            carnes preparadas com calma e uma carta de vinhos para acompanhar. Queremos que cada
            visita seja uma experiência acolhedora, de casais em jantares especiais a famílias
            reunidas ao redor da mesa.
          </p>
          <Link className="text-link" href="/cardapio">
            Descubra nossos sabores <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="menu-section section">
        <div className="section-heading">
          <p className="eyebrow">IL NOSTRO MENU</p>
          <h2>
            Feito com tempo.
            <br />
            <em>Servido com afeto.</em>
          </h2>
          <p>Clássicos italianos com um toque da nossa casa.</p>
        </div>
        {pratos.length === 0 ? (
          <p className="muted" style={{ textAlign: "center" }}>
            O cardápio será publicado em breve.
          </p>
        ) : (
          <div className="menu-grid">
            {pratos.map((p) => (
              <CardPrato key={p.id} prato={{ ...p, preco: Number(p.preco) }} />
            ))}
          </div>
        )}
        <div className="center">
          <Link className="btn btn-dark" href="/cardapio">
            Ver cardápio completo
          </Link>
        </div>
      </section>

      <section className="reservation-banner">
        <div>
          <p className="eyebrow">IL TUO TAVOLO TI ASPETTA</p>
          <h2>
            Tem momentos que
            <br />
            <em>merecem uma mesa.</em>
          </h2>
          <p>Escolha seu dia, horário e venha viver uma experiência Casa Vellari.</p>
        </div>
        <Link className="btn btn-light" href="/reservar">
          Faça sua reserva <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
