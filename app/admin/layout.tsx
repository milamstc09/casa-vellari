import Link from "next/link";

// A proteção de verdade está em cada página e em cada action (exigirFuncionario).
// Este layout só desenha o menu da área administrativa.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-area">
      <nav
        className="admin-tabs mx-auto max-w-4xl px-4 pt-8"
        aria-label="Área administrativa"
      >
        <Link className="admin-tab" href="/admin">
          Visão geral
        </Link>
        <Link className="admin-tab" href="/admin/reservas">
          Reservas
        </Link>
        <Link className="admin-tab" href="/admin/mesas">
          Mesas
        </Link>
        <Link className="admin-tab" href="/admin/pratos">
          Cardápio
        </Link>
      </nav>
      {children}
    </div>
  );
}
