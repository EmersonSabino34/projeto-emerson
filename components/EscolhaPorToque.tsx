"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconCheck } from "@/components/icons";

/**
 * As peças da criação por toque, divididas pelo criador de mural e pelo de
 * objetivo: cada tela é uma pergunta, cada opção é um botão, e um toque
 * escolhe e já avança. Nenhuma das duas telas pede digitação.
 */

/** O tempo em que a opção tocada fica marcada antes de a tela avançar. */
const CONFIRMACAO_MS = 260;

/**
 * Marca a opção tocada e só depois avança.
 *
 * Sem essa pausa a tela trocava no mesmo instante do toque, e a pessoa não
 * via o que tinha escolhido. Toques durante a pausa são ignorados, para um
 * toque duplo não escolher duas vezes.
 */
export function useToque() {
  const [marcado, setMarcado] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function tocar(id: string, depois: () => void) {
    if (marcado !== null) return;
    setMarcado(id);
    timer.current = window.setTimeout(() => {
      setMarcado(null);
      depois();
    }, CONFIRMACAO_MS);
  }

  return { marcado, tocar };
}

/** Opção com foto: os desejos do mural, as áreas e os layouts. */
export function OpcaoFoto({
  label,
  foto,
  marcado,
  larga = false,
  onClick,
}: {
  label: string;
  foto: string;
  marcado: boolean;
  /** Formato paisagem, para listas longas como a das áreas. */
  larga?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={larga ? "pick-photo pick-photo-wide" : "pick-photo"}
      style={{ backgroundImage: `url(${foto})` }}
      aria-pressed={marcado}
      onClick={onClick}
    >
      <span className="pick-check" aria-hidden="true">
        <IconCheck />
      </span>
      <span className="pick-photo-label">{label}</span>
    </button>
  );
}

/** Opção de texto: frase do mural, prazo e motivo do objetivo. */
export function OpcaoTexto({
  children,
  marcado,
  citacao = false,
  onClick,
}: {
  children: ReactNode;
  marcado: boolean;
  /** Frase em itálico de citação, como ela aparece sobre o mural. */
  citacao?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={citacao ? "pick-text pick-text-quote" : "pick-text"}
      aria-pressed={marcado}
      onClick={onClick}
    >
      <span className="pick-text-label">{children}</span>
      <span className="pick-check" aria-hidden="true">
        <IconCheck />
      </span>
    </button>
  );
}
