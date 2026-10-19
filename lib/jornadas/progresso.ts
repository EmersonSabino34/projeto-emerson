"use client";

import { useEffect, useState } from "react";
import { diasDaJornada } from "@/lib/jornadas/roteiro";

/**
 * O andamento de cada jornada: quantos dias a pessoa escolheu, quando começou
 * e quais dias já ouviu até o fim.
 *
 * Fica em localStorage, como a sessão do protótipo (lib/auth.ts): só existe
 * neste aparelho. Quando a API entrar, este arquivo é o ponto de troca.
 */

const STORAGE_KEY = "vyra-jornadas";
const EVENTO = "vyra-jornadas-mudou";

export type Progresso = {
  /** 7, 21 ou 31. */
  total: number;
  /** Dia em que a jornada começou, "AAAA-MM-DD" no fuso de quem usa. */
  inicio: string;
  /** Dias de conteúdo (1 a 31) já ouvidos até o fim. */
  concluidos: number[];
};

type Mapa = Record<string, Progresso>;

/** "AAAA-MM-DD" da data local, sem passar por UTC. */
export function hojeLocal(data = new Date()) {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

/** Dias de calendário entre duas datas "AAAA-MM-DD", sem tropeçar no horário de verão. */
function diasEntre(inicio: string, fim: string) {
  const [a, b, c] = inicio.split("-").map(Number);
  const [x, y, z] = fim.split("-").map(Number);
  return Math.round((Date.UTC(x, y - 1, z) - Date.UTC(a, b - 1, c)) / 86_400_000);
}

/**
 * Quantas posições da jornada já estão liberadas: uma por dia de calendário,
 * a partir do dia em que ela começou. É o que faz a jornada ter o ritmo de um
 * texto por dia.
 */
export function posicoesLiberadas(progresso: Progresso, hoje = hojeLocal()) {
  return Math.max(1, Math.min(progresso.total, diasEntre(progresso.inicio, hoje) + 1));
}

/** Posição (1 a total) de um dia de conteúdo nesta jornada, ou 0 se ele não faz parte. */
export function posicaoDoDia(progresso: Progresso, dia: number) {
  return diasDaJornada(progresso.total).indexOf(dia) + 1;
}

/**
 * Onde a pessoa está na jornada.
 *
 * `proxima` é a primeira posição liberada que ela ainda não ouviu: quem pulou
 * um dia volta para ele, em vez de a jornada seguir deixando o buraco. Quando
 * é null e a jornada não terminou, o dia de hoje já foi feito.
 */
export function resumoDoProgresso(progresso: Progresso, hoje = hojeLocal()) {
  const dias = diasDaJornada(progresso.total);
  const liberadas = posicoesLiberadas(progresso, hoje);
  const feitos = dias.filter((dia) => progresso.concluidos.includes(dia)).length;
  const indice = dias.slice(0, liberadas).findIndex((dia) => !progresso.concluidos.includes(dia));

  return {
    dias,
    liberadas,
    feitos,
    concluida: feitos >= progresso.total,
    proxima: indice === -1 ? null : indice + 1,
  };
}

function ler(): Mapa {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    const dados = bruto ? (JSON.parse(bruto) as unknown) : {};
    return dados && typeof dados === "object" ? (dados as Mapa) : {};
  } catch {
    return {};
  }
}

function gravar(mapa: Mapa) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mapa));
    window.dispatchEvent(new Event(EVENTO));
  } catch {
    // storage bloqueado: o andamento vale só enquanto a página estiver aberta
  }
}

export function iniciarJornada(moduloId: string, total: number) {
  gravar({ ...ler(), [moduloId]: { total, inicio: hojeLocal(), concluidos: [] } });
}

export function concluirDia(moduloId: string, dia: number) {
  const mapa = ler();
  const atual = mapa[moduloId];
  if (!atual || atual.concluidos.includes(dia)) return;
  gravar({ ...mapa, [moduloId]: { ...atual, concluidos: [...atual.concluidos, dia] } });
}

export function encerrarJornada(moduloId: string) {
  const mapa = ler();
  delete mapa[moduloId];
  gravar(mapa);
}

/**
 * O andamento de todas as jornadas, lido no cliente.
 *
 * `carregando` existe pelo mesmo motivo do useSessao: no primeiro render não
 * há localStorage, e sem esse estado a tela piscaria "jornada não iniciada"
 * para quem já está no dia 12.
 */
export function useJornadas() {
  const [mapa, setMapa] = useState<Mapa>({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    function sincronizar() {
      setMapa(ler());
      setCarregando(false);
    }

    sincronizar();
    window.addEventListener(EVENTO, sincronizar);
    window.addEventListener("storage", sincronizar);

    return () => {
      window.removeEventListener(EVENTO, sincronizar);
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  return { mapa, carregando };
}
