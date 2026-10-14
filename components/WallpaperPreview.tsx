"use client";

import { useState } from "react";
import Collage from "@/components/Collage";
import type { MuralLayout } from "@/lib/murais";

/**
 * Pré-visualização do papel de parede (tela 27).
 *
 * Mostra a colagem dentro de um aparelho, nas duas telas que importam:
 *
 *   Bloqueada · relógio grande e data, como o sistema desenha
 *   Inicial   · relógio pequeno e a grade de ícones por cima
 *
 * O relógio fica SOBRE as fotos, como o sistema faz de verdade — por isso a
 * colagem reserva uma área segura no topo (.wallpaper-safe), para nenhuma
 * foto importante nascer embaixo do horário. É a "área segura para relógio,
 * data, notificações e widgets" do briefing.
 */
const screens = [
  { id: "bloqueada", label: "Tela bloqueada" },
  { id: "inicial", label: "Tela inicial" },
] as const;

type ScreenId = (typeof screens)[number]["id"];

export default function WallpaperPreview({
  layout,
  photos,
  caption,
  filtro,
}: {
  layout: MuralLayout;
  photos: string[];
  caption: string;
  /** Filtro escolhido no editor; vale só para as fotos, não para o relógio. */
  filtro?: string;
}) {
  const [screen, setScreen] = useState<ScreenId>("bloqueada");

  return (
    <>
      <div className="segmented" role="group" aria-label="Qual tela pré-visualizar">
        {screens.map((option) => (
          <button
            key={option.id}
            type="button"
            className="segmented-option"
            aria-pressed={option.id === screen}
            onClick={() => setScreen(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="phone">
        <div className="phone-screen">
          {/* 9:16 é a proporção de papel de parede de celular. */}
          <Collage
            layout={layout}
            photos={photos}
            ratio="9 / 16"
            filtro={filtro}
            className="collage-fill"
          />

          {/* Sombra no topo e no rodapé para o relógio branco nunca cair
              sobre uma foto clara. */}
          <div className="phone-shade" aria-hidden="true" />

          <div className="wallpaper-safe">
            {screen === "bloqueada" ? (
              <>
                <p className="phone-clock">9:41</p>
                <p className="phone-date">Quinta-feira, 11 de setembro</p>
              </>
            ) : (
              <p className="phone-clock phone-clock-sm">9:41</p>
            )}
          </div>

          {screen === "inicial" ? (
            <div className="phone-icons" aria-hidden="true">
              {Array.from({ length: 8 }, (_, index) => (
                <span key={index} />
              ))}
            </div>
          ) : null}

          <p className="phone-caption">
            {/* Chave pela posição, pelo mesmo motivo da legenda da Collage. */}
            {caption.split("\n").map((line, index) => (
              <span key={index}>{line}</span>
            ))}
          </p>
        </div>
      </div>
    </>
  );
}
