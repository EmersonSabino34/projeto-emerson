"use client";

import { useRef } from "react";
import { IconAuto, IconMoon, IconSun } from "@/components/icons";

/**
 * Os dois tipos do VYRA, mais o estado que segue o aparelho.
 *
 *   dia   · nascer do sol, marfim, ouro   (data-theme="light")
 *   noite · aurora boreal, violeta, lilás (data-theme="dark")
 *   auto  · sem data-theme, o CSS resolve por prefers-color-scheme
 */
export type ThemeChoice = "light" | "dark" | "auto";

/** Mesma chave lida pelo script anti-flash em app/layout.tsx. */
export const STORAGE_KEY = "vyra-theme";

/** Ordem do ciclo do botão: dia → noite → automático → dia. */
const CYCLE: Record<ThemeChoice, ThemeChoice> = {
  light: "dark",
  dark: "auto",
  auto: "light",
};

/** A escolha guardada, ou "auto" quando não há nenhuma. */
export function readChoice(): ThemeChoice {
  const explicit = document.documentElement.dataset.theme;
  return explicit === "dark" || explicit === "light" ? explicit : "auto";
}

/**
 * Aplica a escolha no <html> e guarda. "auto" REMOVE o atributo em vez de
 * gravar o tipo resolvido: assim quem escolheu automático continua trocando
 * junto com o aparelho ao anoitecer, em vez de congelar no que valia agora.
 */
export function applyChoice(next: ThemeChoice) {
  const root = document.documentElement;

  if (next === "auto") {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = next;
  }

  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // modo privado ou storage bloqueado: a escolha vale só para esta sessão
  }
}

/**
 * Envolve a troca na View Transitions API, revelando o novo tipo por um
 * círculo que nasce no ponto informado. Reutilizado pelo seletor das
 * Configurações, que também troca de tipo.
 */
export function transitionTo(next: ThemeChoice, origin?: { x: number; y: number }) {
  if (origin) {
    const root = document.documentElement;
    root.style.setProperty("--sweep-x", `${origin.x}px`);
    root.style.setProperty("--sweep-y", `${origin.y}px`);
  }

  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => unknown;
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduced && typeof doc.startViewTransition === "function") {
    doc.startViewTransition(() => applyChoice(next));
  } else {
    applyChoice(next);
  }
}

/**
 * O componente não guarda estado em React de propósito.
 *
 * Qual tipo está ativo é decidido por CSS a partir de [data-theme] no <html>
 * (com prefers-color-scheme como fallback), então o ícone troca sem precisar
 * de re-render. Isso elimina o erro de hidratação clássico: o servidor não
 * tem como saber o tipo do usuário, e qualquer estado inicial que ele
 * chutasse divergiria do cliente no primeiro paint.
 */
export default function ThemeToggle() {
  const ref = useRef<HTMLButtonElement>(null);

  function toggle() {
    const next = CYCLE[readChoice()];

    // A origem do círculo de revelação é o centro do próprio botão, então a
    // luz parece nascer de onde o usuário clicou.
    const rect = ref.current?.getBoundingClientRect();
    transitionTo(
      next,
      rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined,
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      className="theme-toggle"
      onClick={toggle}
      title="Alternar entre dia, noite e automático"
      aria-label="Alternar entre dia, noite e automático"
    >
      <IconSun className="icon-sun" />
      <IconMoon className="icon-moon" />
      <IconAuto className="icon-auto" />
    </button>
  );
}
