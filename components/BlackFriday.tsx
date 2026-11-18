'use client';

import { useEffect, useState } from 'react';
import type { BlackFriday } from '@/lib/courses';
import { faseOferta, partesTempo } from '@/lib/oferta';

const AMARELO = '#FFB800';
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * A oferta está no ar? Começa `true` (igual ao HTML do servidor) e vira
 * `false` sozinha quando passa do `fim`, sem precisar de novo deploy.
 */
export function useOfertaAtiva(bf?: BlackFriday): boolean {
  const [ativa, setAtiva] = useState(Boolean(bf));
  useEffect(() => {
    if (!bf) return;
    const falta = Date.parse(bf.fim) - Date.now();
    if (falta <= 0) {
      setAtiva(false);
      return;
    }
    const id = setTimeout(() => setAtiva(false), Math.min(falta, 2_147_483_647));
    return () => clearTimeout(id);
  }, [bf]);
  return ativa;
}

/** Contagem regressiva. Antes do `inicio` conta até começar; depois, até acabar. */
export function Contagem({ bf, compacta = false }: { bf: BlackFriday; compacta?: boolean }) {
  const [agora, setAgora] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setAgora(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const r = agora === null ? null : faseOferta(bf, agora);
  const t = partesTempo(r?.restanteMs ?? 0);
  const rotulo = r?.fase === 'antes' ? 'Começa em' : 'Termina em';
  const blocos: [string, string][] = [
    [r ? pad(t.dias) : '--', 'dias'],
    [r ? pad(t.horas) : '--', 'h'],
    [r ? pad(t.min) : '--', 'min'],
    [r ? pad(t.seg) : '--', 's'],
  ];

  return (
    <div
      role="timer"
      aria-label={r ? `${rotulo} ${t.dias} dias, ${t.horas} horas e ${t.min} minutos` : 'Contagem regressiva'}
      style={{ display: 'flex', alignItems: 'center', gap: compacta ? 8 : 12, flexWrap: 'wrap' }}
    >
      <span
        style={{
          font: `700 ${compacta ? 12 : 13}px 'Barlow',sans-serif`,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: '#D4D4D8',
        }}
      >
        {rotulo}
      </span>
      <div aria-hidden="true" style={{ display: 'flex', gap: compacta ? 4 : 8 }}>
        {blocos.map(([valor, unidade]) => (
          <span
            key={unidade}
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 2,
              background: '#16171B',
              border: '1px solid #2A2B31',
              borderRadius: 8,
              padding: compacta ? '3px 7px' : '8px 12px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <strong style={{ font: `800 ${compacta ? 17 : 28}px/1 'Barlow Condensed',sans-serif`, color: AMARELO }}>
              {valor}
            </strong>
            <small style={{ fontSize: compacta ? 11 : 12, color: '#A1A1AA', fontWeight: 600 }}>{unidade}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Etiqueta "BLACK FRIDAY" inclinada, na identidade do banner. */
export function SeloBlackFriday({ bf, grande = false }: { bf: BlackFriday; grande?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'stretch', flexWrap: 'wrap', gap: 8 }}>
      <span
        style={{
          background: AMARELO,
          color: '#0A0A0B',
          font: `800 ${grande ? 22 : 14}px/1 'Barlow Condensed',sans-serif`,
          letterSpacing: grande ? 1.5 : 1,
          textTransform: 'uppercase',
          padding: grande ? '9px 16px' : '5px 10px',
          transform: 'skewX(-10deg)',
          borderRadius: 4,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <span style={{ transform: 'skewX(10deg)' }}>Black Friday</span>
      </span>
      <span
        style={{
          border: `1.5px solid ${AMARELO}`,
          color: AMARELO,
          font: `800 ${grande ? 22 : 14}px/1 'Barlow Condensed',sans-serif`,
          letterSpacing: 1,
          textTransform: 'uppercase',
          padding: grande ? '8px 14px' : '4px 10px',
          borderRadius: 4,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {bf.selo}
      </span>
    </span>
  );
}

/** Faixa fina no topo: substitui a faixa zebrada enquanto a oferta vale. */
export function BarraBlackFriday({ bf, onCta }: { bf: BlackFriday; onCta: () => void }) {
  return (
    <div style={{ background: '#000', borderBottom: `2px solid ${AMARELO}`, color: '#fff' }}>
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px 20px',
          flexWrap: 'wrap',
        }}
      >
        <SeloBlackFriday bf={bf} />
        <button
          onClick={onCta}
          className="link-bf"
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            font: "700 15px 'Barlow',sans-serif",
            cursor: 'pointer',
            padding: '6px 0',
            minHeight: 32,
          }}
        >
          {bf.prazo} · {bf.precoPor}
        </button>
        <Contagem bf={bf} compacta />
      </div>
    </div>
  );
}

/** Preço em destaque no hero. */
export function PrecoHero({ bf }: { bf: BlackFriday }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        borderLeft: `4px solid ${AMARELO}`,
        paddingLeft: 16,
      }}
    >
      {bf.precoDe && (
        <span style={{ color: '#A1A1AA', fontSize: 16 }}>
          de <s>{bf.precoDe}</s> por
        </span>
      )}
      <span style={{ font: "800 clamp(44px,6vw,64px)/1 'Barlow Condensed',sans-serif", color: AMARELO }}>
        {bf.precoPor}
      </span>
      <span style={{ color: '#D4D4D8', fontSize: 15 }}>
        {bf.precoNota} · <strong style={{ color: '#fff' }}>{bf.prazo}</strong>
      </span>
    </div>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={AMARELO} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Card de investimento no modo Black Friday (substitui o card normal). */
export function CardOferta({ bf, onCta }: { bf: BlackFriday; onCta: () => void }) {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: '0 auto',
        background: '#000',
        color: '#fff',
        borderRadius: 20,
        border: `2px solid ${AMARELO}`,
        boxShadow: '0 0 60px rgba(255,184,0,.12)',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 22,
        textAlign: 'center',
      }}
    >
      <SeloBlackFriday bf={bf} grande />
      <h2 style={{ margin: 0, font: "800 clamp(28px,3.4vw,38px)/1.1 'Barlow Condensed',sans-serif", textTransform: 'uppercase' }}>
        {bf.prazo}
      </h2>
      <Contagem bf={bf} />

      {bf.lotes ? (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', display: 'grid', gap: 10 }}>
          {bf.lotes.map((l) => (
            <li
              key={l.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                padding: '14px 18px',
                borderRadius: 12,
                background: l.esgotado ? '#111113' : 'rgba(255,184,0,.1)',
                border: l.esgotado ? '1px solid #26272C' : `2px solid ${AMARELO}`,
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: l.esgotado ? '#A1A1AA' : '#fff' }}>{l.label}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                {l.esgotado ? (
                  <>
                    <s style={{ color: '#A1A1AA', font: "700 22px 'Barlow Condensed',sans-serif" }}>{l.preco}</s>
                    <span style={{ background: '#D3382E', color: '#fff', font: "800 12px 'Barlow',sans-serif", letterSpacing: 1, padding: '4px 8px', borderRadius: 4 }}>
                      ESGOTADO
                    </span>
                  </>
                ) : (
                  <>
                    <strong style={{ color: AMARELO, font: "800 clamp(30px,4vw,38px)/1 'Barlow Condensed',sans-serif" }}>{l.preco}</strong>
                    {l.nota && (
                      <span style={{ background: AMARELO, color: '#0A0A0B', font: "800 12px 'Barlow',sans-serif", letterSpacing: 1, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                        {l.nota}
                      </span>
                    )}
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <PrecoHero bf={bf} />
      )}

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 22px' }}>
        {bf.inclui.map((item) => (
          <li key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#E4E4E7' }}>
            <Check />
            {item}
          </li>
        ))}
      </ul>

      <button
        onClick={onCta}
        className="btn-yellow"
        style={{
          background: AMARELO,
          color: '#0A0A0B',
          border: 'none',
          borderRadius: 10,
          padding: '17px 34px',
          font: "800 18px 'Barlow',sans-serif",
          cursor: 'pointer',
          minHeight: 52,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        Garantir meu desconto
      </button>
    </div>
  );
}
