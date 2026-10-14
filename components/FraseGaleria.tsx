"use client";

import Link from "next/link";
import { useState } from "react";
import { categoriasFrase, type CategoriaFrase, type FraseArte } from "@/lib/frases";

/**
 * Frases e Fotos (tela 22).
 *
 * A frase em destaque é sempre a primeira da categoria ativa, e as demais
 * viram miniaturas clicáveis abaixo. Trocar de categoria reposiciona o
 * destaque na primeira frase daquela categoria, para nunca sobrar um destaque
 * de uma categoria que não está mais selecionada.
 */
export default function FraseGaleria({ frases }: { frases: FraseArte[] }) {
  const [categoria, setCategoria] = useState<CategoriaFrase>(categoriasFrase[0]);
  const [ativaId, setAtivaId] = useState(frases[0].id);

  const daCategoria = frases.filter((frase) => frase.categoria === categoria);
  const ativa = daCategoria.find((frase) => frase.id === ativaId) ?? daCategoria[0];

  function trocarCategoria(nova: CategoriaFrase) {
    setCategoria(nova);
    const primeira = frases.find((frase) => frase.categoria === nova);
    if (primeira) setAtivaId(primeira.id);
  }

  return (
    <>
      <div className="segmented section" role="group" aria-label="Categoria da frase">
        {categoriasFrase.map((opcao) => (
          <button
            key={opcao}
            type="button"
            className="segmented-option"
            aria-pressed={opcao === categoria}
            onClick={() => trocarCategoria(opcao)}
          >
            {opcao}
          </button>
        ))}
      </div>

      <section
        className="quote-hero section"
        style={{ backgroundImage: `url(${ativa.foto})` }}
      >
        <div className="quote-hero-copy">
          {/* key força o remonte, então a nova frase entra animada */}
          <blockquote key={ativa.id}>&ldquo;{ativa.texto}&rdquo;</blockquote>
          <cite>— {ativa.autor}</cite>
        </div>
      </section>

      <div className="thumb-row" role="group" aria-label="Outras frases desta categoria">
        {daCategoria.map((frase) => (
          <button
            type="button"
            key={frase.id}
            className="thumb"
            aria-pressed={frase.id === ativa.id}
            aria-label={frase.texto}
            style={{ backgroundImage: `url(${frase.foto})` }}
          onClick={() => setAtivaId(frase.id)}
          />
        ))}
      </div>

      <Link href={`/frases/criar?frase=${ativa.id}`} className="btn btn-primary btn-block">
        Usar esta frase
        <span className="btn-arrow" aria-hidden="true">
          →
        </span>
      </Link>
    </>
  );
}
