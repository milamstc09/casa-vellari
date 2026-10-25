"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { EstadoMesa } from "@/lib/validacoes/mesa";

type Props = {
  acao: (estado: EstadoMesa, formData: FormData) => Promise<EstadoMesa>;
  textoBotao: string;
  inicial?: { id: string; numero: number; capacidade: number };
};

const campo =
  "w-full rounded-md border border-linha bg-papel px-3 py-2 text-tinta outline-none focus:border-verde";

export default function FormMesa({ acao, textoBotao, inicial }: Props) {
  const [estado, formAcao, pendente] = useActionState<EstadoMesa, FormData>(acao, {});

  return (
    <form action={formAcao} noValidate className="mt-6 space-y-4">
      {estado.erro && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-vermelho">
          {estado.erro}
        </p>
      )}

      {inicial && <input type="hidden" name="id" value={inicial.id} />}

      <div>
        <label htmlFor="numero" className="mb-1 block text-sm font-medium">
          Número da mesa
        </label>
        <input
          id="numero"
          name="numero"
          inputMode="numeric"
          defaultValue={estado.valores?.numero ?? inicial?.numero}
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="capacidade" className="mb-1 block text-sm font-medium">
          Capacidade (lugares)
        </label>
        <input
          id="capacidade"
          name="capacidade"
          inputMode="numeric"
          defaultValue={estado.valores?.capacidade ?? inicial?.capacidade}
          className={campo}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pendente}
          className="rounded-md bg-verde px-5 py-2 font-semibold text-papel hover:bg-verde2 disabled:opacity-60"
        >
          {pendente ? "Salvando..." : textoBotao}
        </button>
        <Link
          href="/admin/mesas"
          className="rounded-md border border-linha px-5 py-2 hover:bg-papel"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}