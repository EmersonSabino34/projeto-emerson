/**
 * Marca VYRA.
 *
 * O símbolo combina, de forma abstrata, os quatro elementos do conceito:
 *   · o arco externo  → o alvo / a meta
 *   · os dois arcos abertos → a vibração, a energia que se propaga
 *   · a estrela de quatro pontas → a luz, o sonho
 *   · o ponto orbital → o passo, a ação que gira em volta da meta
 *
 * O traço é monocromático e herda currentColor de propósito: quem pinta o
 * ouro da marca é o CSS (.brand-mark usa o gradiente --brand-from/--brand-to).
 * Assim o componente continua sendo Server Component — um <linearGradient>
 * interno exigiria id único por instância, e portanto useId + "use client".
 */

type MarkProps = {
  className?: string;
  /** Lado do quadrado, em px. O traço acompanha a escala. */
  size?: number;
};

export function VyraMark({ className, size = 24 }: MarkProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* alvo */}
      <circle cx="12" cy="12" r="9.1" opacity=".45" />
      {/* vibração: dois arcos abertos, um de cada lado */}
      <path d="M5.6 7.3a8 8 0 0 0 0 9.4" opacity=".8" />
      <path d="M18.4 7.3a8 8 0 0 1 0 9.4" opacity=".8" />
      {/* luz */}
      <path d="M12 6.2c.5 3.1 2.2 4.8 5.3 5.3-3.1.5-4.8 2.2-5.3 5.3-.5-3.1-2.2-4.8-5.3-5.3 3.1-.5 4.8-2.2 5.3-5.3Z" />
      {/* o passo em órbita */}
      <circle cx="18.4" cy="5.6" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

type LogoProps = {
  /** "full" traz o símbolo + VYRA + assinatura; "lockup" omite a assinatura. */
  variant?: "full" | "lockup";
  className?: string;
};

/** Símbolo + palavra, do jeito que aparece na splash e no rodapé. */
export default function VyraLogo({ variant = "full", className }: LogoProps) {
  return (
    <div className={`vyra-logo${className ? ` ${className}` : ""}`}>
      <span className="brand-mark brand-mark-lg">
        <VyraMark size={30} />
      </span>
      <div className="vyra-logo-word">
        <strong>VYRA</strong>
        {variant === "full" && (
          <span>Mente · Plano · Vibra · Realiza</span>
        )}
      </div>
    </div>
  );
}
