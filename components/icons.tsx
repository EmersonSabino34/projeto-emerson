/**
 * Conjunto de ícones do design system.
 *
 * SVG inline em vez de glifos de texto (⌂ ▦ ◯): os glifos mudavam de
 * tamanho e peso entre Windows, iOS e Android, e não herdavam currentColor
 * de forma previsível. Aqui tudo é traço de 1.6 e herda a cor do pai.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function IconHome({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M3.5 10.6 12 3.8l8.5 6.8" />
      <path d="M5.8 9.4V20h12.4V9.4" />
      <path d="M9.8 20v-5.2h4.4V20" />
    </svg>
  );
}

export function IconGrid({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <rect x="3.5" y="3.5" width="7" height="7" rx="2.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2.2" />
    </svg>
  );
}

export function IconSparkle({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M12 3.2 13.7 9 19.5 10.7 13.7 12.4 12 18.2 10.3 12.4 4.5 10.7 10.3 9Z" />
      <path d="M18.4 16.3l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7Z" />
    </svg>
  );
}

export function IconQuote({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M9.6 6.4C6.9 7.5 5.2 9.9 5.2 12.8c0 2.4 1.4 4 3.4 4 1.8 0 3.1-1.2 3.1-3 0-1.7-1.2-2.9-2.8-2.9-.3 0-.6 0-.8.1.3-1.4 1.3-2.6 2.8-3.3Z" />
      <path d="M18.6 6.4C15.9 7.5 14.2 9.9 14.2 12.8c0 2.4 1.4 4 3.4 4 1.8 0 3.1-1.2 3.1-3 0-1.7-1.2-2.9-2.8-2.9-.3 0-.6 0-.8.1.3-1.4 1.3-2.6 2.8-3.3Z" />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <circle cx="12" cy="8.4" r="3.9" />
      <path d="M4.8 20.2c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6" />
    </svg>
  );
}

export function IconSun({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6" />
    </svg>
  );
}

export function IconMoon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20.4 14.4A8.6 8.6 0 0 1 9.6 3.6a8.7 8.7 0 1 0 10.8 10.8Z" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Navegação inferior do VYRA · Início · Explorar · (+) · Mural · Perfil
   -------------------------------------------------------------------------- */

export function IconSearch({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="M15.5 15.5 20 20" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M12 5.6v12.8M5.6 12h12.8" />
    </svg>
  );
}

export function IconLayers({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <rect x="3.4" y="3.4" width="7.6" height="10.4" rx="2" />
      <rect x="13" y="3.4" width="7.6" height="6" rx="2" />
      <rect x="3.4" y="15.8" width="7.6" height="4.8" rx="2" />
      <rect x="13" y="11.4" width="7.6" height="9.2" rx="2" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Grade da Home · as áreas da vida
   -------------------------------------------------------------------------- */

export function IconTarget({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconVibration({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <circle cx="12" cy="12" r="2.6" />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4" />
      <path d="M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2" opacity=".55" />
    </svg>
  );
}

export function IconMind({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M12 4.2c-2.6 0-4.6 1.8-4.6 4.1 0 .6.1 1.1.3 1.6-1 .7-1.6 1.8-1.6 3 0 2.2 1.9 3.9 4.3 3.9h1.6" />
      <path d="M12 4.2c2.6 0 4.6 1.8 4.6 4.1 0 .6-.1 1.1-.3 1.6 1 .7 1.6 1.8 1.6 3 0 2.2-1.9 3.9-4.3 3.9H12" />
      <path d="M12 4.2v15.6" />
    </svg>
  );
}

export function IconHeart({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M12 19.6c-4.4-2.8-7.2-5.6-7.2-9A3.9 3.9 0 0 1 12 8.2a3.9 3.9 0 0 1 7.2 2.4c0 3.4-2.8 6.2-7.2 9Z" />
    </svg>
  );
}

export function IconBriefcase({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <rect x="3.2" y="7.4" width="17.6" height="12.2" rx="2.6" />
      <path d="M8.8 7.4V6.2a2 2 0 0 1 2-2h2.4a2 2 0 0 1 2 2v1.2" />
      <path d="M3.2 12.6h17.6" />
    </svg>
  );
}

export function IconFaith({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M12 3.6v16.8" />
      <path d="M7.2 8.6h9.6" />
      <path d="M12 20.4c-2.6-1.4-4-3.2-4-5.2" opacity=".5" />
      <path d="M12 20.4c2.6-1.4 4-3.2 4-5.2" opacity=".5" />
    </svg>
  );
}

export function IconGlobe({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <circle cx="12" cy="12" r="8.4" />
      <path d="M3.6 12h16.8" />
      <path d="M12 3.6c2.2 2.3 3.4 5.2 3.4 8.4S14.2 18.1 12 20.4c-2.2-2.3-3.4-5.2-3.4-8.4S9.8 5.9 12 3.6Z" />
    </svg>
  );
}

export function IconImage({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="2.8" />
      <circle cx="8.9" cy="9.8" r="1.7" />
      <path d="M3.9 17.2 9 12.6l3.4 3 2.6-2.2 5.1 4.4" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Utilitários de interface
   -------------------------------------------------------------------------- */

export function IconBell({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M6.6 10.2a5.4 5.4 0 0 1 10.8 0c0 3.1.8 4.6 1.6 5.6H5c.8-1 1.6-2.5 1.6-5.6Z" />
      <path d="M10 18.4a2.2 2.2 0 0 0 4 0" />
    </svg>
  );
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M9.4 5.6 15.8 12l-6.4 6.4" />
    </svg>
  );
}

export function IconArrowLeft({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="M19 12H5.4M11 5.4 4.4 12l6.6 6.6" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg {...base} className={className} width="20" height="20">
      <path d="m5 12.6 4.4 4.4L19 7.4" />
    </svg>
  );
}

/** Terceiro estado do seletor de tipo: seguir o sistema. */
export function IconAuto({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 3.6a8.4 8.4 0 0 1 0 16.8Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
