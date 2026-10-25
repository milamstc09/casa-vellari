import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await exigirFuncionario();

  const [mesas, pratos, futuras] = await Promise.all([
    prisma.mesa.count(),
    prisma.prato.count(),
    prisma.reserva.count({ where: { status: "CONFIRMADA", inicio: { gt: new Date() } } }),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="eyebrow">ÁREA INTERNA</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#123b2b" }}>
        Painel administrativo
      </h2>
      <p className="muted" style={{ marginBottom: 20 }}>
        Conectado como {session.user.email}
      </p>
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="stat-card">
          <span>Mesas</span>
          <strong>{mesas}</strong>
        </div>
        <div className="stat-card">
          <span>Pratos no cardápio</span>
          <strong>{pratos}</strong>
        </div>
        <div className="stat-card">
          <span>Reservas futuras</span>
          <strong>{futuras}</strong>
        </div>
      </div>
    </main>
  );
}
