"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Collage from "@/components/Collage";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { layouts, photoBank } from "@/lib/murais";

/**
 * A escolha de layout da tela 25 e o botão que segue para o editor. Ficam no
 * mesmo componente porque o botão precisa saber qual layout está marcado.
 *
 * Cada cartão mostra a colagem de verdade, montada com o mesmo componente que
 * a tela final usa — o que a pessoa vê aqui é exatamente o que ela vai
 * receber, não um desenho aproximado do layout.
 */
export default function EscolhaLayout() {
  const router = useRouter();
  const [selected, setSelected] = useState(layouts[0].id);

  return (
    <>
      <Reveal>
        <section className="section">
          <SectionTitle eyebrow="Cinco composições" title="Layouts" />

          <div
            className="layout-grid"
            role="radiogroup"
            aria-label="Layout do mural"
          >
            {layouts.map((layout) => (
              <button
                type="button"
                role="radio"
                key={layout.id}
                className="layout-card"
                aria-checked={layout.id === selected}
                onClick={() => setSelected(layout.id)}
              >
                <Collage
                  layout={layout}
                  photos={photoBank}
                  ratio="3 / 4"
                  className="collage-in-card"
                />
                <span className="layout-card-body">
                  <strong>{layout.label}</strong>
                  <span>{layout.count} fotos</span>
                  <span className="layout-card-note">{layout.note}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={80}>
        <button
          type="button"
          className="btn btn-primary btn-block"
          // O protótipo abre o editor do mural 1; com a API, aqui nasce um
          // mural novo e a rota recebe o id que o servidor devolver.
          onClick={() => router.push(`/mural/1/editar?layout=${selected}`)}
        >
          Adicionar minhas fotos
          <span className="btn-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </Reveal>
    </>
  );
}
