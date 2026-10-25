import Link from "next/link";
import { exigirLogin } from "@/lib/permissoes";
import { nomeDaMesa } from "@/lib/mesas";
import {
  HORARIOS,
  calcularFim,
  criarInicio,
  formatarData,
  formatarHora,
  hojeNoRio,
  mesasDisponiveis,
  reservaFuturaDoUsuario,
} from "@/lib/reservas";
import { buscaReservaSchema } from "@/lib/validacoes/reserva";
import { criarReserva } from "./actions";

export const dynamic = "force-dynamic";

type Busca = {
  data?: string;
  horario?: string;
  pessoas?: string;
  mesa?: string;
  erro?: string;
};

export default async function ReservarPage({ searchParams }: { searchParams: Promise<Busca> }) {
  const session = await exigirLogin();
  const sp = await searchParams;

  const futura = await reservaFuturaDoUsuario(session.user.id);
  if (futura) {
    return (
      <main className="booking section">
        <div className="section-heading">
          <p className="eyebrow">PRENOTAZIONE</p>
          <h2>Você já tem uma reserva</h2>
          <p>
            Cada cliente pode ter somente uma reserva futura por vez. Para reservar outra mesa,
            cancele a atual.
          </p>
        </div>
        <div className="center">
          <Link className="btn btn-dark" href="/minha-conta">
            Ver minha reserva
          </Link>
        </div>
      </main>
    );
  }

  const data = sp.data ?? "";
  const horario = sp.horario ?? "";
  const pessoas = sp.pessoas ?? "";
  const consultou = Boolean(sp.data || sp.horario || sp.pessoas);

  let erro = sp.erro;
  let mesas: Awaited<ReturnType<typeof mesasDisponiveis>> | null = null;
  let inicio: Date | null = null;

  if (consultou && !erro) {
    const r = buscaReservaSchema.safeParse({ data, horario, pessoas });
    if (!r.success) {
      erro = r.error.issues[0].message;
    } else {
      const candidato = criarInicio(r.data.data, r.data.horario);
      if (Number.isNaN(candidato.getTime())) {
        erro = "Data inválida.";
      } else if (candidato.getTime() <= Date.now()) {
        erro = "Escolha uma data e um horário futuros.";
      } else {
        inicio = candidato;
        mesas = await mesasDisponiveis(candidato, calcularFim(candidato), r.data.pessoas);
      }
    }
  }

  const escolhida = mesas?.find((m) => m.id === sp.mesa) ?? null;
  const fim = inicio ? calcularFim(inicio) : null;

  function linkMesa(id: string) {
    return `/reservar?${new URLSearchParams({ data, horario, pessoas, mesa: id }).toString()}`;
  }

  return (
    <main className="booking section">
      <div className="section-heading">
        <p className="eyebrow">PRENOTAZIONE</p>
        <h2>Reserve sua mesa</h2>
        <p>Escolha os detalhes da sua visita. As reservas têm duração de duas horas.</p>
      </div>

      <div className="booking-form">
        {erro && (
          <p role="alert" className="field-wide" style={{ color: "#a92e2b", margin: 0 }}>
            {erro}
          </p>
        )}

        <form action="/reservar" method="get" className="field-wide" style={{ display: "contents" }}>
          <div className="field">
            <label htmlFor="data">Data</label>
            <input id="data" name="data" type="date" min={hojeNoRio()} defaultValue={data} required />
          </div>
          <div className="field">
            <label htmlFor="horario">Horário</label>
            <select id="horario" name="horario" defaultValue={horario} required>
              <option value="">Selecione</option>
              {HORARIOS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
          <div className="field field-wide">
            <label htmlFor="pessoas">Número de pessoas</label>
            <select id="pessoas" name="pessoas" defaultValue={pessoas} required>
              <option value="">Selecione</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "pessoa" : "pessoas"}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-dark field-wide" type="submit">
            Ver mesas disponíveis
          </button>
        </form>

        {mesas && (
          <div className="field field-wide">
            <label>Escolha uma mesa disponível</label>
            {mesas.length === 0 ? (
              <p className="muted">
                Não há mesas disponíveis para essa seleção. Tente outro horário ou outra data.
              </p>
            ) : (
              <div className="table-options">
                {mesas.map((m) => (
                  <Link
                    key={m.id}
                    href={linkMesa(m.id)}
                    className={`table-option ${escolhida?.id === m.id ? "selected" : ""}`}
                  >
                    <strong>{nomeDaMesa(m.numero)}</strong>
                    <span>Capacidade: {m.capacidade}</span>
                    <small>Disponível · 2 horas</small>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {escolhida && inicio && fim && (
          <>
            <div className="booking-summary field-wide">
              <strong>Confirme sua reserva</strong>
              <br />
              Data: {formatarData(inicio)} · Horário: {formatarHora(inicio)} às {formatarHora(fim)}{" "}
              (2 horas)
              <br />
              Pessoas: {pessoas} · {nomeDaMesa(escolhida.numero)} ({escolhida.capacidade} lugares)
            </div>
            <form action={criarReserva} className="field-wide" style={{ display: "contents" }}>
              <input type="hidden" name="data" value={data} />
              <input type="hidden" name="horario" value={horario} />
              <input type="hidden" name="pessoas" value={pessoas} />
              <input type="hidden" name="mesaId" value={escolhida.id} />
              <button className="btn btn-primary field-wide" type="submit">
                Confirmar reserva
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
