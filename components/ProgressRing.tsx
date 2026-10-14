import type { CSSProperties } from "react";

type ProgressRingProps = {
  /** 0 a 100. */
  value: number;
  /** Texto lido por leitor de tela no lugar do número solto. */
  label?: string;
};

/**
 * O anel de "Meu Progresso".
 *
 * Como a ProgressBar, a animação é 100% CSS (conic-gradient + @property), o
 * que mantém o componente no servidor — o valor entra por custom property e
 * o keyframe ring-fill cuida do resto.
 */
export default function ProgressRing({ value, label }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      className="ring"
      style={{ "--ring-value": clamped } as CSSProperties}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `Progresso: ${clamped}%`}
    >
      <strong className="ring-value">{clamped}%</strong>
    </div>
  );
}
