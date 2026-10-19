import type { ModuloResumo } from "@/lib/jornadas/tipos";

/**
 * As jornadas sem os textos: nome, frequência, cenário e de quais áreas elas
 * nascem. É leve o bastante para as telas cliente (o atalho do Início, o fim
 * do criador de objetivo); os 31 textos de cada uma ficam em lib/jornadas.
 *
 * As frequências seguem a tradição do solfejo usada em meditação. O app as
 * apresenta como "associadas a", nunca como efeito garantido.
 */
export const catalogo: ModuloResumo[] = [
  {
    id: "amor",
    nome: "Amor",
    titulo: "Atrair o amor",
    chamada: "Abrir o coração, cuidar de si e se preparar para um amor verdadeiro.",
    frequencia: 528,
    sobreFrequencia: "Conhecida como a frequência do amor e da transformação.",
    ambience: "horizon",
    areas: ["amor"],
  },
  {
    id: "carreira",
    nome: "Carreira",
    titulo: "Atrair o sucesso profissional",
    chamada: "Clareza, confiança e coragem para crescer no trabalho.",
    frequencia: 741,
    sobreFrequencia: "Associada à clareza, à expressão e às soluções.",
    ambience: "mountains",
    areas: ["carreira", "estudos"],
  },
  {
    id: "prosperidade",
    nome: "Prosperidade",
    titulo: "Atrair a prosperidade",
    chamada: "Uma relação nova com o dinheiro, sem culpa e sem medo da falta.",
    frequencia: 888,
    sobreFrequencia: "Muito usada nas práticas de abundância.",
    ambience: "sunrise",
    areas: ["financas", "casa"],
  },
  {
    id: "saude",
    nome: "Saúde",
    titulo: "Atrair saúde e vitalidade",
    chamada: "Escutar o corpo, criar bons hábitos e viver com mais energia.",
    frequencia: 285,
    sobreFrequencia: "Associada ao bem-estar e ao equilíbrio do corpo.",
    ambience: "horizon",
    areas: ["saude"],
  },
  {
    id: "familia",
    nome: "Família",
    titulo: "Harmonia em família",
    chamada: "Mais paz, presença e união dentro de casa.",
    frequencia: 639,
    sobreFrequencia: "Associada à harmonia nas relações.",
    ambience: "sunrise",
    areas: ["familia"],
  },
  {
    id: "fe",
    nome: "Fé",
    titulo: "Fé e propósito",
    chamada: "Silêncio, confiança e sentido para cada dia.",
    frequencia: 963,
    sobreFrequencia: "Associada à conexão espiritual.",
    ambience: "stars",
    areas: ["fe"],
  },
];

export function resumoPorId(id: string) {
  return catalogo.find((modulo) => modulo.id === id);
}

/** A jornada ligada a uma área do criador de objetivo, se houver. */
export function resumoDaArea(areaId: string) {
  return catalogo.find((modulo) => modulo.areas.includes(areaId));
}
