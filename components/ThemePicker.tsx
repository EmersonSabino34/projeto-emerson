"use client";

import { useSyncExternalStore } from "react";
import {
  readChoice,
  transitionTo,
  type ThemeChoice,
} from "@/components/ThemeToggle";
import { IconAuto, IconMoon, IconSun } from "@/components/icons";

/**
 * O seletor de tipo das Configurações: Dia · Noite · Automático.
 *
 * Qual opção está marcada VISUALMENTE é decidido por CSS a partir de
 * [data-theme] no <html> (ver .theme-picker em vyra.css), então a marcação já
 * sai certa no primeiro paint, antes de qualquer JavaScript rodar.
 *
 * O React só precisa do valor para escrever `aria-checked`, que o CSS não
 * alcança. Esse valor vem de useSyncExternalStore, e não de useState +
 * useEffect: a fonte da verdade é o DOM (um sistema externo ao React), e o
 * hook existe exatamente para esse caso — ele usa o snapshot do servidor
 * durante a hidratação, evitando a divergência, e não dispara o render em
 * cascata que um setState dentro de efeito causaria.
 */
const options: {
  id: ThemeChoice;
  label: string;
  note: string;
  Icon: (props: { className?: string }) => React.ReactElement;
}[] = [
  { id: "light", label: "Dia", note: "Nascer do sol, marfim e ouro", Icon: IconSun },
  { id: "dark", label: "Noite", note: "Aurora boreal, violeta e lilás", Icon: IconMoon },
  { id: "auto", label: "Automático", note: "Acompanha o seu aparelho", Icon: IconAuto },
];

/** Avisa o React sempre que o data-theme do <html> mudar, venha de onde vier
    (deste seletor, do toggle do cabeçalho ou de outra aba). */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/** No servidor não há escolha possível; "auto" é o que o CSS assume. */
function serverSnapshot(): ThemeChoice {
  return "auto";
}

export default function ThemePicker() {
  const choice = useSyncExternalStore(subscribe, readChoice, serverSnapshot);

  return (
    <div className="theme-picker" role="radiogroup" aria-label="Tipo de visual">
      {options.map(({ id, label, note, Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          className="theme-picker-option"
          data-choice={id}
          aria-checked={choice === id}
          // O círculo de revelação nasce de onde a pessoa tocou.
          onClick={(event) => transitionTo(id, { x: event.clientX, y: event.clientY })}
        >
          <span className="choice-icon" aria-hidden="true">
            <Icon />
          </span>
          <span className="choice-label">
            <strong>{label}</strong>
            <span>{note}</span>
          </span>
          <span className="theme-picker-dot" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
