'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from './icons';

export type LinkMenu = { id: string; label: string };

/**
 * Menu fixo do topo: links para as seções (marca a seção visível),
 * WhatsApp e o botão de inscrição. Ganha sombra quando a página rola.
 */
export default function Cabecalho({
  links,
  escuro,
  ctaTexto,
  onCta,
  waHref,
}: {
  links: LinkMenu[];
  escuro: boolean;
  ctaTexto: string;
  onCta: () => void;
  waHref: string;
}) {
  const [ativo, setAtivo] = useState('');
  const [rolou, setRolou] = useState(false);
  const ids = links.map((l) => l.id).join(',');

  useEffect(() => {
    // Seção "ativa" = a que cruza o meio da tela.
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setAtivo(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const id of ids.split(',')) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }
    const onScroll = () => {
      setRolou(window.scrollY > 8);
      if (window.scrollY < 200) setAtivo('');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [ids]);

  return (
    <header
      style={{
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: rolou ? (escuro ? '0 8px 24px rgba(0,0,0,.5)' : '0 6px 20px rgba(22,24,29,.08)') : 'none',
        transition: 'box-shadow .2s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <a href="#" aria-label="Voltar ao topo" style={{ display: 'flex', flex: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-instituto-top.png"
            alt="Instituto Top, Treinamentos e Qualificação"
            style={
              escuro
                ? { height: 52, width: 52, objectFit: 'contain', background: '#fff', borderRadius: '50%', padding: 3 }
                : { height: 56, width: 'auto' }
            }
          />
        </a>

        <nav aria-label="Seções da página" className="menu-links" style={{ flex: 1, justifyContent: 'center' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: 4 }}>
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="menu-link"
                  aria-current={ativo === l.id ? 'true' : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto', flex: 'none' }}>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="menu-wa"
            aria-label="Falar no WhatsApp: (51) 99562-2999"
          >
            <WhatsAppIcon size={18} />
            <span className="menu-wa-num">(51) 99562-2999</span>
          </a>
          <button
            onClick={onCta}
            className="btn-yellow"
            style={{
              background: '#FFB800',
              color: '#16181D',
              border: 'none',
              borderRadius: 8,
              padding: '12px 20px',
              font: "700 15px 'Barlow',sans-serif",
              cursor: 'pointer',
              minHeight: 44,
              whiteSpace: 'nowrap',
            }}
          >
            {ctaTexto}
          </button>
        </div>
      </div>
    </header>
  );
}
