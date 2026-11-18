'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from './icons';

export type LinkMenu = { id: string; label: string };

/**
 * Menu fixo do topo: links para as seções (marca a seção visível),
 * WhatsApp e o botão de inscrição. Ganha sombra quando a página rola.
 * Abaixo de 900px os links vão para um menu sanfona (botão de 3 riscos).
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
  const [aberto, setAberto] = useState(false);
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

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aberto]);

  const fechar = () => setAberto(false);

  return (
    <header
      style={{
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: rolou || aberto ? (escuro ? '0 8px 24px rgba(0,0,0,.5)' : '0 6px 20px rgba(22,24,29,.08)') : 'none',
        transition: 'box-shadow .2s ease',
      }}
    >
      <div className="menu-barra">
        <a href="#" aria-label="Voltar ao topo" onClick={fechar} style={{ display: 'flex', flex: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-instituto-top.png"
            alt="Instituto Top, Treinamentos e Qualificação"
            className="menu-logo"
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
                <a href={`#${l.id}`} className="menu-link" aria-current={ativo === l.id ? 'true' : undefined}>
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
          <button onClick={onCta} className="btn-yellow menu-cta">
            {ctaTexto}
          </button>
          <button
            className="menu-toggle"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setAberto((a) => !a)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {aberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu do celular: abre logo abaixo da barra. */}
      <nav id="menu-movel" aria-label="Menu" className="menu-movel" hidden={!aberto}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={fechar}
                className="menu-movel-link"
                aria-current={ativo === l.id ? 'true' : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-green menu-movel-wa" onClick={fechar}>
          <WhatsAppIcon size={20} />
          Falar no WhatsApp · (51) 99562-2999
        </a>
      </nav>
    </header>
  );
}
