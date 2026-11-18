'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from './icons';

/**
 * Barra de ação fixa no rodapé da tela, só no celular (CSS esconde no desktop).
 * Some quando a ficha de inscrição já está visível.
 */
export default function BarraMobile({
  ctaTexto,
  onCta,
  waHref,
  alvoId,
}: {
  ctaTexto: string;
  onCta: () => void;
  waHref: string;
  alvoId: string;
}) {
  const [escondida, setEscondida] = useState(false);

  useEffect(() => {
    const alvo = document.getElementById(alvoId);
    if (!alvo) return;
    const obs = new IntersectionObserver(([e]) => setEscondida(e.isIntersecting), { threshold: 0.05 });
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [alvoId]);

  return (
    <div className="barra-mobile" data-escondida={escondida ? '' : undefined} aria-hidden={escondida || undefined}>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-green barra-mobile-wa"
        aria-label="Falar no WhatsApp"
        tabIndex={escondida ? -1 : undefined}
      >
        <WhatsAppIcon size={24} color="#ffffff" />
      </a>
      <button onClick={onCta} className="btn-yellow barra-mobile-cta" tabIndex={escondida ? -1 : undefined}>
        {ctaTexto}
      </button>
    </div>
  );
}
