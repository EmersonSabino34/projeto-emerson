/**
 * Os pontinhos de progresso do onboarding.
 *
 * É um progressbar de verdade para leitor de tela — "etapa 2 de 5" — e não só
 * uma fileira de bolinhas decorativas, porque saber onde se está num fluxo de
 * várias telas é informação, não enfeite.
 */
export default function StepDots({
  total,
  current,
}: {
  total: number;
  /** 1-indexado. */
  current: number;
}) {
  return (
    <div
      className="step-dots"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Etapa ${current} de ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={index + 1 === current ? "step-dot step-dot-on" : "step-dot"}
        />
      ))}
    </div>
  );
}
