"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Collage from "@/components/Collage";
import { OpcaoFoto, OpcaoTexto, useToque } from "@/components/EscolhaPorToque";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import WallpaperPreview from "@/components/WallpaperPreview";
import { IconArrowLeft, IconCheck, IconSparkle } from "@/components/icons";
import {
  PERGUNTA_DESTAQUE,
  cursorDepois,
  frasesMural,
  perguntaMural,
  type Desejo,
} from "@/lib/desejos";
import { filtroMuralPorId, filtrosMural, layouts, photoBank, type MuralLayout } from "@/lib/murais";

/**
 * Criar mural por toque (telas 25 e 26).
 *
 * Nada aqui se digita. Cada tela é uma pergunta com várias opções, e um toque
 * escolhe e avança:
 *
 *   layout · como vai ser a composição (define quantas fotos)
 *   fotos  · uma pergunta por foto, até o mural ficar completo
 *   frase  · a frase que vai sobre o mural
 *   clima  · o tratamento de cor
 *   pronto · o mural no celular
 *
 * As fotos não vêm de upload: cada pergunta é uma área da vida ("Um lugar que
 * você quer conhecer") e cada opção é um desejo com a sua foto. Quem não
 * quiser escolher as dez toca em "O VYRA completa", e o resto do mural sai
 * das sugestões, na mesma ordem das perguntas.
 */

type Etapa = "layout" | "fotos" | "frase" | "clima" | "pronto";

type Escolha = {
  desejo: Desejo;
  /** A pergunta em que o desejo foi escolhido, para o voltar reabri-la. */
  pergunta: number;
  /** Veio do "O VYRA completa", e não de um toque da pessoa. */
  auto: boolean;
};

