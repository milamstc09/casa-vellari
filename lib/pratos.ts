export const CATEGORIAS = [
  { valor: "ENTRADAS", rotulo: "Entradas" },
  { valor: "MASSAS_LONGAS", rotulo: "Massas longas" },
  { valor: "MASSAS_RECHEADAS", rotulo: "Massas recheadas" },
  { valor: "CARNES", rotulo: "Carnes" },
  { valor: "SOBREMESAS", rotulo: "Sobremesas" },
  { valor: "BEBIDAS", rotulo: "Bebidas" },
] as const;

export type ValorCategoria = (typeof CATEGORIAS)[number]["valor"];

export const VALORES_CATEGORIA = CATEGORIAS.map((c) => c.valor) as [
  ValorCategoria,
  ...ValorCategoria[],
];

export function rotuloCategoria(valor: string): string {
  return CATEGORIAS.find((c) => c.valor === valor)?.rotulo ?? valor;
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
