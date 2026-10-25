import Link from "next/link";

export default function Footer() {
  return (
    <>
      <section className="contact-strip">
        <div>
          <span className="contact-icon">⌖</span>
          <div>
            <strong>Estamos em Ipanema</strong>
            <p>Rio de Janeiro · RJ</p>
          </div>
        </div>
        <div>
          <span className="contact-icon">◷</span>
          <div>
            <strong>Reservas das 18h às 22h</strong>
            <p>Cada reserva dura 2 horas</p>
          </div>
        </div>
        <div>
          <span className="contact-icon">✉</span>
          <div>
            <strong>Fale com a gente</strong>
            <p>contato demonstrativo</p>
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark">CV</span>
          <span className="brand-name">
            CASA <b>V</b>ELLARI<small>CUCINA ITALIANA, CON ANIMA CARIOCA</small>
          </span>
        </Link>
        <p>Uma experiência italiana contemporânea, feita para compartilhar bons momentos.</p>
        <div className="footer-bottom">
          <span>© 2026 Casa Vellari · Projeto acadêmico · dados fictícios</span>
          <Link href="/">Voltar ao início ↑</Link>
        </div>
      </footer>
    </>
  );
}
