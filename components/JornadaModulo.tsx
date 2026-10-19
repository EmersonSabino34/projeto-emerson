"use client";

import Link from "next/link";
import { useState } from "react";
import { OpcaoTexto, useToque } from "@/components/EscolhaPorToque";
import JornadaIcone from "@/components/JornadaIcone";
import ProgressBar from "@/components/ProgressBar";
import SectionTitle from "@/components/SectionTitle";
import { IconCheck, IconHeadphones, IconLock, IconPlay } from "@/components/icons";
import {
  encerrarJornada,
  iniciarJornada,
  resumoDoProgresso,
  useJornadas,
  type Progresso,
} from "@/lib/jornadas/progresso";
import { duracoes } from "@/lib/jornadas/roteiro";
import type { ModuloResumo } from "@/lib/jornadas/tipos";

/**
 * A tela de uma jornada (amor, carreira...).
 *
 * Antes de começar: quantos dias a pessoa quer fazer, por toque.
 * Depois: o dia de hoje em destaque e a lista de todos os dias. Os dias
 * futuros aparecem com o título, mas trancados: a jornada é um texto por dia,
 * e o próximo libera à meia-noite de quem está usando.
 */
export default function JornadaModulo({
  modulo,
  titulos,
}: {
  modulo: ModuloResumo;
  /** Os títulos dos 31 dias, na ordem do arco. */
  titulos: string[];
}) {
  const { mapa, carregando } = useJornadas();
  const { marcado, tocar } = useToque();
  const [confirmando, setConfirmando] = useState(false);

  const progresso = mapa[modulo.id];

  return (
    <>
      <section className="jornada-hero glass glass-pad">
        <span className="jornada-icone jornada-icone-lg" aria-hidden="true">
          <JornadaIcone id={modulo.id} />
        </span>
        <div>
          <p className="jornada-freq">{modulo.frequencia} Hz</p>
          <p className="jornada-hero-chamada">{modulo.chamada}</p>
          <p className="muted-copy">{modulo.sobreFrequencia}</p>
        </div>
      </section>

      {carregando ? null : !progresso ? (
        <section className="section">
          <SectionTitle eyebrow="Toque para começar" title="Quantos dias você quer fazer?" />
          <div className="pick-list stagger">
            {duracoes.map((duracao) => (
              <OpcaoTexto
                key={duracao.total}
                marcado={marcado === String(duracao.total)}
                onClick={() =>
                  tocar(String(duracao.total), () => iniciarJornada(modulo.id, duracao.total))
                }
              >
                {duracao.label}
                <small className="pick-text-nota">{duracao.nota}</small>
              </OpcaoTexto>
            ))}
          </div>
          <p className="muted-copy jornada-dica">
            <IconHeadphones /> Um texto novo por dia, lido em voz alta. Com fones de ouvido, a
            frequência fica mais nítida.
          </p>
        </section>
      ) : (
        <Andamento
          modulo={modulo}
          titulos={titulos}
          progresso={progresso}
          confirmando={confirmando}
          setConfirmando={setConfirmando}
        />
      )}
    </>
  );
}

function Andamento({
  modulo,
  titulos,
  progresso,
  confirmando,
  setConfirmando,
}: {
  modulo: ModuloResumo;
  titulos: string[];
  progresso: Progresso;
  confirmando: boolean;
  setConfirmando: (valor: boolean) => void;
}) {
  const resumo = resumoDoProgresso(progresso);
  const hrefDia = (posicao: number) => `/jornadas/${modulo.id}/dia/${resumo.dias[posicao - 1]}`;

  return (
    <>
      <section className="jornada-hoje section">
        {resumo.concluida ? (
          <>
            <p className="eyebrow">Jornada concluída</p>
            <h2>Você completou os {progresso.total} dias</h2>
            <p className="muted-copy">
              O que você cultivou continua com você. Dá para refazer quando quiser, ou começar
              outra jornada.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => encerrarJornada(modulo.id)}
            >
              Fazer de novo
            </button>
          </>
        ) : resumo.proxima ? (
          <>
            <p className="eyebrow">
              Dia {resumo.proxima} de {progresso.total}
            </p>
            <h2>{titulos[resumo.dias[resumo.proxima - 1] - 1]}</h2>
            <Link href={hrefDia(resumo.proxima)} className="btn btn-primary btn-block">
              <IconPlay />
              Ouvir o dia {resumo.proxima}
            </Link>
          </>
        ) : (
          <>
            <p className="eyebrow">Dia {resumo.liberadas} feito</p>
            <h2>Até amanhã</h2>
            <p className="muted-copy">
              O dia {resumo.liberadas + 1} libera amanhã. Se quiser, ouça de novo qualquer dia
              que já passou.
            </p>
          </>
        )}

        <div className="jornada-progresso">
          <ProgressBar value={Math.round((resumo.feitos / progresso.total) * 100)} small />
          <span>
            {resumo.feitos} de {progresso.total} dias
          </span>
        </div>
      </section>

      <section className="section">
        <SectionTitle eyebrow="Um por dia" title="Seus dias" />
        <ol className="dia-list">
          {resumo.dias.map((dia, index) => {
            const posicao = index + 1;
            const feito = progresso.concluidos.includes(dia);
            const liberado = posicao <= resumo.liberadas;
            const faltam = posicao - resumo.liberadas;

            const conteudo = (
              <>
                <span className="dia-badge" aria-hidden="true">
                  {feito ? <IconCheck /> : liberado ? posicao : <IconLock />}
                </span>
                <span className="dia-titulo">
                  <span className="dia-numero">Dia {posicao}</span>
                  {titulos[dia - 1]}
                </span>
                <span className="dia-status">
                  {feito
                    ? "Feito"
                    : liberado
                      ? posicao === resumo.proxima
                        ? "Hoje"
                        : "Disponível"
                      : faltam === 1
                        ? "Amanhã"
                        : `Em ${faltam} dias`}
                </span>
              </>
            );

            return (
              <li key={dia}>
                {liberado ? (
                  <Link href={hrefDia(posicao)} className="dia-row" data-feito={feito}>
                    {conteudo}
                  </Link>
                ) : (
                  <div className="dia-row" data-bloqueado="true">
                    {conteudo}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="jornada-recomecar">
        {confirmando ? (
          <>
            <p className="muted-copy">Recomeçar apaga o andamento desta jornada.</p>
            <div className="mural-card-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmando(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setConfirmando(false);
                  encerrarJornada(modulo.id);
                }}
              >
                Recomeçar
              </button>
            </div>
          </>
        ) : (
          <button type="button" className="text-link" onClick={() => setConfirmando(true)}>
            Recomeçar ou mudar a duração
          </button>
        )}
      </div>
    </>
  );
}
