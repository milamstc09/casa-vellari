import Link from "next/link";
import { exigirLogin } from "@/lib/permissoes";
import { nomeDaMesa } from "@/lib/mesas";
import {
  calcularFim,
  formatarData,
  formatarDataHora,
  formatarHora,
  limiteCancelamento,
  podeCancelar,
  reservaFuturaDoUsuario,
} from "@/lib/reservas";
import { cancelarReserva } from "./actions";
import BotaoExcluir from "@/components/BotaoExcluir";

export const dynamic = "force-dynamic";

export default async function MinhaContaPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const session = await exigirLogin();
  const { ok, erro } = await searchParams;
  const reserva = await reservaFuturaDoUsuario(session.user.id);

  return (
    <main className="my-bookings section" style={{ minHeight: "55vh" }}>
      <div className="section-heading left">
        <p className="eyebrow">IL TUO SPAZIO</p>
        <h2>Minha reserva</h2>
        <p>
          Olá, {session.user.name}. Aqui você vê sua reserva futura e pode cancelá-la até 10 horas
          antes.
        </p>
      </div>

      {ok && (
        <p role="status" style={{ color: "#123b2b", marginBottom: 16 }}>
          {ok}
        </p>
      )}
      {erro && (
        <p role="alert" style={{ color: "#a92e2b", marginBottom: 16 }}>
          {erro}
        </p>
      )}

      {!reserva ? (
        <div>
          <p className="muted">Você não tem nenhuma reserva futura.</p>
          <Link className="btn btn-dark" href="/reservar" style={{ marginTop: 16 }}>
            Reservar mesa
          </Link>
        </div>
      ) : (
        <div className="reservation-list">
          <article className="reservation-card">
            <div>
              <h3>{nomeDaMesa(reserva.mesa.numero)}</h3>
              <p>
                {formatarData(reserva.inicio)} · {formatarHora(reserva.inicio)} às{" "}
                {formatarHora(calcularFim(reserva.inicio))} (2 horas)
              </p>
              <p>{reserva.pessoas} pessoa(s)</p>
              <span className="status">Confirmada</span>
              <p>
                Cancelamento permitido até {formatarDataHora(limiteCancelamento(reserva.inicio))}.
              </p>
            </div>
            {podeCancelar(reserva.inicio) ? (
              <form action={cancelarReserva}>
                <input type="hidden" name="id" value={reserva.id} />
                <BotaoExcluir confirmacao="Deseja cancelar esta reserva?" rotulo="Cancelar reserva" />
              </form>
            ) : (
              <p className="muted">O prazo para cancelar já passou.</p>
            )}
          </article>
        </div>
      )}
    </main>
  );
}
