"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OpcaoFoto, OpcaoTexto, useToque } from "@/components/EscolhaPorToque";
import JornadaIcone from "@/components/JornadaIcone";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import { IconArrowLeft } from "@/components/icons";
import {
  areasDesejo,
  motivos,
  prazos,
  rotuloPrazo,
  type AreaDesejo,
  type Desejo,
} from "@/lib/desejos";
import { resumoDaArea } from "@/lib/jornadas/catalogo";

/**
 * Novo objetivo por toque (tela 12): o que a pessoa quer atrair.
 *
 * Substitui o formulário de quatro campos. As mesmas quatro respostas saem
 * daqui, mas cada uma é uma escolha entre opções, e não um campo para
 * digitar:
 *
 *   area   · em qual área da vida
 *   desejo · o que atrair (vira o título e a foto do objetivo)
 *   prazo  · para quando
 *   motivo · por que isso importa
 *
 * Ainda não persiste, como o formulário antigo: "Criar objetivo" devolve para
 * a lista. Com a API, as quatro respostas viram o corpo do POST.
 */

type Etapa = "area" | "desejo" | "prazo" | "motivo" | "pronto";

const ANTERIOR: Record<Etapa, Etapa | null> = {
  area: null,
  desejo: "area",
  prazo: "desejo",
  motivo: "prazo",
  pronto: "motivo",
};

export default function CriadorObjetivo() {
  const router = useRouter();
  const { marcado, tocar } = useToque();

  const [etapa, setEtapa] = useState<Etapa>("area");
  const [area, setArea] = useState<AreaDesejo>(areasDesejo[0]);
  const [desejo, setDesejo] = useState<Desejo>(areasDesejo[0].desejos[0]);
  const [prazo, setPrazo] = useState("");
  const [motivo, setMotivo] = useState("");

  // Cada resposta troca a pergunta: a próxima começa do topo da tela.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [etapa]);

  function recomecar() {
    setEtapa("area");
  }

  const anterior = ANTERIOR[etapa];
  const jornada = resumoDaArea(area.id);

  const cabecalho = {
    area: { eyebrow: "Novo objetivo · 1 de 4", title: "Em qual área da sua vida?" },
    desejo: { eyebrow: `${area.label} · 2 de 4`, title: "O que você quer atrair?" },
    prazo: { eyebrow: "Novo objetivo · 3 de 4", title: "Para quando?" },
    motivo: { eyebrow: "Novo objetivo · 4 de 4", title: "Por que isso importa para você?" },
    pronto: { eyebrow: "Seu novo objetivo", title: desejo.label },
  }[etapa];

  return (
    <>
      <div className="stagger">
        <PageHeader
          eyebrow={cabecalho.eyebrow}
          title={cabecalho.title}
          action={
            anterior ? (
              <button
                type="button"
                className="icon-button"
                aria-label="Voltar"
                onClick={() => setEtapa(anterior)}
              >
                <IconArrowLeft />
              </button>
            ) : (
              <Link href="/objetivos" className="icon-button" aria-label="Voltar para os objetivos">
                <IconArrowLeft />
              </Link>
            )
          }
        />
      </div>

      <div className="wizard">
        <div className="wizard-main" key={etapa}>
          {etapa === "area" ? (
            <>
              <p className="wizard-lede">Toque na área do que você quer atrair.</p>
              <div className="pick-grid stagger">
                {areasDesejo.map((opcao) => (
                  <OpcaoFoto
                    key={opcao.id}
                    larga
                    label={opcao.label}
                    foto={opcao.capa}
                    marcado={marcado === opcao.id}
                    onClick={() =>
                      tocar(opcao.id, () => {
                        setArea(opcao);
                        setEtapa("desejo");
                      })
                    }
                  />
                ))}
              </div>
            </>
          ) : null}

          {etapa === "desejo" ? (
            <>
              <p className="wizard-lede">{area.pergunta}. Escolha o que mais combina com você.</p>
              <div className="pick-grid stagger">
                {area.desejos.map((opcao) => (
                  <OpcaoFoto
                    key={opcao.id}
                    label={opcao.label}
                    foto={opcao.foto}
                    marcado={marcado === opcao.id}
                    onClick={() =>
                      tocar(opcao.id, () => {
                        setDesejo(opcao);
                        setEtapa("prazo");
                      })
                    }
                  />
                ))}
              </div>
            </>
          ) : null}

          {etapa === "prazo" ? (
            <>
              <p className="wizard-lede">{desejo.label}. Um prazo transforma o sonho em meta.</p>
              <div className="pick-list stagger">
                {prazos.map((opcao) => (
                  <OpcaoTexto
                    key={opcao.id}
                    marcado={marcado === opcao.id}
                    onClick={() =>
                      tocar(opcao.id, () => {
                        // A data sai na hora do toque, no relógio de quem tocou.
                        setPrazo(rotuloPrazo(opcao));
                        setEtapa("motivo");
                      })
                    }
                  >
                    {opcao.label}
                  </OpcaoTexto>
                ))}
              </div>
            </>
          ) : null}

          {etapa === "motivo" ? (
            <>
              <p className="wizard-lede">O motivo é o que segura você nos dias difíceis.</p>
              <div className="pick-list stagger">
                {motivos.map((opcao) => (
                  <OpcaoTexto
                    key={opcao}
                    citacao
                    marcado={marcado === opcao}
                    onClick={() =>
                      tocar(opcao, () => {
                        setMotivo(opcao);
                        setEtapa("pronto");
                      })
                    }
                  >
                    {opcao}
                  </OpcaoTexto>
                ))}
              </div>
            </>
          ) : null}

          {etapa === "pronto" ? (
            <div className="stagger">
              <section
                className="quote-hero"
                style={{ backgroundImage: `url(${desejo.foto})` }}
              >
                <div className="quote-hero-copy">
                  <blockquote>&ldquo;{motivo}&rdquo;</blockquote>
                  <cite>
                    {area.label} ·{" "}
                    {prazo === "Contínuo" ? "para a vida toda" : `meta para ${prazo}`}
                  </cite>
                </div>
              </section>

              <section className="section">
                <SectionTitle eyebrow="O VYRA sugere" title="Primeiros passos" />
                <div className="fact-list">
                  {area.passos.map((passo, index) => (
                    <div className="fact-row" key={passo}>
                      <span className="choice-icon" aria-hidden="true">
                        {index + 1}
                      </span>
                      <span>{passo}</span>
                    </div>
                  ))}
                </div>
              </section>

              {jornada ? (
                <section className="section">
                  <SectionTitle eyebrow="Para atrair isso" title="Faça a jornada" />
                  <Link href={`/jornadas/${jornada.id}`} className="jornada-card">
                    <span className="jornada-icone" aria-hidden="true">
                      <JornadaIcone id={jornada.id} />
                    </span>
                    <span className="jornada-card-body">
                      <strong>{jornada.titulo}</strong>
                      <span>
                        7, 21 ou 31 dias de texto guiado, com música em {jornada.frequencia} Hz.
                      </span>
                    </span>
                    <span className="choice-chevron" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </section>
              ) : null}

              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => router.push("/objetivos")}
                >
                  Criar objetivo
                  <span className="btn-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
                <button type="button" className="btn btn-ghost btn-block" onClick={recomecar}>
                  Escolher outro
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
