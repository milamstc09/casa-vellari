"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CATEGORIAS } from "@/lib/pratos";
import type { EstadoPrato } from "@/lib/validacoes/prato";

type Props = {
  acao: (estado: EstadoPrato, formData: FormData) => Promise<EstadoPrato>;
  textoBotao: string;
  inicial?: {
    id: string;
    nome: string;
    descricao: string;
    preco: string;
    categoria: string;
    imagemUrl: string | null;
  };
};

const campo =
  "w-full rounded-md border border-linha bg-papel px-3 py-2 text-tinta outline-none focus:border-verde";

export default function FormPrato({ acao, textoBotao, inicial }: Props) {
  const [estado, formAcao, pendente] = useActionState<EstadoPrato, FormData>(acao, {});
  const v = estado.valores;

  return (
    <form action={formAcao} noValidate className="mt-6 space-y-4">
      {estado.erro && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-vermelho">
          {estado.erro}
        </p>
      )}

      {inicial && <input type="hidden" name="id" value={inicial.id} />}

      <div>
        <label htmlFor="nome" className="mb-1 block text-sm font-medium">Nome do prato</label>
        <input id="nome" name="nome" defaultValue={v?.nome ?? inicial?.nome} className={campo} />
      </div>

      <div>
        <label htmlFor="descricao" className="mb-1 block text-sm font-medium">Descrição</label>
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          defaultValue={v?.descricao ?? inicial?.descricao}
          className={campo}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="preco" className="mb-1 block text-sm font-medium">Preço (R$)</label>
          <input
            id="preco"
            name="preco"
            inputMode="decimal"
            placeholder="58,00"
            defaultValue={v?.preco ?? inicial?.preco}
            className={campo}
          />
        </div>
        <div>
          <label htmlFor="categoria" className="mb-1 block text-sm font-medium">Categoria</label>
          <select
            id="categoria"
            name="categoria"
            defaultValue={v?.categoria ?? inicial?.categoria ?? ""}
            className={campo}
          >
            <option value="">Selecione</option>
            {CATEGORIAS.map((c) => (
              <option key={c.valor} value={c.valor}>{c.rotulo}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="imagem" className="mb-1 block text-sm font-medium">
          Foto do prato (JPG, PNG, WEBP ou GIF, até 2 MB)
        </label>
        {inicial?.imagemUrl && (
          <p className="mb-2 text-sm">
            Foto atual salva. Envie outra só se quiser trocar.
          </p>
        )}
        <input id="imagem" name="imagem" type="file" accept="image/*" className={campo} />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pendente}
          className="rounded-md bg-verde px-5 py-2 font-semibold text-papel hover:bg-verde2 disabled:opacity-60"
        >
          {pendente ? "Salvando..." : textoBotao}
        </button>
        <Link href="/admin/pratos" className="rounded-md border border-linha bg-papel px-5 py-2">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
