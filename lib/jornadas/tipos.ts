/** Um dia de jornada: o título, o texto guiado e a frase para repetir. */
export type DiaJornada = {
  /** Posição no arco de 31 dias (1 a 31). */
  dia: number;
  titulo: string;
  texto: string;
  afirmacao: string;
};

/** Como cada arquivo de jornada escreve os seus dias: [título, texto, afirmação]. */
export type LinhaDia = readonly [titulo: string, texto: string, afirmacao: string];

export type Ambience = "sunrise" | "aurora" | "mountains" | "stars" | "horizon";

/** Uma jornada sem os seus 31 textos: é o que as telas cliente recebem. */
export type ModuloResumo = {
  id: string;
  /** O nome curto, para cartões e chips. */
  nome: string;
  /** O título da jornada, como ela aparece no topo da tela. */
  titulo: string;
  chamada: string;
  /** Hz. É a nota em que toda a trilha da jornada é afinada. */
  frequencia: number;
  sobreFrequencia: string;
  ambience: Ambience;
  /** Áreas do criador de objetivo (lib/desejos) que levam a esta jornada. */
  areas: string[];
};
