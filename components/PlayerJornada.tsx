"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import JornadaIcone from "@/components/JornadaIcone";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import { IconArrowLeft, IconCheck, IconHeadphones, IconPause, IconPlay } from "@/components/icons";
import { concluirDia, posicaoDoDia, useJornadas } from "@/lib/jornadas/progresso";
import { TOTAL_DE_DIAS, roteiroDoDia } from "@/lib/jornadas/roteiro";
import type { DiaJornada, ModuloResumo } from "@/lib/jornadas/tipos";
import { Trilha, timbres, type TimbreId } from "@/lib/trilha";
import {
  AUDIO_VAZIO,
  calar,
  duracaoEstimada,
  falar,
  falarNoServidor,
  nomeCurto,
  prepararNoServidor,
  useVozServidor,
  useVozes,
} from "@/lib/voz";

/**
 * O reprodutor de um dia de jornada.
 *
 * A voz do aparelho lê o roteiro do dia frase por frase, com silêncios para
 * respirar, enquanto a trilha toca na frequência da jornada. A frase que está
 * sendo lida acende no texto, e pausar volta exatamente para ela.
 *
 * Ouvir até o fim marca o dia como feito na jornada.
 */

type Estado = "parado" | "tocando" | "pausado" | "concluido";
type Musica = TimbreId | "nenhuma";

/* --------------------------------------------------------------------------
   Preferências · timbre, volume e voz valem para todas as jornadas
   Ficam em localStorage e são lidas como store externo, para a tela já abrir
   com a escolha da última vez sem precisar de um efeito que acerte o estado.
   -------------------------------------------------------------------------- */

type Preferencias = {
  musica: Musica;
  volume: number;
  /** Nome da voz do aparelho escolhida. */
  voz: string | null;
  /** Id da voz do servidor escolhida (francisca, thalita...). */
  vozServidor: string | null;
};

const PREFERENCIAS = "vyra-trilha";
const PREFERENCIAS_MUDARAM = "vyra-trilha-mudou";
const PADRAO: Preferencias = { musica: "tigela", volume: 0.5, voz: null, vozServidor: null };

let ultimaLeitura: { bruto: string | null; valor: Preferencias } = { bruto: null, valor: PADRAO };

function lerPreferencias(): Preferencias {
  let bruto: string | null = null;
  try {
    bruto = localStorage.getItem(PREFERENCIAS);
  } catch {
    return PADRAO;
  }
  // Mesmo texto, mesmo objeto: o React compara por referência.
  if (bruto === ultimaLeitura.bruto) return ultimaLeitura.valor;

  let valor = PADRAO;
  try {
    const dados = JSON.parse(bruto ?? "{}") as Partial<Preferencias>;
    valor = {
      musica:
        dados.musica === "nenhuma" || timbres.some((timbre) => timbre.id === dados.musica)
          ? (dados.musica as Musica)
          : PADRAO.musica,
      volume: typeof dados.volume === "number" ? dados.volume : PADRAO.volume,
      voz: typeof dados.voz === "string" ? dados.voz : null,
      vozServidor: typeof dados.vozServidor === "string" ? dados.vozServidor : null,
    };
  } catch {
    // preferência corrompida: ficam as padrão
  }
  ultimaLeitura = { bruto, valor };
  return valor;
}

function salvarPreferencias(mudanca: Partial<Preferencias>) {
  try {
    localStorage.setItem(PREFERENCIAS, JSON.stringify({ ...lerPreferencias(), ...mudanca }));
    window.dispatchEvent(new Event(PREFERENCIAS_MUDARAM));
  } catch {
    // storage bloqueado: a escolha não fica guardada
  }
}

function assinarPreferencias(avisar: () => void) {
  window.addEventListener(PREFERENCIAS_MUDARAM, avisar);
  window.addEventListener("storage", avisar);
  return () => {
    window.removeEventListener(PREFERENCIAS_MUDARAM, avisar);
    window.removeEventListener("storage", avisar);
  };
}

