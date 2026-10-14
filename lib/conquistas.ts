/**
 * Conquistas (tela 15).
 *
 * `recente` marca o que entrou nos últimos 30 dias — é o que alimenta a aba
 * "Recentes" enquanto não existe data real vinda do back-end.
 */
export type Conquista = {
  id: string;
  glyph: string;
  titulo: string;
  nota: string;
  categoria: string;
  recente: boolean;
};

export const conquistas: Conquista[] = [
  {
    id: "disciplina-30",
    glyph: "◎",
    titulo: "30 dias de disciplina",
    nota: "Você é incrível!",
    categoria: "Hábitos",
    recente: true,
  },
  {
    id: "primeira-meta",
    glyph: "★",
    titulo: "Primeira meta concluída",
    nota: "Parabéns!",
    categoria: "Objetivos",
    recente: true,
  },
  {
    id: "peso",
    glyph: "♡",
    titulo: "5 kg eliminados",
    nota: "Seu esforço vale a pena!",
    categoria: "Saúde",
    recente: false,
  },
  {
    id: "economia",
    glyph: "€",
    titulo: "€ 5.000 economizados",
    nota: "Liberdade financeira!",
    categoria: "Finanças",
    recente: false,
  },
  {
    id: "passaporte",
    glyph: "✈",
    titulo: "Passaporte renovado",
    nota: "Mais um passo para o mundo!",
    categoria: "Lugares",
    recente: true,
  },
];
