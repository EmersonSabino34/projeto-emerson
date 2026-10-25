import type { CSSProperties } from "react";
import type { MuralLayout } from "@/lib/murais";


type CollageProps = {
  layout: MuralLayout;
  /**
   * URLs das fotos, na ordem do layout. `null` é uma posição ainda vazia: o
   * criador de mural passa o layout inteiro e vai preenchendo a cada toque.
   */
  photos: ReadonlyArray<string | null>;
  /** Proporção da colagem — "9 / 16" no papel de parede, "3 / 4" no cartão. */
  ratio?: string;
  /** Texto que aparece sobreposto à colagem, como nas telas de referência. */
  caption?: string;
  /** Filtro CSS aplicado só às fotos (a legenda fica de fora). */
  filtro?: string;
  className?: string;
};

/**
 * A colagem do Mural VYRA.
 *
 * A composição vem do layout (colunas + span de cada foto) e não de
 * coordenadas fixas, então a MESMA colagem serve ao cartão pequeno da lista,
 * ao editor em tela cheia e à pré-visualização 9:16 do papel de parede.
 *
 * `grid-auto-flow: dense` é o que faz a grade se fechar sozinha: quando uma
 * foto 2×2 deixa um buraco à direita, a próxima célula 1×1 volta e ocupa esse
 * espaço em vez de deixar um vão. É o equivalente em CSS ao "enquadrar
 * automaticamente para caber perfeitamente" do briefing.
 *
 * Cada foto é `object-fit: cover` com o centro como âncora — nenhuma imagem
 * é distorcida, ela é recortada.
 */
export default function Collage({
  layout,
  photos,
  ratio = "3 / 4",
  caption,
  filtro,
  className,
}: CollageProps) {
  // A primeira posição vazia é onde a próxima foto vai entrar; ela pulsa.
  const next = photos.indexOf(null);

  return (
    <div className={className ? `collage ${className}` : "collage"}>
      <div
        className="collage-grid"
        style={
          {
            aspectRatio: ratio,
            gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
            filter: filtro && filtro !== "none" ? filtro : undefined,
          } as CSSProperties
        }
      >
        {layout.spans.map((span, index) => {
          const src = photos[index % photos.length];
          const area = { gridColumn: `span ${span[0]}`, gridRow: `span ${span[1]}` };

          if (!src) {
            return (
              <span
                key={`vazio-${index}`}
                className={
                  index === next ? "collage-cell collage-cell-empty collage-cell-next" : "collage-cell collage-cell-empty"
                }
                style={area}
              />
            );
          }

          return (
            <span
              key={`${src}-${index}`}
              className="collage-cell"
              style={{ ...area, backgroundImage: `url(${src})` }}
            />
          );
        })}
      </div>

      {caption ? (
        <p className="collage-caption">
          {/* Chave pela posição: a legenda é editável, e duas linhas iguais
              (ou duas em branco) repetiriam a chave se ela fosse o texto. */}
          {caption.split("\n").map((line, index) => (
            <span key={index}>{line}</span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