function esperar(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function PlayerJornada({
  modulo,
  conteudo,
}: {
  modulo: ModuloResumo;
  conteudo: DiaJornada;
}) {
  const { mapa } = useJornadas();
  const { vozes, suporte } = useVozes();
  const servidor = useVozServidor();
  // Com a voz do servidor configurada, ela é a voz do reprodutor; sem ela, ou
  // enquanto a resposta não chega, vale a voz do aparelho.
  const usaServidor = servidor?.configurada === true && servidor.vozes.length > 0;

  const progresso = mapa[modulo.id];
  // Fora de uma jornada (link direto, ou dia que não está na duração
  // escolhida), o dia aparece pela posição no arco de 31.
  const posicaoNaJornada = progresso ? posicaoDoDia(progresso, conteudo.dia) : 0;
  const posicao = posicaoNaJornada || conteudo.dia;
  const total = posicaoNaJornada ? progresso.total : TOTAL_DE_DIAS;

  const falas = useMemo(() => roteiroDoDia(conteudo, posicao, total), [conteudo, posicao, total]);
  const primeiraAfirmacao = falas.findIndex((fala) => fala.tipo === "afirmacao");
  const minutos = Math.max(
    1,
    Math.round(falas.reduce((soma, fala) => soma + duracaoEstimada(fala.texto) + fala.pausa, 0) / 60000),
  );

  const [estado, setEstado] = useState<Estado>("parado");
  const [atual, setAtual] = useState(0);
  const {
    musica,
    volume,
    voz: vozNome,
    vozServidor: vozServidorPreferida,
  } = useSyncExternalStore(assinarPreferencias, lerPreferencias, () => PADRAO);

  const voz = vozes.find((item) => item.name === vozNome) ?? vozes[0] ?? null;
  const vozServidor =
    servidor?.vozes.find((item) => item.id === vozServidorPreferida)?.id ??
    servidor?.vozes[0]?.id ??
    null;

  const trilha = useRef<Trilha | null>(null);
  /** Um só elemento de áudio para todas as frases da voz do servidor. */
  const audio = useRef<HTMLAudioElement | null>(null);
  // Cada leitura recebe um número; pausar ou recomeçar troca o número, e a
  // leitura antiga percebe que não é mais a vez dela e para.
  const leitura = useRef(0);

  // Sair da tela cala a voz e desliga a música.
  useEffect(() => {
    const leituraAtual = leitura;
    const trilhaAtual = trilha;
    const audioAtual = audio;
    return () => {
      leituraAtual.current += 1;
      calar();
      audioAtual.current?.pause();
      trilhaAtual.current?.encerrar();
    };
  }, []);

  /**
   * Lê uma frase: na voz do servidor, se ela está ligada; se o áudio dela não
   * vier, nesta frase vale a voz do aparelho; sem nenhuma voz, só o tempo da
   * leitura passa, com o texto acendendo na tela.
   */
  async function dizer(texto: string, vozAparelho: SpeechSynthesisVoice | null, idServidor: string | null) {
    if (usaServidor && idServidor && audio.current) {
      try {
        await falarNoServidor(texto, idServidor, audio.current);
        return;
      } catch {
        // sem áudio do servidor para esta frase
      }
    }
    if (suporte) await falar(texto, vozAparelho);
    else await esperar(duracaoEstimada(texto));
  }

  // A frase lida fica no meio da tela, sem a pessoa precisar rolar.
  useEffect(() => {
    if (estado !== "tocando") return;
    const indice = falas[atual]?.tipo === "afirmacao" ? primeiraAfirmacao : atual;
    document.getElementById(`fala-${indice}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [atual, estado, falas, primeiraAfirmacao]);

  async function narrar(
    desde: number,
    vozUsada: SpeechSynthesisVoice | null,
    idServidor: string | null = vozServidor,
  ) {
    const minha = ++leitura.current;
    for (let indice = desde; indice < falas.length; indice++) {
      if (leitura.current !== minha) return;
      setAtual(indice);
      // A próxima frase já vai sendo buscada enquanto esta toca.
      const seguinte = falas[indice + 1];
      if (usaServidor && idServidor && seguinte) {
        prepararNoServidor(seguinte.texto, idServidor).catch(() => {});
      }
      await dizer(falas[indice].texto, vozUsada, idServidor);
      if (leitura.current !== minha) return;
      await esperar(falas[indice].pausa);
    }
    if (leitura.current !== minha) return;

    setEstado("concluido");
    trilha.current?.pausar();
    if (posicaoNaJornada) concluirDia(modulo.id, conteudo.dia);
  }

  function tocarMusica(escolha: Musica) {
    if (escolha === "nenhuma") {
      trilha.current?.pausar();
      return;
    }
    trilha.current ??= new Trilha();
    trilha.current.definirVolume(volume);
    void trilha.current.tocar(modulo.frequencia, escolha);
  }

  function tocar() {
    const desde = estado === "concluido" ? 0 : atual;
    setEstado("tocando");
    tocarMusica(musica);
    calar();
    if (usaServidor && !audio.current) {
      // Ainda dentro do toque: libera o áudio no iPhone (ver AUDIO_VAZIO).
      audio.current = new Audio(AUDIO_VAZIO);
      audio.current.play().catch(() => {});
    }
    void narrar(desde, voz);
  }

  function pausar() {
    leitura.current += 1;
    calar();
    audio.current?.pause();
    trilha.current?.pausar();
    setEstado("pausado");
  }

  function escolherMusica(escolha: Musica) {
    salvarPreferencias({ musica: escolha });
    if (estado === "tocando") tocarMusica(escolha);
  }

  function escolherVolume(valor: number) {
    salvarPreferencias({ volume: valor });
    trilha.current?.definirVolume(valor);
  }

  function escolherVoz(escolhida: SpeechSynthesisVoice) {
    salvarPreferencias({ voz: escolhida.name });
    // Troca na hora: a frase atual recomeça na voz nova.
    if (estado === "tocando") {
      calar();
      void narrar(atual, escolhida);
    }
  }

  function escolherVozServidor(id: string) {
    salvarPreferencias({ vozServidor: id });
    if (estado === "tocando") {
      // Pausar o áudio encerra a frase em curso; a leitura recomeça nela.
      leitura.current += 1;
      audio.current?.pause();
      void narrar(atual, voz, id);
    }
  }

  const tocando = estado === "tocando";
  const naAfirmacao = falas[atual]?.tipo === "afirmacao";

  const status = {
    parado: `Toque para começar · cerca de ${minutos} min`,
    tocando: naAfirmacao
      ? "Repita comigo"
      : falas[atual]?.tipo === "silencio"
        ? "Respire e imagine"
        : "Ouvindo",
    pausado: "Pausado",
    concluido: "Dia concluído",
  }[estado];

  return (
    <>
      <div className="stagger">
        <PageHeader
          eyebrow={`${modulo.titulo} · Dia ${posicao} de ${total}`}
          title={conteudo.titulo}
          action={
            <Link
              href={`/jornadas/${modulo.id}`}
              className="icon-button"
              aria-label="Voltar para a jornada"
            >
              <IconArrowLeft />
            </Link>
          }
        />
      </div>

      <section className="player glass" data-estado={estado}>
        <button
          type="button"
          className="player-orb"
          onClick={tocando ? pausar : tocar}
          aria-label={tocando ? "Pausar" : estado === "concluido" ? "Ouvir de novo" : "Ouvir"}
        >
          <span className="player-orb-ring" aria-hidden="true" />
          <span className="player-orb-ring" aria-hidden="true" />
          <span className="player-orb-core">{tocando ? <IconPause /> : <IconPlay />}</span>
        </button>

        <div className="player-info">
          <span className="player-freq">
            <JornadaIcone id={modulo.id} />
            {modulo.frequencia} Hz
          </span>
          <strong className="player-status" aria-live="polite">
            {status}
          </strong>
          <ProgressBar
            value={estado === "concluido" ? 100 : Math.round((atual / (falas.length - 1)) * 100)}
            small
            delay={0}
          />
        </div>
      </section>

      {estado === "concluido" ? (
        <section className="player-fim glass glass-pad">
          <span className="player-fim-check" aria-hidden="true">
            <IconCheck />
          </span>
          <div>
            <strong>Dia {posicao} concluído</strong>
            <p className="muted-copy">
              {posicaoNaJornada && posicao < total
                ? "O próximo dia libera amanhã. Leve a frase de hoje com você."
                : "Leve a frase de hoje com você."}
            </p>
          </div>
          <Link href={`/jornadas/${modulo.id}`} className="btn btn-primary btn-block">
            Voltar para a jornada
          </Link>
        </section>
      ) : null}

      <section className="player-ajustes glass glass-pad">
        <p className="eyebrow">Música na frequência de {modulo.frequencia} Hz</p>
        <div className="chip-wrap">
          {timbres.map((timbre) => (
            <button
              type="button"
              key={timbre.id}
              className="chip"
              aria-pressed={musica === timbre.id}
              onClick={() => escolherMusica(timbre.id)}
            >
              {timbre.label}
            </button>
          ))}
          <button
            type="button"
            className="chip"
            aria-pressed={musica === "nenhuma"}
            onClick={() => escolherMusica("nenhuma")}
          >
            Sem música
          </button>
        </div>

        {musica !== "nenhuma" ? (
          <label className="player-volume">
            <span>Volume da música</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(event) => escolherVolume(Number(event.target.value))}
            />
          </label>
        ) : null}

        {usaServidor ? (
          <>
            <p className="eyebrow player-ajustes-titulo">Voz</p>
            <div className="chip-wrap">
              {servidor.vozes.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className="chip"
                  title={item.descricao}
                  aria-pressed={vozServidor === item.id}
                  onClick={() => escolherVozServidor(item.id)}
                >
                  {item.nome}
                </button>
              ))}
            </div>
          </>
        ) : vozes.length > 1 ? (
          <>
            <p className="eyebrow player-ajustes-titulo">Voz</p>
            <div className="chip-wrap">
              {vozes.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className="chip"
                  aria-pressed={voz?.name === item.name}
                  onClick={() => escolherVoz(item)}
                >
                  {nomeCurto(item)}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {suporte === false && !usaServidor ? (
          <p className="muted-copy">
            Este navegador não lê em voz alta. O texto avança sozinho, no ritmo da leitura.
          </p>
        ) : null}

        <p className="muted-copy player-dica">
          <IconHeadphones /> {modulo.sobreFrequencia} Com fones de ouvido, ela fica mais nítida.
        </p>
      </section>

      <section className="roteiro glass" aria-label="Texto do dia">
        {falas.map((fala, indice) => {
          // A afirmação é lida três vezes, mas aparece uma vez só, com a contagem.
          if (fala.tipo === "afirmacao" && indice !== primeiraAfirmacao) return null;

          const ativa =
            estado !== "parado" &&
            (indice === atual || (fala.tipo === "afirmacao" && naAfirmacao));

          return (
            <p
              key={indice}
              id={`fala-${indice}`}
              className={`fala fala-${fala.tipo}`}
              data-ativa={ativa}
            >
              {fala.texto}
              {fala.tipo === "afirmacao" && ativa && estado === "tocando" ? (
                <small className="fala-contagem">{atual - primeiraAfirmacao + 1} de 3</small>
              ) : null}
            </p>
          );
        })}
      </section>
    </>
  );
}
