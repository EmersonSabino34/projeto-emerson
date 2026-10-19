"use client";

import { useState } from "react";
import GoalRow from "@/components/GoalRow";
import type { Goal } from "@/lib/data";

/**
 * Todos · Em andamento · Concluídos — o filtro da tela "Meus Objetivos".
 *
 * Recebe a lista pronta do servidor e só decide o que mostrar. Quando a API
 * entrar, o filtro pode virar busca no servidor sem mexer no visual.
 */
const tabs = [
  { id: "todos", label: "Todos" },
  { id: "andamento", label: "Em andamento" },
  { id: "concluido", label: "Concluídos" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function GoalFilter({ goals }: { goals: Goal[] }) {
  const [active, setActive] = useState<TabId>("todos");

  const visible = active === "todos" ? goals : goals.filter((goal) => goal.status === active);

  return (
    <>
      <div className="segmented" role="group" aria-label="Filtrar objetivos">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="segmented-option"
            aria-pressed={tab.id === active}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty-state">
          Nada por aqui ainda. Que tal criar o primeiro objetivo desta lista?
        </p>
      ) : (
        <div className="goal-list" style={{ marginTop: "var(--sp-5)" }}>
          {visible.map((goal, index) => (
            <GoalRow goal={goal} key={goal.id} delay={180 + index * 60} />
          ))}
        </div>
      )}
    </>
  );
}
