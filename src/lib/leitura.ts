export const LEITURA_MINIMA = 0.75;

interface Medidas { topo: number; altura: number; fimDaTela: number }

// Fração do texto (0 a 1) que já passou pela parte de baixo da tela.
export function progressoLeitura({ topo, altura, fimDaTela }: Medidas): number {
  if (altura <= 0) return 0;
  return Math.min(1, Math.max(0, (fimDaTela - topo) / altura));
}
