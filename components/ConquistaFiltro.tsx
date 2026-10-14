"use client";

import { useState } from "react";
import type { Conquista } from "@/lib/conquistas";

/**
 * Todos · Recentes · Por categoria (tela 15).
 *
 * Em "Por categoria" a lista deixa de ser plana e passa a vir agrupada, com
 * um cabeçalho por grupo — é a única aba em que a ordem importa, então é a
 * única que reordena.
 */
const abas = ["Todos", "Recentes", "Por categoria"] as const;
type Aba = (typeof abas)[number];

export default function ConquistaFiltro({ conquistas }: { conquistas: Conquista[] }) {
  const [aba, setAba] = useState<Aba>("Todos");

  const visiveis = aba === "Recentes" ? conquistas.filter((item) => item.recente) : conquistas;

  /** Agrupa preservando a ordem em que cada categoria apareceu. */
  const grupos = new Map<string, Conquista[]>();
  for (const item of visiveis) {
    const atual = grupos.get(item.categoria) ?? [];
    atual.push(item);
    grupos.set(item.categoria, atual);
  }

  return (
    <>
      <div className="segmented section" role="group" aria-label="Filtrar conquistas">
        {abas.map((opcao) => (
          <button
            key={opcao}
            type="button"
            className="segmented-option"
            aria-pressed={opcao === aba}
            onClick={() => setAba(opcao)}
          >
            {opcao}
          </button>
        ))}
      </div>

      {visiveis.length === 0 ? (
        <p className="empty-state">Nenhuma conquista recente ainda. Ela vem.</p>
      ) : aba === "Por categoria" ? (
        [...grupos.entries()].map(([categoria, itens]) => (
          <section className="section" key={categoria}>
            <p className="eyebrow">{categoria}</p>
            <Lista itens={itens} />
          </section>
        ))
      ) : (
        <div className="section">
          <Lista itens={visiveis} />
        </div>
      )}
    </>
  );
}

function Lista({ itens }: { itens: Conquista[] }) {
  return (
    <div className="badge-list">
      {itens.map((item) => (
        <article className="badge-row" key={item.id}>
          <span className="badge-medal" aria-hidden="true">
            {item.glyph}
          </span>
          <span className="badge-copy">
            <strong>{item.titulo}</strong>
            <span>{item.nota}</span>
          </span>
        </article>
      ))}
    </div>
  );
}
