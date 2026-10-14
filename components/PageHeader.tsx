import type { ReactNode } from "react";
import ThemeToggle from "@/components/ThemeToggle";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  /** Ação à direita: avatar na home, botão de voltar nas demais páginas. */
  action?: ReactNode;
};

export default function PageHeader({ eyebrow, title, action }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <div className="page-header-actions">
        <ThemeToggle />
        {action}
      </div>
    </header>
  );
}
