"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  IconBriefcase,
  IconFaith,
  IconGlobe,
  IconHeart,
  IconMind,
  IconPlus,
  IconTarget,
  IconVibration,
} from "@/components/icons";

/** Limite das referências: "Selecione até 3 áreas principais." */
const MAXIMO = 3;

const opcoes = [
  { id: "saude", label: "Saúde", Icon: IconHeart },
  { id: "profissao", label: "Profissão", Icon: IconBriefcase },
  { id: "financas", label: "Finanças", Icon: IconTarget },
  { id: "relacionamentos", label: "Relacionamentos", Icon: IconVibration },
  { id: "lugares", label: "Lugares", Icon: IconGlobe },
  { id: "espiritualidade", label: "Espiritualidade", Icon: IconFaith },
  { id: "autoconhecimento", label: "Autoconhecimento", Icon: IconMind },
  { id: "familia", label: "Família", Icon: IconHeart },
  { id: "outros", label: "Outros", Icon: IconPlus },
];

/**
 * A escolha de áreas da tela 5, com o rodapé de contagem e o botão.
 *
 * O cabeçalho (etapas e título) chega pronto do servidor em `cabecalho`. O
 * resto depende da seleção, inclusive o rodapé, que fica fora do corpo da
 * tela; por isso os dois blocos saem deste componente.
 *
 * Quando o limite de 3 é atingido, as opções não escolhidas ficam
 * `disabled` em vez de simplesmente ignorarem o clique: um botão que não faz
 * nada quando clicado parece quebrado, um botão desabilitado explica sozinho
 * que o limite chegou.
 */
export default function EscolhaAreas({ cabecalho }: { cabecalho: ReactNode }) {
  const router = useRouter();
  const [escolhidas, setEscolhidas] = useState<string[]>([]);

  const cheio = escolhidas.length >= MAXIMO;

  function alternar(id: string) {
    setEscolhidas((atual) =>
      atual.includes(id)
        ? atual.filter((item) => item !== id)
        : atual.length < MAXIMO
          ? [...atual, id]
          : atual,
    );
  }

  return (
    <>
      <div className="onboarding-body stagger">
        {cabecalho}

        <p className="onboarding-lede">
          Selecione até {MAXIMO} áreas principais. Dá para mudar depois.
        </p>

        <div className="area-grid">
          {opcoes.map(({ id, label, Icon }) => {
            const ativa = escolhidas.includes(id);
            return (
              <button
                type="button"
                key={id}
                className="area-tile"
                aria-pressed={ativa}
                disabled={cheio && !ativa}
                onClick={() => alternar(id)}
              >
                <span className="area-tile-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="onboarding-foot">
        <p className="muted-copy" style={{ textAlign: "center", margin: 0 }}>
          {escolhidas.length} de {MAXIMO} selecionadas
        </p>
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={escolhidas.length === 0}
          onClick={() => router.push("/planos")}
        >
          Continuar
          <span className="btn-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </>
  );
}
