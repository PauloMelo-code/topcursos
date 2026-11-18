// Ícones do Tabler Icons (MIT, tabler.io/icons), traço em viewBox 24.
const PATHS = {
  medal: (
    <>
      <path d="M12 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
      <path d="M12 15l3.4 5.89l1.598 -3.233l3.598 .232l-3.4 -5.889" />
      <path d="M6.802 12l-3.4 5.89l3.598 -.233l1.598 3.232l3.4 -5.889" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" />
      <path d="M15 19l2 2l4 -4" />
    </>
  ),
  user: (
    <>
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </>
  ),
  wheel: (
    <>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M12 14l0 7" />
      <path d="M10 12l-6.75 -2" />
      <path d="M14 12l6.75 -2" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
      <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
      <path d="M9 14l2 2l4 -4" />
    </>
  ),
  gavel: (
    <>
      <path d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385" />
      <path d="M6 9l4 4" />
      <path d="M13 10l-4 -4" />
      <path d="M3 21h7" />
      <path d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z" />
    </>
  ),
  backhoe: (
    <>
      <path d="M4 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M13 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M13 19l-9 0" />
      <path d="M4 15l9 0" />
      <path d="M8 12v-5h2a3 3 0 0 1 3 3v5" />
      <path d="M5 15v-2a1 1 0 0 1 1 -1h7" />
      <path d="M21.12 9.88l-3.12 -4.88l-5 5" />
      <path d="M21.12 9.88a3 3 0 0 1 -2.12 5.12a3 3 0 0 1 -2.12 -.88l4.24 -4.24z" />
    </>
  ),
  forklift: (
    <>
      <path d="M5 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M14 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M7 17l5 0" />
      <path d="M3 17v-6h13v6" />
      <path d="M5 11v-4h4" />
      <path d="M9 11v-6h4l3 6" />
      <path d="M22 15h-3v-10" />
      <path d="M16 13l3 0" />
    </>
  ),
  bulldozer: (
    <>
      <path d="M2 17a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M12 17a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M19 13v4a2 2 0 0 0 2 2h1" />
      <path d="M14 19h-10" />
      <path d="M4 15h10" />
      <path d="M9 11v-5h2a3 3 0 0 1 3 3v6" />
      <path d="M5 15v-3a1 1 0 0 1 1 -1h8" />
      <path d="M19 17h-3" />
    </>
  ),
} satisfies Record<string, React.ReactNode>;

export type IconKey = keyof typeof PATHS;

/** Ícone da barra de credibilidade (28px, traço grafite). */
export function CredIcon({ name }: { name: IconKey }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16181D"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}

/** Ícone dos cards de conteúdo (24px, traço na cor do texto do pai). */
export function LearnIcon({ name }: { name: IconKey }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}

/** Logotipo do WhatsApp (preenchido). */
export function WhatsAppIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .8-.2 1.5z" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 9h3l.5-3.5H14V4c0-1 .3-1.7 1.8-1.7h1.9V-.4C17.4-.5 16.2-.5 15-.5c-2.6 0-4.4 1.6-4.4 4.5v2H7.5V9.5H10.6V21H14z" transform="translate(0 1.5) scale(.92)" />
    </svg>
  );
}
