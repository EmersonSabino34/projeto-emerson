"use client";

import Link from "next/link";
import JornadaIcone from "@/components/JornadaIcone";
import ProgressBar from "@/components/ProgressBar";
import { IconSparkle } from "@/components/icons";
import { catalogo } from "@/lib/jornadas/catalogo";
import { resumoDoProgresso, useJornadas } from "@/lib/jornadas/progresso";

/**
 * A jornada na Home: quem está no meio de uma vai direto para o dia de hoje;
 * quem ainda não começou vê o convite para escolher uma.
 *
 * Enquanto o andamento carrega, o convite fica invisível no lugar, para a
 * Home não pular quando o cartão da jornada aparece.
 */
export default function CartaoJornada() {
  const { mapa, carregando } = useJornadas();

  const ativas = catalogo
    .filter((modulo) => mapa[modulo.id] && !resumoDoProgresso(mapa[modulo.id]).concluida)
    .slice(0, 2);

  if (carregando || ativas.length === 0) {
    return (
      <Link
        href="/jornadas"
        className="jornada-card"
        style={carregando ? { visibility: "hidden" } : undefined}
      >
        <span className="jornada-icone" aria-hidden="true">
          <IconSparkle />
        </span>
        <span className="jornada-card-body">
          <strong>Comece uma jornada de atração</strong>
          <span>Amor, carreira, prosperidade e mais: um texto novo por dia, lido em voz alta.</span>
        </span>
        <span className="choice-chevron" aria-hidden="true">
          →
        </span>
      </Link>
    );
  }

  return (
    <div className="jornada-list">
      {ativas.map((modulo) => {
        const progresso = mapa[modulo.id];
        const resumo = resumoDoProgresso(progresso);
        const href = resumo.proxima
          ? `/jornadas/${modulo.id}/dia/${resumo.dias[resumo.proxima - 1]}`
          : `/jornadas/${modulo.id}`;

        return (
          <Link href={href} key={modulo.id} className="jornada-card">
            <span className="jornada-icone" aria-hidden="true">
              <JornadaIcone id={modulo.id} />
            </span>
            <span className="jornada-card-body">
              <strong>{modulo.titulo}</strong>
              <span>
                {resumo.proxima
                  ? `Dia ${resumo.proxima} de ${progresso.total} · ouvir agora`
                  : `Dia ${resumo.liberadas} feito · o próximo libera amanhã`}
              </span>
              <ProgressBar
                value={Math.round((resumo.feitos / progresso.total) * 100)}
                small
                delay={0}
              />
            </span>
            <span className="choice-chevron" aria-hidden="true">
              →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
