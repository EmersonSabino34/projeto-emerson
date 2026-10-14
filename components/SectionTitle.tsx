import type { ReactNode } from "react";

type SectionTitleProps = {
  eyebrow: string;
  title: ReactNode;
  /** Link "ver todos", contador de passo ou percentual. */
  action?: ReactNode;
};

export default function SectionTitle({ eyebrow, title, action }: SectionTitleProps) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}
