import type { CSSProperties } from "react";

type ProgressBarProps = {
  /** 0 a 100. */
  value: number;
  small?: boolean;
  /** Atraso da animação de preenchimento, em ms. */
  delay?: number;
};

/**
 * Barra de progresso acessível.
 *
 * A animação é 100% CSS (escala horizontal a partir da esquerda), então o
 * componente segue sendo Server Component — não há custo de JS no cliente.
 */
export default function ProgressBar({ value, small = false, delay = 180 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={small ? "progress progress-sm" : "progress"}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progresso: ${clamped}%`}
    >
      <div
        className="progress-fill"
        style={{ width: `${clamped}%`, "--fill-delay": `${delay}ms` } as CSSProperties}
      />
    </div>
  );
}
