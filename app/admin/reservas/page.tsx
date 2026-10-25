import { prisma } from "@/lib/prisma";
import { exigirFuncionario } from "@/lib/permissoes";
import { nomeDaMesa } from "@/lib/mesas";
import { formatarData, formatarHora } from "@/lib/reservas";
import BotaoExcluir from "@/components/BotaoExcluir";
import { cancelarReservaAdmin } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await exigirFuncionario();
  const { ok, erro } = await searchParams;

  const reservas = await prisma.reserva.findMany({
    orderBy: { inicio: "desc" },
    take: 100,
    include: {
      mesa: true,
      user: { select: { name: true, email: true } },
    },
  });
  const agora = new Date();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#123b2b" }}>
        Reservas
      </h2>
      <p className="muted">Últimas 100 reservas, da mais nova para a mais antiga.</p>

      {ok && (
        <p role="status" style={{ color: "#123b2b", margin: "12px 0" }}>
          {ok}
        </p>
      )}
      {erro && (
        <p role="alert" style={{ color: "#a92e2b", margin: "12px 0" }}>
          {erro}
        </p>
      )}

      <div className="admin-panel" style={{ marginTop: 16 }}>
        {reservas.length === 0 ? (
          <p className="muted">Nenhuma reserva registrada.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Horário</th>
                <th>Mesa</th>
                <th>Pessoas</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id}>
                  <td>{formatarData(r.inicio)}</td>
                  <td>
                    {formatarHora(r.inicio)}–{formatarHora(r.fim)}
                  </td>
                  <td>{nomeDaMesa(r.mesa.numero)}</td>
                  <td>{r.pessoas}</td>
                  <td>
                    {r.user.name}
                    <br />
                    <small>{r.user.email}</small>
                  </td>
                  <td>
                    <span className={`status ${r.status === "CANCELADA" ? "cancelled" : ""}`}>
                      {r.status === "CANCELADA" ? "Cancelada" : "Confirmada"}
                    </span>
                  </td>
                  <td>
                    {r.status === "CONFIRMADA" && r.inicio > agora ? (
                      <form action={cancelarReservaAdmin}>
                        <input type="hidden" name="id" value={r.id} />
                        <BotaoExcluir confirmacao="Cancelar esta reserva?" rotulo="Cancelar" />
                      </form>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
