"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * A voz que lê as jornadas: a síntese de voz do próprio aparelho (Web Speech
 * API). Não custa nada e funciona sem internet, mas a qualidade depende do
 * aparelho: Chrome e Edge trazem vozes em português boas; outros navegadores,
 * nem sempre. Trocar por um serviço de voz neural é trocar este arquivo.
 */

/** Ritmo de meditação: um pouco mais devagar que a fala normal. */
const RITMO = 0.88;

/** Quanto tempo uma frase leva para ser lida, se a voz não avisar o fim. */
export function duracaoEstimada(texto: string) {
  const palavras = texto.trim().split(/\s+/).length;
  return Math.round((palavras * 430) / RITMO);
}

/**
 * As vozes em português do aparelho, as melhores primeiro: as vozes
 * "Natural"/"Online" do Edge e a do Google soam muito mais humanas que as
 * vozes locais antigas. No máximo quatro, para caberem como opções.
 */
function vozesEmPortugues(todas: SpeechSynthesisVoice[]) {
  const nota = (voz: SpeechSynthesisVoice) =>
    (voz.lang.toLowerCase() === "pt-br" ? 4 : 0) +
    (/natural|online|neural/i.test(voz.name) ? 2 : 0) +
    (/google/i.test(voz.name) ? 1 : 0);

  return todas
    .filter((voz) => voz.lang.toLowerCase().startsWith("pt"))
    .sort((a, b) => nota(b) - nota(a))
    .slice(0, 4);
}

/** "Microsoft Francisca Online (Natural) - Portuguese (Brazil)" vira "Francisca". */
export function nomeCurto(voz: SpeechSynthesisVoice) {
  const nome = voz.name
    .replace(/^Microsoft\s+/i, "")
    .replace(/\s*-\s*.*$/, "")
    .replace(/\s*\((natural|online)\)/gi, "")
    .replace(/\s+online/gi, "")
    .trim();
  return /google/i.test(nome) ? "Google" : nome;
}

const SEM_VOZES: SpeechSynthesisVoice[] = [];

function temSintese() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function assinarVozes(avisar: () => void) {
  if (!temSintese()) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", avisar);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", avisar);
}

// getVoices() devolve uma lista nova a cada chamada; o React precisa da MESMA
// lista enquanto nada mudou, senão renderiza em laço.
let ultimas = { chave: "", vozes: SEM_VOZES };

function vozesAtuais() {
  if (!temSintese()) return SEM_VOZES;
  const vozes = vozesEmPortugues(window.speechSynthesis.getVoices());
  const chave = vozes.map((voz) => voz.name).join("|");
  if (chave !== ultimas.chave) ultimas = { chave, vozes };
  return ultimas.vozes;
}

const nadaAssinar = () => () => {};

/**
 * As vozes disponíveis. Elas chegam depois do primeiro render (o Chrome as
 * carrega de forma assíncrona e avisa com "voiceschanged").
 *
 * `suporte` é null no servidor e false onde não há síntese de voz: aí o
 * reprodutor só mostra o texto, no ritmo da leitura.
 */
export function useVozes() {
  const vozes = useSyncExternalStore(assinarVozes, vozesAtuais, () => SEM_VOZES);
  const suporte = useSyncExternalStore(nadaAssinar, temSintese, () => null);
  return { vozes, suporte };
}

/**
 * Lê uma frase e resolve quando ela termina, ou quando é interrompida.
 *
 * Uma frase por vez, e não o texto inteiro, por três motivos: o Chrome corta
 * leituras longas depois de uns 15 segundos; a tela destaca a frase que está
 * sendo lida; e pausar volta exatamente para a frase em que parou.
 *
 * O limite de tempo cobre aparelhos em que a voz falha em silêncio e nunca
 * avisa o fim: sem ele, o reprodutor ficaria preso naquela frase.
 */
export function falar(texto: string, voz: SpeechSynthesisVoice | null): Promise<void> {
  return new Promise((resolve) => {
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = voz?.lang ?? "pt-BR";
    if (voz) fala.voice = voz;
    fala.rate = RITMO;

    const limite = window.setTimeout(resolve, duracaoEstimada(texto) * 2 + 3000);
    const fim = () => {
      window.clearTimeout(limite);
      resolve();
    };
    fala.onend = fim;
    fala.onerror = fim;

    window.speechSynthesis.speak(fala);
  });
}

export function calar() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

/* ==========================================================================
   Voz do servidor (/api/voz) · voz neural, quando há chave configurada
   --------------------------------------------------------------------------
   Melhor que a voz do aparelho e igual em qualquer celular. Quando a rota
   responde que não está configurada, ou falha, o reprodutor volta para a voz
   do aparelho acima, sem a pessoa precisar fazer nada.
   ========================================================================== */

export type VozDoServidor = { id: string; nome: string; descricao: string };
export type EstadoVozServidor = { configurada: boolean; vozes: VozDoServidor[] };

const SEM_SERVIDOR: EstadoVozServidor = { configurada: false, vozes: [] };

/** Se a voz do servidor está ligada e quais vozes ela oferece. null enquanto pergunta. */
export function useVozServidor() {
  const [estado, setEstado] = useState<EstadoVozServidor | null>(null);

  useEffect(() => {
    let ativo = true;
    fetch("/api/voz")
      .then((resposta) => (resposta.ok ? (resposta.json() as Promise<EstadoVozServidor>) : SEM_SERVIDOR))
      .catch(() => SEM_SERVIDOR)
      .then((dados) => {
        if (ativo) setEstado(dados);
      });
    return () => {
      ativo = false;
    };
  }, []);

  return estado;
}

/** Áudios já pedidos nesta visita, por voz e texto: cada frase baixa uma vez. */
const audios = new Map<string, Promise<string>>();

/**
 * Pede o áudio de uma frase e devolve a URL local dele. Chamado também para
 * a frase SEGUINTE enquanto a atual toca, para não haver espera entre elas.
 */
export function prepararNoServidor(texto: string, voz: string): Promise<string> {
  const chave = `${voz}|${texto}`;
  let pedido = audios.get(chave);
  if (!pedido) {
    pedido = fetch("/api/voz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, voz }),
    }).then(async (resposta) => {
      if (!resposta.ok) throw new Error(`/api/voz respondeu ${resposta.status}`);
      return URL.createObjectURL(await resposta.blob());
    });
    // Um pedido que falhou não fica guardado: a próxima tentativa refaz.
    pedido.catch(() => audios.delete(chave));
    audios.set(chave, pedido);
  }
  return pedido;
}

/**
 * Toca uma frase da voz do servidor no elemento de áudio do reprodutor e
 * resolve quando ela termina ou é pausada. Rejeita se o áudio não vier, para
 * quem chamou cair na voz do aparelho.
 */
export async function falarNoServidor(texto: string, voz: string, audio: HTMLAudioElement) {
  const url = await prepararNoServidor(texto, voz);
  await new Promise<void>((resolve) => {
    // "pause" chega tanto no fim da frase quanto quando a pessoa pausa.
    const fim = () => {
      audio.removeEventListener("pause", fim);
      audio.removeEventListener("error", fim);
      resolve();
    };
    audio.addEventListener("pause", fim);
    audio.addEventListener("error", fim);
    audio.src = url;
    audio.play().catch(fim);
  });
}

/**
 * Um WAV vazio. Tocado no toque em "Ouvir", libera o elemento de áudio no
 * iPhone, que só deixa tocar som que começa num gesto da pessoa; as frases
 * seguintes chegam depois de um fetch, já fora do gesto.
 */
export const AUDIO_VAZIO =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
