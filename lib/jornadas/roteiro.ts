import type { DiaJornada } from "@/lib/jornadas/tipos";

/**
 * A parte das jornadas que roda no cliente: durações, calendário e o roteiro
 * que a voz lê. Fica separada de lib/jornadas/index.ts de propósito: o índice
 * carrega os 186 textos, e o reprodutor só precisa do texto do dia que vai
 * tocar.
 */

/* ==========================================================================
   Duração · a pessoa escolhe quantos dias quer fazer
   ========================================================================== */

export const TOTAL_DE_DIAS = 31;

export const duracoes = [
  { total: 7, label: "7 dias", nota: "Uma semana para começar" },
  { total: 21, label: "21 dias", nota: "O tempo de criar um hábito" },
  { total: 31, label: "31 dias", nota: "A jornada completa" },
] as const;

/**
 * Os dias de conteúdo de uma jornada de `total` dias.
 *
 * Uma jornada mais curta não pega os primeiros dias do arco, que pararia na
 * fase de soltar: ela salta por ele em passos iguais, do dia 1 ao 31. Assim
 * os 7 dias também passam por soltar, merecer, sentir, agir e agradecer.
 */
export function diasDaJornada(total: number): number[] {
  if (total >= TOTAL_DE_DIAS) return Array.from({ length: TOTAL_DE_DIAS }, (_, i) => i + 1);
  if (total <= 1) return [1];
  return Array.from(
    { length: total },
    (_, i) => Math.round((i * (TOTAL_DE_DIAS - 1)) / (total - 1)) + 1,
  );
}

/* ==========================================================================
   Roteiro · o que a voz lê, fala por fala
   ========================================================================== */

export type TipoFala =
  | "abertura"
  | "titulo"
  | "texto"
  | "silencio"
  | "chamada"
  | "afirmacao"
  | "fechamento";

/**
 * O silêncio guiado depois do texto: só a música na frequência, para a pessoa
 * ficar com a imagem. É o coração da prática, e o motivo de ele ser o maior
 * silêncio do roteiro.
 */
const SILENCIO_MS = 20000;

export type Fala = {
  texto: string;
  tipo: TipoFala;
  /** Silêncio depois da fala, em ms: é o tempo de respirar e imaginar. */
  pausa: number;
};

/** Sete jeitos de começar. Giram com o dia, então o começo também muda. */
const aberturas = [
  "Encontre uma posição confortável. Se puder, feche os olhos. Respire fundo pelo nariz, e solte devagar pela boca.",
  "Deixe o corpo se acomodar. Inspire contando até quatro, e solte contando até seis. Mais uma vez.",
  "Antes de começar, solte os ombros e relaxe o rosto. Respire fundo e sinta o ar enchendo o peito.",
  "Coloque uma mão sobre o coração. Respire devagar e sinta o peito subir e descer.",
  "Respire fundo três vezes, cada vez um pouco mais devagar. Deixe o dia ficar lá fora por alguns minutos.",
  "Sente-se com a coluna confortável e as mãos soltas. Inspire pelo nariz, e expire pela boca, soltando o que pesa.",
  "Este é um momento só seu. Respire fundo e traga a sua atenção para cá, para agora.",
];

const fechamentos = [
  "Respire fundo mais uma vez. Leve essa sensação com você ao longo do dia.",
  "Quando sentir que é hora, mexa os dedos das mãos e dos pés, e abra os olhos devagar.",
  "Guarde essa frase com você hoje. Repita sempre que lembrar.",
  "Agradeça a você por este momento. Amanhã tem mais um passo.",
  "Respire fundo e sorria. O que você deseja já está a caminho.",
  "Leve essa luz com você. Até amanhã.",
  "Que o seu dia seja leve. O seu desejo está sendo cultivado.",
];

/** Divide o texto em frases, para a voz respirar entre uma e outra. */
function frases(texto: string) {
  return texto.split(/(?<=[.!?])\s+/).filter(Boolean);
}

/**
 * O roteiro do dia, na ordem em que a voz lê.
 *
 * Abertura e fechamento giram em passos diferentes (1 e 3), então a mesma
 * dupla só se repete depois de 7 dias, e mesmo assim com outro texto no meio:
 * nenhum dia soa igual a outro.
 */
export function roteiroDoDia(conteudo: DiaJornada, posicao: number, total: number): Fala[] {
  const abertura = aberturas[(conteudo.dia - 1) % aberturas.length];
  const fechamento = fechamentos[(conteudo.dia * 3) % fechamentos.length];
  const corpo = frases(conteudo.texto);

  return [
    { texto: abertura, tipo: "abertura", pausa: 2600 },
    { texto: `Dia ${posicao} de ${total}. ${conteudo.titulo}.`, tipo: "titulo", pausa: 1400 },
    ...corpo.map((frase, index) => ({
      texto: frase,
      tipo: "texto" as const,
      pausa: index === corpo.length - 1 ? 2400 : 1100,
    })),
    { texto: "Fique alguns instantes com essa imagem. Só respire.", tipo: "silencio", pausa: SILENCIO_MS },
    { texto: "Agora repita comigo, em silêncio ou em voz alta.", tipo: "chamada", pausa: 1200 },
    { texto: conteudo.afirmacao, tipo: "afirmacao", pausa: 3200 },
    { texto: conteudo.afirmacao, tipo: "afirmacao", pausa: 3200 },
    { texto: conteudo.afirmacao, tipo: "afirmacao", pausa: 2600 },
    { texto: fechamento, tipo: "fechamento", pausa: 0 },
  ];
}
