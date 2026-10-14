import { photoUrl, scenery } from "@/lib/data";

/**
 * Conteúdo das telas de área (Vibração, Mentalizar, Saúde, Profissão,
 * Religião, Lugares).
 *
 * Cada área tem um layout próprio nas telas de referência — Vibração é uma
 * grade de humores, Mentalizar são sessões com foto e duração, Lugares é uma
 * galeria. Em vez de achatar tudo numa lista genérica (que perderia o
 * desenho de cada tela) ou de escrever seis páginas quase iguais, o conteúdo
 * é uma união discriminada por `kind` e a rota /area/[slug] escolhe o
 * renderizador certo.
 */

export type AreaBlock =
  /** Grade de estados — "Como você está hoje?" */
  | { kind: "moods"; title: string; items: { label: string; glyph: string }[] }
  /** Sessões guiadas com foto e duração. */
  | {
      kind: "sessions";
      title: string;
      items: { label: string; minutes: number; image: string }[];
    }
  /** Indicadores do dia — água, sono, exercício. */
  | { kind: "habits"; title: string; items: { label: string; value: string; glyph: string }[] }
  /** Lista simples de atalhos. */
  | { kind: "list"; title: string; items: string[] }
  /** Versículo ou texto de leitura, com plano. */
  | { kind: "verse"; title: string; text: string; source: string; plan: string }
  /** Galeria de destinos. */
  | { kind: "places"; title: string; items: { label: string; note: string; image: string }[] };

export type AreaContent = {
  /** Frase que abre a tela, no painel de vidro sobre o cenário. */
  quote: { text: string; author: string };
  blocks: AreaBlock[];
};

export const areaContent: Record<string, AreaContent> = {
  vibracao: {
    quote: { text: "A sua vibração atrai o que você vive.", author: "VYRA" },
    blocks: [
      {
        kind: "moods",
        title: "Como você está hoje?",
        items: [
          { label: "Gratidão", glyph: "✦" },
          { label: "Confiança", glyph: "◇" },
          { label: "Prosperidade", glyph: "◎" },
          { label: "Amor", glyph: "♡" },
          { label: "Paz", glyph: "◯" },
          { label: "Energia", glyph: "⚡" },
        ],
      },
    ],
  },

  mentalizar: {
    quote: {
      text: "Minha vida dos sonhos já começou — eu só estou caminhando até ela.",
      author: "VYRA",
    },
    blocks: [
      {
        kind: "sessions",
        title: "Visualizações",
        items: [
          { label: "Minha vida dos sonhos", minutes: 15, image: scenery.lake },
          { label: "Prosperidade", minutes: 10, image: photoUrl("1470071459604-3b5ec3a7fe05") },
          { label: "Confiança", minutes: 8, image: photoUrl("1499209974431-9dddcece7f88") },
          { label: "Saúde e Energia", minutes: 12, image: photoUrl("1544367567-0f2fcb009e0b") },
        ],
      },
      {
        kind: "list",
        title: "Afirmações",
        items: [
          "Eu confio no meu caminho.",
          "Eu mereço o que estou construindo.",
          "Minha disciplina é maior que a minha vontade de desistir.",
          "Eu atraio o que eu pratico.",
        ],
      },
    ],
  },

  saude: {
    quote: {
      text: "Cuide do seu corpo. É o único lugar que você tem para viver.",
      author: "Jim Rohn",
    },
    blocks: [
      {
        kind: "habits",
        title: "Hoje",
        items: [
          { label: "Água", value: "6/8", glyph: "◌" },
          { label: "Sono", value: "7h", glyph: "☾" },
          { label: "Alimentação", value: "3 refeições", glyph: "✿" },
          { label: "Exercício", value: "40 min", glyph: "⚡" },
          { label: "Humor", value: "Tranquila", glyph: "♡" },
          { label: "Meditação", value: "10 min", glyph: "◯" },
        ],
      },
    ],
  },

  profissao: {
    quote: {
      text: "Trabalhe mais em você do que no seu emprego.",
      author: "Jim Rohn",
    },
    blocks: [
      {
        kind: "list",
        title: "Minha evolução",
        items: [
          "Minha carreira ideal",
          "Cursos e estudos",
          "Habilidades",
          "Metas financeiras",
          "Planejamento",
          "Inspirações",
        ],
      },
    ],
  },

  religiao: {
    quote: {
      text: "Porque eu sei os planos que tenho para vocês, planos de prosperidade.",
      author: "Jeremias 29:11",
    },
    blocks: [
      {
        kind: "verse",
        title: "Hoje",
        text:
          "Porque eu sei os planos que tenho para vocês, planos de prosperidade " +
          "e não de mal, para lhes dar um futuro e uma esperança.",
        source: "Jeremias 29:11",
        plan: "Gênesis",
      },
    ],
  },

  lugares: {
    quote: {
      text: "Os lugares que você sonha visitar já existem. Falta a data.",
      author: "VYRA",
    },
    blocks: [
      {
        kind: "places",
        title: "Minha lista",
        items: [
          { label: "Nova York", note: "EUA", image: photoUrl("1496442226666-8d4d0e62e6e9") },
          { label: "Paris", note: "França", image: photoUrl("1502602898657-3e91760cbb34") },
          { label: "Tóquio", note: "Japão", image: photoUrl("1493976040374-85c8e12f0c0e") },
          { label: "Santorini", note: "Grécia", image: photoUrl("1570077188670-e3a8d69ac5ff") },
        ],
      },
    ],
  },
};

export function areaContentFor(slug: string) {
  return areaContent[slug];
}