export default function CriadorMural() {
  const router = useRouter();
  const { marcado, tocar } = useToque();

  const [etapa, setEtapa] = useState<Etapa>("layout");
  const [layout, setLayout] = useState<MuralLayout>(layouts[0]);
  const [escolhas, setEscolhas] = useState<Escolha[]>([]);
  const [cursor, setCursor] = useState(PERGUNTA_DESTAQUE);
  const [legenda, setLegenda] = useState(frasesMural[0]);
  const [filtroId, setFiltroId] = useState(filtrosMural[0].id);

  const usados = new Set(escolhas.map((escolha) => escolha.desejo.id));
  const pergunta = perguntaMural(cursor, usados);
  const filtro = filtroMuralPorId(filtroId);

  // O layout inteiro, com null onde a foto ainda não foi escolhida.
  const fotos = Array.from(
    { length: layout.count },
    (_, index) => escolhas[index]?.desejo.foto ?? null,
  );

  // Cada resposta troca a pergunta; quem rolou até a última opção precisa
  // ver o título da próxima, e não o meio da grade.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [etapa, escolhas.length, cursor]);

  function escolherLayout(proximo: MuralLayout) {
    setLayout(proximo);
    setEtapa("fotos");
  }

  function escolherDesejo(desejo: Desejo, indice: number) {
    const novas = [...escolhas, { desejo, pergunta: indice, auto: false }];
    setEscolhas(novas);
    setCursor(cursorDepois(indice));
    if (novas.length >= layout.count) setEtapa("frase");
  }

  function pular(indice: number) {
    setCursor(cursorDepois(indice));
  }

  /** Preenche o que falta com a primeira opção livre de cada pergunta. */
  function completar() {
    const novas = [...escolhas];
    const ocupados = new Set(usados);
    let proximo = cursor;

    while (novas.length < layout.count) {
      const atual = perguntaMural(proximo, ocupados);
      if (!atual || atual.opcoes.length === 0) break;
      const desejo = atual.opcoes[0];
      novas.push({ desejo, pergunta: atual.indice, auto: true });
      ocupados.add(desejo.id);
      proximo = cursorDepois(atual.indice);
    }

    setEscolhas(novas);
    setCursor(proximo);
    setEtapa("frase");
  }

  /** Desfaz a última escolha e reabre a pergunta em que ela foi feita. */
  function desfazer(lista: Escolha[]) {
    const ultima = lista[lista.length - 1];
    setEscolhas(lista.slice(0, -1));
    setCursor(ultima.pergunta);
  }

  function voltar() {
    if (etapa === "fotos") {
      if (escolhas.length === 0) setEtapa("layout");
      else desfazer(escolhas);
    } else if (etapa === "frase") {
      // O que o VYRA completou sai de uma vez: a pessoa volta para a pergunta
      // em que tocou em "O VYRA completa", e não para a última sugestão dele.
      let lista = escolhas;
      while (lista.length > 1 && lista[lista.length - 1].auto && lista[lista.length - 2].auto) {
        lista = lista.slice(0, -1);
      }
      desfazer(lista);
      setEtapa("fotos");
    } else if (etapa === "clima") {
      setEtapa("frase");
    } else if (etapa === "pronto") {
      setEtapa("clima");
    }
  }

  function recomecar() {
    setEscolhas([]);
    setCursor(PERGUNTA_DESTAQUE);
    setLegenda(frasesMural[0]);
    setFiltroId(filtrosMural[0].id);
    setEtapa("layout");
  }

  const cabecalho = {
    layout: { eyebrow: "Novo mural · passo 1 de 4", title: "Como vai ser o seu mural?" },
    fotos: {
      eyebrow: `Foto ${Math.min(escolhas.length + 1, layout.count)} de ${layout.count}`,
      title: pergunta?.titulo ?? "",
    },
    frase: { eyebrow: "Novo mural · passo 3 de 4", title: "Qual frase vai no seu mural?" },
    clima: { eyebrow: "Novo mural · passo 4 de 4", title: "Qual é o clima do mural?" },
    pronto: { eyebrow: "Seu mural", title: "Seu mural está pronto" },
  }[etapa];

  const comMural = etapa === "fotos" || etapa === "frase" || etapa === "clima";

  // A chave troca a cada pergunta, então as opções novas entram em cascata
  // em vez de simplesmente substituírem as antigas no mesmo lugar.
  const chave = etapa === "fotos" ? `fotos-${escolhas.length}-${cursor}` : etapa;

  return (
    <>
      <div className="stagger">
        <PageHeader
          eyebrow={cabecalho.eyebrow}
          title={cabecalho.title}
          action={
            etapa === "layout" ? (
              <Link href="/mural" className="icon-button" aria-label="Voltar para os murais">
                <IconArrowLeft />
              </Link>
            ) : (
              <button type="button" className="icon-button" aria-label="Voltar" onClick={voltar}>
                <IconArrowLeft />
              </button>
            )
          }
        />
      </div>

      <div className={comMural ? "wizard wizard-com-mural" : "wizard"}>
        <div className="wizard-main" key={chave}>
          {etapa === "layout" ? (
            <>
              <p className="wizard-lede">
                Toque na composição. Depois, é só escolher o que você quer atrair, uma foto
                por vez.
              </p>
              <div className="pick-grid-layouts stagger">
                {layouts.map((opcao) => (
                  <button
                    type="button"
                    key={opcao.id}
                    className="layout-card"
                    aria-pressed={marcado === opcao.id}
                    onClick={() => tocar(opcao.id, () => escolherLayout(opcao))}
                  >
                    <Collage
                      layout={opcao}
                      photos={photoBank}
                      ratio="3 / 4"
                      className="collage-in-card"
                    />
                    <span className="layout-card-body">
                      <strong>{opcao.label}</strong>
                      <span>{opcao.count} fotos</span>
                      <span className="layout-card-note">{opcao.note}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {etapa === "fotos" && pergunta ? (
            <>
              <p className="wizard-lede">{pergunta.dica}</p>
              <div className="pick-grid stagger">
                {pergunta.opcoes.map((desejo) => (
                  <OpcaoFoto
                    key={desejo.id}
                    label={desejo.label}
                    foto={desejo.foto}
                    marcado={marcado === desejo.id}
                    onClick={() =>
                      tocar(desejo.id, () => escolherDesejo(desejo, pergunta.indice))
                    }
                  />
                ))}
              </div>

              <div className="wizard-actions">
                <button
                  type="button"
                  className="text-link"
                  onClick={() => pular(pergunta.indice)}
                >
                  Nenhuma dessas · ver outra área <span aria-hidden="true">→</span>
                </button>
                <button type="button" className="btn btn-ghost" onClick={completar}>
                  <IconSparkle />O VYRA completa para mim
                </button>
              </div>
            </>
          ) : null}

          {etapa === "frase" ? (
            <>
              <p className="wizard-lede">Ela aparece sobre as fotos, no meio do mural.</p>
              <div className="pick-list stagger">
                {frasesMural.map((frase) => (
                  <OpcaoTexto
                    key={frase}
                    citacao
                    marcado={marcado === frase}
                    onClick={() =>
                      tocar(frase, () => {
                        setLegenda(frase);
                        setEtapa("clima");
                      })
                    }
                  >
                    {frase.replace("\n", " ")}
                  </OpcaoTexto>
                ))}
                <OpcaoTexto
                  marcado={marcado === "sem-frase"}
                  onClick={() =>
                    tocar("sem-frase", () => {
                      setLegenda("");
                      setEtapa("clima");
                    })
                  }
                >
                  Sem frase, só as fotos
                </OpcaoTexto>
              </div>
            </>
          ) : null}

          {etapa === "clima" ? (
            <>
              <p className="wizard-lede">O mesmo mural, com cada tratamento de cor.</p>
              <div className="pick-grid-climas stagger">
                {filtrosMural.map((opcao) => (
                  <button
                    type="button"
                    key={opcao.id}
                    className="pick-mini"
                    aria-pressed={marcado === opcao.id}
                    onClick={() =>
                      tocar(opcao.id, () => {
                        setFiltroId(opcao.id);
                        setEtapa("pronto");
                      })
                    }
                  >
                    <span className="pick-check" aria-hidden="true">
                      <IconCheck />
                    </span>
                    <Collage
                      layout={layout}
                      photos={fotos}
                      ratio="3 / 4"
                      filtro={opcao.css}
                      className="collage-in-card"
                    />
                    {opcao.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {etapa === "pronto" ? (
            <div className="wizard-pronto">
              <WallpaperPreview
                layout={layout}
                photos={escolhas.map((escolha) => escolha.desejo.foto)}
                caption={legenda}
                filtro={filtro.css}
              />
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => router.push("/mural")}
              >
                Concluir mural
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </button>
              <button type="button" className="btn btn-ghost btn-block" onClick={recomecar}>
                Montar outro mural
              </button>
            </div>
          ) : null}
        </div>

        {comMural ? (
          <aside className="wizard-mural glass" aria-label="Seu mural até agora">
            <div className="wizard-mural-art">
              <Collage
                layout={layout}
                photos={fotos}
                ratio="3 / 4"
                caption={etapa === "fotos" ? undefined : legenda}
                filtro={filtro.css}
                className="collage-in-card"
              />
            </div>
            <div className="wizard-mural-info">
              <strong>
                {escolhas.length} de {layout.count} fotos
              </strong>
              <span>
                {escolhas.length >= layout.count ? "Mural completo" : `Layout ${layout.label}`}
              </span>
              <ProgressBar
                value={Math.round((escolhas.length / layout.count) * 100)}
                small
                delay={0}
              />
            </div>
          </aside>
        ) : null}
      </div>
    </>
  );
}
