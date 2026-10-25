import Link from "next/link";
import { obterSessao } from "@/lib/permissoes";
import { sair } from "@/app/actions/sair";
import NavMenu from "@/components/NavMenu";

export default async function Navbar() {
  const session = await obterSessao();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Casa Vellari, início">
        <span className="brand-mark">CV</span>
        <span className="brand-name">
          CASA <b>V</b>ELLARI<small>CUCINA ITALIANA, CON ANIMA CARIOCA</small>
        </span>
      </Link>

      <NavMenu>
        <Link href="/">Início</Link>
        <Link href="/cardapio">Cardápio</Link>
        <Link href="/reservar">Reservar mesa</Link>
        {session && <Link href="/minha-conta">Minha reserva</Link>}
        {session?.user.role === "FUNCIONARIO" && <Link href="/admin">Admin</Link>}
        {session ? (
          <form action={sair}>
            <button type="submit" className="nav-login">
              Sair ({session.user.name.split(" ")[0]})
            </button>
          </form>
        ) : (
          <>
            <Link href="/cadastro">Cadastrar</Link>
            <Link href="/login" className="nav-login">
              Entrar
            </Link>
          </>
        )}
      </NavMenu>
    </header>
  );
}
