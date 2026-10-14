"use client";

import { useState } from "react";
import { IconCheck } from "@/components/icons";

/**
 * A lista de idiomas da tela 3.
 *
 * A escolha ainda não troca os textos do app, porque o projeto não tem camada
 * de i18n, e ainda não é guardada em lugar nenhum. A tela já existe no fluxo
 * para o desenho não mudar quando a tradução chegar.
 */
const idiomas = [
  { id: "pt-BR", bandeira: "🇧🇷", label: "Português" },
  { id: "en", bandeira: "🇬🇧", label: "English" },
];

export default function EscolhaIdioma() {
  const [escolhido, setEscolhido] = useState("pt-BR");

  return (
    <div className="choice-list" role="radiogroup" aria-label="Idioma">
      {idiomas.map((idioma) => (
        <button
          type="button"
          role="radio"
          key={idioma.id}
          className="choice-row lang-row"
          aria-checked={idioma.id === escolhido}
          onClick={() => setEscolhido(idioma.id)}
        >
          <span className="lang-flag" aria-hidden="true">
            {idioma.bandeira}
          </span>
          <span className="choice-label">{idioma.label}</span>
          {idioma.id === escolhido ? (
            <span className="lang-check" aria-hidden="true">
              <IconCheck />
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
