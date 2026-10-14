import { photoUrl, scenery } from "@/lib/data";

/**
 * Frases e Fotos (telas 22 e 23).
 *
 * As três categorias das referências. Cada frase carrega a própria foto,
 * porque a combinação frase + imagem é o produto aqui — separar as duas
 * listas faria o app sortear pares que não combinam.
 */
export const categoriasFrase = ["Filosóficas", "Bíblicas", "Motivacionais"] as const;

export type CategoriaFrase = (typeof categoriasFrase)[number];

export type FraseArte = {
  id: string;
  categoria: CategoriaFrase;
  texto: string;
  autor: string;
  foto: string;
};

export const frasesArte: FraseArte[] = [
  {
    id: "f1",
    categoria: "Filosóficas",
    texto: "Disciplina é a ponte entre o que você quer e o que você conquista.",
    autor: "Jim Rohn",
    foto: scenery.mountains,
  },
  {
    id: "f2",
    categoria: "Filosóficas",
    texto: "Cuide do seu corpo. É o único lugar que você tem para viver.",
    autor: "Jim Rohn",
    foto: photoUrl("1544367567-0f2fcb009e0b"),
  },
  {
    id: "f3",
    categoria: "Filosóficas",
    texto: "Você não muda o vento, mas pode ajustar as velas.",
    autor: "Provérbio",
    foto: photoUrl("1499209974431-9dddcece7f88"),
  },
  {
    id: "b1",
    categoria: "Bíblicas",
    texto:
      "Porque eu sei os planos que tenho para vocês, planos de prosperidade e não de mal.",
    autor: "Jeremias 29:11",
    foto: scenery.sunrise,
  },
  {
    id: "b2",
    categoria: "Bíblicas",
    texto: "Tudo posso naquele que me fortalece.",
    autor: "Filipenses 4:13",
    foto: photoUrl("1507692049790-de58290a4334"),
  },
  {
    id: "m1",
    categoria: "Motivacionais",
    texto: "Sonhe grande, comece pequeno, comece agora.",
    autor: "VYRA",
    foto: scenery.lake,
  },
  {
    id: "m2",
    categoria: "Motivacionais",
    texto: "A sua vibração atrai o que você vive.",
    autor: "VYRA",
    foto: scenery.aurora,
  },
  {
    id: "m3",
    categoria: "Motivacionais",
    texto: "Sonhe. Planeje. Conquiste.",
    autor: "VYRA",
    foto: photoUrl("1470071459604-3b5ec3a7fe05"),
  },
];

export function fraseArtePorId(id: string) {
  return frasesArte.find((frase) => frase.id === id);
}

/** Os formatos de saída da tela 23. `ratio` alimenta o aspect-ratio do CSS. */
export const formatos = [
  { id: "story", label: "Story", nota: "9:16", ratio: "9 / 16" },
  { id: "post", label: "Post", nota: "4:5", ratio: "4 / 5" },
  { id: "quadrado", label: "Quadrado", nota: "1:1", ratio: "1 / 1" },
  { id: "wallpaper", label: "Wallpaper", nota: "9:19.5", ratio: "9 / 19.5" },
];
