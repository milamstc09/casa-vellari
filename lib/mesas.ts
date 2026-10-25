export function nomeDaMesa(numero: number): string {
  return `Mesa ${String(numero).padStart(2, "0")}`;
}