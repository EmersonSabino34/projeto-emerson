"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Collage from "@/components/Collage";
import {
  MAX_LEGENDA,
  edicaoParaQuery,
  filtroMuralPorId,
  filtrosMural,
  girarFotos,
  layouts,
  type MuralLayout,
} from "@/lib/murais";

/**
 * Editar Mural (tela 26).
 *
 * As quatro ferramentas das referências — Trocar, Ajustar, Texto e Filtros —
 * mexem de verdade na colagem, e não abrem um painel vazio:
 *
 *   Trocar  · gira a ordem das fotos, então cada uma passa por cada posição
 *   Ajustar · troca o layout sem perder as fotos escolhidas
 *   Texto   · edita a frase sobreposta
 *   Filtros · aplica um tratamento de cor à colagem inteira
 *
 * Nada disso persiste ainda. Até a API entrar, o estado vai na URL para a
 * pré-visualização e volta dela para cá (ver EdicaoMural em lib/murais);
 * com a API, esse mesmo estado vira o corpo do PATCH.
 */

type Tool = "ajustar" | "texto" | "filtros";

export default function MuralEditor({
  muralId,
  initialLayout,
  photos,
  initialCaption,
  initialFilterId,
  initialOffset,
}: {
  muralId: string;
  initialLayout: MuralLayout;
  photos: string[];
  initialCaption: string;
  initialFilterId: string;
  initialOffset: number;
}) {
  const router = useRouter();

  const [layout, setLayout] = useState(initialLayout);
  const [offset, setOffset] = useState(initialOffset);
  const [caption, setCaption] = useState(initialCaption);
  const [filter, setFilter] = useState(() => filtroMuralPorId(initialFilterId));
  const [tool, setTool] = useState<Tool | null>(null);

  const ordered = girarFotos(photos, offset);

  function toggle(next: Tool) {
    setTool((current) => (current === next ? null : next));
  }

  function verNoCelular() {
    const query = edicaoParaQuery({
      layoutId: layout.id,
      legenda: caption,
      filtroId: filter.id,
      giro: offset,
    });
    router.push(`/mural/${muralId}/preview?${query}`);
  }

  return (
    <>
      <div className="mural-stage" style={{ filter: filter.css }}>
        <Collage layout={layout} photos={ordered} ratio="3 / 4" caption={caption} />
      </div>

      <div className="tool-row" role="toolbar" aria-label="Ferramentas do mural">
        {/* Trocar é uma ação, não um modo: cada toque gira as fotos uma
            posição. Por isso não tem aria-pressed, ao contrário dos outros. */}
        <button
          type="button"
          className="tool-button"
          onClick={() => setOffset((current) => (current + 1) % photos.length)}
        >
          <span aria-hidden="true">⇄</span>
          Trocar
        </button>

        <button
          type="button"
          className="tool-button"
          aria-pressed={tool === "ajustar"}
          onClick={() => toggle("ajustar")}
        >
          <span aria-hidden="true">⊞</span>
          Ajustar
        </button>

        <button
          type="button"
          className="tool-button"
          aria-pressed={tool === "texto"}
          onClick={() => toggle("texto")}
        >
          <span aria-hidden="true">T</span>
          Texto
        </button>

        <button
          type="button"
          className="tool-button"
          aria-pressed={tool === "filtros"}
          onClick={() => toggle("filtros")}
        >
          <span aria-hidden="true">◑</span>
          Filtros
        </button>
      </div>

      {/* O painel da ferramenta ativa abre logo abaixo da barra, sem tirar a
          colagem da tela — a pessoa vê o efeito enquanto mexe. */}
      {tool === "ajustar" ? (
        <div className="tool-panel glass glass-pad">
          <p className="eyebrow">Layout</p>
          <div className="chip-wrap">
            {layouts.map((option) => (
              <button
                type="button"
                key={option.id}
                className="chip"
                aria-pressed={option.id === layout.id}
                onClick={() => setLayout(option)}
              >
                {option.label} · {option.count}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {tool === "texto" ? (
        <div className="tool-panel glass glass-pad">
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="legenda">Frase do mural</label>
            <textarea
              id="legenda"
              rows={3}
              maxLength={MAX_LEGENDA}
              value={caption}
              placeholder="Disciplina hoje. Resultados sempre."
              onChange={(event) => setCaption(event.target.value)}
            />
            <span className="field-hint">Uma linha por quebra de parágrafo.</span>
          </div>
        </div>
      ) : null}

      {tool === "filtros" ? (
        <div className="tool-panel glass glass-pad">
          <p className="eyebrow">Tratamento</p>
          <div className="chip-wrap">
            {filtrosMural.map((option) => (
              <button
                type="button"
                key={option.id}
                className="chip"
                aria-pressed={option.id === filter.id}
                onClick={() => setFilter(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <button type="button" className="btn btn-primary btn-block" onClick={verNoCelular}>
        Salvar e ver no celular
        <span className="btn-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </>
  );
}
