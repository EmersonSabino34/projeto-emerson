"use client";

import { useState } from "react";
import { formatos, type FraseArte } from "@/lib/frases";

/**
 * Criador de Posts (tela 23).
 *
 * As quatro ferramentas mexem na arte de verdade, como no editor do mural:
 *
 *   Modelo  · alinhamento e peso do texto sobre a foto
 *   Texto   · a frase, editável
 *   Filtro  · tratamento de cor da foto
 *   Formato · a proporção da arte (Story, Post, Quadrado, Wallpaper)
 *
 * A proporção é `aspect-ratio` na moldura, então trocar de formato
 * reenquadra a arte na hora, sem recarregar imagem.
 */
const modelos = [
  { id: "centro", label: "Centro", className: "art-text-centro" },
  { id: "base", label: "Base", className: "art-text-base" },
  { id: "topo", label: "Topo", className: "art-text-topo" },
];

const filtros = [
  { id: "original", label: "Original", css: "none" },
  { id: "dourado", label: "Dourado", css: "saturate(1.15) sepia(.22) contrast(1.04)" },
  { id: "noturno", label: "Noturno", css: "saturate(.9) hue-rotate(-12deg) brightness(.9)" },
  { id: "pb", label: "Preto e branco", css: "grayscale(1) contrast(1.08)" },
];

type Ferramenta = "modelo" | "texto" | "filtro" | "formato";

export default function CriadorPost({ frase }: { frase: FraseArte }) {
  const [modelo, setModelo] = useState(modelos[0]);
  const [filtro, setFiltro] = useState(filtros[0]);
  const [formato, setFormato] = useState(formatos[0]);
  const [texto, setTexto] = useState(frase.texto);
  const [autor, setAutor] = useState(frase.autor);
  const [ferramenta, setFerramenta] = useState<Ferramenta>("formato");

  return (
    <>
      <div className="art-stage">
        <div
          className="art-frame"
          style={{ aspectRatio: formato.ratio, filter: filtro.css }}
        >
          <div
            className="art-photo"
            style={{ backgroundImage: `url(${frase.foto})` }}
            aria-hidden="true"
          />
          <div className="art-shade" aria-hidden="true" />
          <figure className={`art-text ${modelo.className}`}>
            <blockquote>&ldquo;{texto}&rdquo;</blockquote>
            <figcaption>— {autor}</figcaption>
          </figure>
        </div>
      </div>

      <div className="tool-row" role="toolbar" aria-label="Ferramentas da arte">
        {(
          [
            ["modelo", "▤", "Modelo"],
            ["texto", "T", "Texto"],
            ["filtro", "◑", "Filtro"],
            ["formato", "▯", "Formato"],
          ] as const
        ).map(([id, glyph, label]) => (
          <button
            key={id}
            type="button"
            className="tool-button"
            aria-pressed={ferramenta === id}
            onClick={() => setFerramenta(id)}
          >
            <span aria-hidden="true">{glyph}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="tool-panel glass glass-pad">
        {ferramenta === "modelo" ? (
          <>
            <p className="eyebrow">Posição do texto</p>
            <div className="chip-wrap">
              {modelos.map((opcao) => (
                <button
                  key={opcao.id}
                  type="button"
                  className="chip"
                  aria-pressed={opcao.id === modelo.id}
                  onClick={() => setModelo(opcao)}
                >
                  {opcao.label}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {ferramenta === "texto" ? (
          <>
            <div className="field">
              <label htmlFor="arte-texto">Frase</label>
              <textarea
                id="arte-texto"
                rows={3}
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="arte-autor">Assinatura</label>
              <input
                id="arte-autor"
                type="text"
                value={autor}
                onChange={(event) => setAutor(event.target.value)}
              />
            </div>
          </>
        ) : null}

        {ferramenta === "filtro" ? (
          <>
            <p className="eyebrow">Tratamento</p>
            <div className="chip-wrap">
              {filtros.map((opcao) => (
                <button
                  key={opcao.id}
                  type="button"
                  className="chip"
                  aria-pressed={opcao.id === filtro.id}
                  onClick={() => setFiltro(opcao)}
                >
                  {opcao.label}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {ferramenta === "formato" ? (
          <>
            <p className="eyebrow">Onde você vai publicar</p>
            <div className="chip-wrap">
              {formatos.map((opcao) => (
                <button
                  key={opcao.id}
                  type="button"
                  className="chip chip-format"
                  aria-pressed={opcao.id === formato.id}
                  onClick={() => setFormato(opcao)}
                >
                  {opcao.label}
                  <small>{opcao.nota}</small>
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <button type="button" className="btn btn-primary btn-block">
        Gerar arte
        <span className="btn-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </>
  );
}
