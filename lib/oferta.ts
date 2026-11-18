// Em que fase está uma oferta com prazo (Black Friday). Função pura,
// testada em tests/ficha.test.mjs.

export type FaseOferta = 'antes' | 'durante' | 'encerrada';

export function faseOferta(
  prazo: { inicio?: string; fim: string },
  agora: number,
): { fase: FaseOferta; restanteMs: number } {
  const inicio = prazo.inicio ? Date.parse(prazo.inicio) : -Infinity;
  const fim = Date.parse(prazo.fim);
  if (agora >= fim) return { fase: 'encerrada', restanteMs: 0 };
  if (agora < inicio) return { fase: 'antes', restanteMs: inicio - agora };
  return { fase: 'durante', restanteMs: fim - agora };
}

export function partesTempo(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(t / 86400),
    horas: Math.floor((t % 86400) / 3600),
    min: Math.floor((t % 3600) / 60),
    seg: t % 60,
  };
}
