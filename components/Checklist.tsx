"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { IconCheck } from "@/components/icons";

/**
 * As etapas do Plano de Ação.
 *
 * O estado mora no PlanoProvider, e não na lista, porque a tela mostra a
 * contagem "2 de 7" em dois lugares — no cabeçalho da seção e na coluna
 * lateral. Quando cada contagem lia o dado do servidor, marcar uma etapa
 * mudava a lista e deixava as duas paradas no valor inicial.
 *
 * O estado é local e some ao recarregar — quando o back-end entrar, o que
 * muda é de onde vem `initialDone` e para onde vai o toggle; a marcação
 * otimista da UI continua igual.
 *
 * Cada etapa é um <button aria-pressed>, não um checkbox escondido: assim o
 * alvo de toque é a linha inteira e o leitor de tela anuncia o estado sem
 * precisar de label associado.
 */
type Plano = {
  steps: string[];
  done: Set<number>;
  toggle: (index: number) => void;
};

const PlanoContext = createContext<Plano | null>(null);

function usePlano() {
  const plano = useContext(PlanoContext);
  if (!plano) {
    throw new Error("Checklist e EtapasContador precisam estar dentro de <PlanoProvider>.");
  }
  return plano;
}

export function PlanoProvider({
  steps,
  initialDone = [],
  children,
}: {
  steps: string[];
  /** Índices já concluídos no primeiro render. */
  initialDone?: number[];
  children: ReactNode;
}) {
  const [done, setDone] = useState<Set<number>>(() => new Set(initialDone));

  function toggle(index: number) {
    setDone((current) => {
      const next = new Set(current);
      if (!next.delete(index)) next.add(index);
      return next;
    });
  }

  return <PlanoContext value={{ steps, done, toggle }}>{children}</PlanoContext>;
}

/** "2 de 7" — acompanha a lista a cada etapa marcada. */
export function EtapasContador() {
  const { steps, done } = usePlano();

  return (
    <>
      {done.size} de {steps.length}
    </>
  );
}

export default function Checklist() {
  const { steps, done, toggle } = usePlano();

  return (
    <div className="checklist">
      {steps.map((step, index) => (
        <button
          key={step}
          type="button"
          className="check-row"
          aria-pressed={done.has(index)}
          onClick={() => toggle(index)}
        >
          <span className="check-box" aria-hidden="true">
            <IconCheck />
          </span>
          <span className="check-label">{step}</span>
        </button>
      ))}
    </div>
  );
}
