"use client";

export default function BotaoExcluir({
  confirmacao,
  rotulo = "Excluir",
}: {
  confirmacao: string;
  rotulo?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmacao)) e.preventDefault();
      }}
      className="rounded-md border border-vermelho bg-white px-3 py-1 text-sm text-vermelho hover:bg-red-50"
    >
      {rotulo}
    </button>
  );
}
