"use client";

import { useState } from "react";

/**
 * Hoje · Semana · Mês — o filtro de período da Home.
 *
 * Os botões são `aria-pressed` e não links: trocar de período não muda de
 * rota nem deveria entrar no histórico do navegador (voltar tem de sair da
 * Home, não desfazer o filtro).
 */
const periods = ["Hoje", "Semana", "Mês"] as const;

export type Period = (typeof periods)[number];

export default function PeriodTabs({
  onChange,
}: {
  onChange?: (period: Period) => void;
}) {
  const [active, setActive] = useState<Period>("Hoje");

  return (
    <div className="segmented" role="group" aria-label="Filtrar por período">
      {periods.map((period) => (
        <button
          key={period}
          type="button"
          className="segmented-option"
          aria-pressed={period === active}
          onClick={() => {
            setActive(period);
            onChange?.(period);
          }}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
