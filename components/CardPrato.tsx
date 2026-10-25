type Props = {
  prato: { nome: string; descricao: string; imagemUrl: string | null; preco: number };
};

const reais = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function CardPrato({ prato }: Props) {
  const fundo = prato.imagemUrl
    ? { backgroundImage: `url("${prato.imagemUrl}")` }
    : { background: "linear-gradient(135deg,#123b2b,#1e4b38)" };

  return (
    <article className="dish-card">
      <div className="dish-image" style={fundo} role="img" aria-label={prato.nome} />
      <div className="dish-content">
        <div className="dish-top">
          <h3>{prato.nome}</h3>
          <span className="price">{reais(prato.preco)}</span>
        </div>
        <p>{prato.descricao}</p>
      </div>
    </article>
  );
}
