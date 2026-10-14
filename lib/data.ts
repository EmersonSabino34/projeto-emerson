const UNSPLASH = "https://images.unsplash.com/photo-";
const CROP = "?auto=format&fit=crop&w=900&q=85";

export type Category = {
  slug: string;
  title: string;
  /** Rótulo curto para a trilha horizontal, onde não cabe o título inteiro. */
  short: string;
  icon: string;
  description: string;
  image: string;
};

const categoryData = [
  ["lugares", "Lugares que desejo conhecer", "Lugares", "✈️", "Viagens, destinos e experiências pelo mundo.", "1502602898657-3e91760cbb34"],
  ["carreira", "Trabalho e carreira", "Carreira", "💼", "Profissão, negócios, crescimento e conquistas.", "1497366754035-f200968a6e72"],
  ["familia", "Família", "Família", "👨‍👩‍👧", "Momentos, pessoas e sonhos em família.", "1511895426328-dc8714191300"],
  ["casa", "Casa e patrimônio", "Casa", "🏡", "Casa própria, decoração, carros e patrimônio.", "1600585154340-be6161a56a0c"],
  ["financas", "Finanças", "Finanças", "💰", "Liberdade financeira, investimentos e prosperidade.", "1554224155-6726b3ff858f"],
  ["relacionamentos", "Relacionamentos", "Amor", "❤️", "Amor, casamento e conexões especiais.", "1519741497674-611481863552"],
  ["saude", "Saúde e bem-estar", "Saúde", "🧘", "Saúde física, mental e qualidade de vida.", "1545389336-cf090694435e"],
  ["espiritualidade", "Religião / Espiritualidade", "Fé", "🙏", "Fé, espiritualidade, propósito e paz.", "1507692049790-de58290a4334"],
  ["estudos", "Estudos", "Estudos", "🎓", "Cursos, formação, idiomas e conhecimento.", "1523240795612-9a054b0db644"],
  ["lazer", "Lazer e hobbies", "Lazer", "🎨", "Hobbies, diversão, criatividade e experiências.", "1513364776144-60967b0f800f"],
  ["outros", "Outros sonhos", "Outros", "🌟", "Tudo aquilo que você deseja realizar.", "1516321318423-f06f85e504b3"],
] as const;

export const categories: Category[] = categoryData.map(
  ([slug, title, short, icon, description, photo]) => ({
    slug,
    title,
    short,
    icon,
    description,
    image: `${UNSPLASH}${photo}${CROP}`,
  }),
);

export type Dream = {
  id: string;
  title: string;
  category: string;
  /** 0 a 100. */
  progress: number;
  target: string;
  image: string;
};

const dreamData = [
  ["1", "Conhecer Paris", "Lugares", 35, "€ 3.000", "1502602898657-3e91760cbb34"],
  ["2", "Meu cantinho", "Casa e patrimônio", 20, "R$ 80.000", "1600585154340-be6161a56a0c"],
  ["3", "Mais tempo em família", "Família", 68, "2026", "1511895426328-dc8714191300"],
] as const;

export const dreams: Dream[] = dreamData.map(([id, title, category, progress, target, photo]) => ({
  id,
  title,
  category,
  progress,
  target,
  image: `${UNSPLASH}${photo}${CROP}`,
}));

/* ==========================================================================
   VYRA · objetivos, frases e fotos das telas de referência
   ========================================================================== */

/**
 * Monta a URL de uma foto do banco com o recorte padrão do app.
 * Chama-se photoUrl, e não photo, porque os dois `map` acima já usam `photo`
 * como nome de parâmetro — o nome curto sombrearia a função dentro deles.
 */
export function photoUrl(id: string) {
  return `${UNSPLASH}${id}${CROP}`;
}

export type Goal = {
  id: string;
  title: string;
  /** 0 a 100. */
  progress: number;
  status: "andamento" | "concluido";
  category: string;
  deadline: string;
  image: string;
  /** Por que este objetivo importa — a pergunta da tela "Novo objetivo". */
  why: string;
};

const goalData = [
  ["1", "Abrir minha confeitaria", 70, "andamento", "Profissão", "Dez 2027", "1509440159596-0249088772ff", "Viver do que eu amo fazer."],
  ["2", "Viajar para o Japão", 40, "andamento", "Lugares", "Abr 2027", "1493976040374-85c8e12f0c0e", "Ver as cerejeiras com meus próprios olhos."],
  ["3", "Vida saudável", 60, "andamento", "Saúde", "Contínuo", "1544367567-0f2fcb009e0b", "Ter energia para a vida que eu quero viver."],
  ["4", "Liberdade financeira", 30, "andamento", "Finanças", "Dez 2030", "1554224155-6726b3ff858f", "Escolher meu tempo sem depender de ninguém."],
] as const;

export const goals: Goal[] = goalData.map(
  ([id, title, progress, status, category, deadline, img, why]) => ({
    id,
    title,
    progress,
    status,
    category,
    deadline,
    image: photoUrl(img),
    why,
  }),
);

/** Média de progresso dos objetivos — o número do anel em "Meu Progresso". */
export const goalProgress = Math.round(
  goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length,
);

export type Quote = { text: string; author: string };

/**
 * A frase que abre a Home. Gira por dia do ano em vez de sortear: assim a
 * mesma frase aparece no servidor e no cliente, sem divergência de hidratação
 * — e a pessoa vê uma frase por dia, não uma a cada refresh.
 */
const quoteBank: Quote[] = [
  {
    text: "Disciplina é a ponte entre o que você quer e o que você conquista.",
    author: "Jim Rohn",
  },
  {
    text: "Cuide do seu corpo. É o único lugar que você tem para viver.",
    author: "Jim Rohn",
  },
  {
    text: "A sua vibração atrai o que você vive.",
    author: "VYRA",
  },
  {
    text: "Sonhe grande, comece pequeno, comece agora.",
    author: "VYRA",
  },
];

export function quoteOfTheDay(date = new Date()): Quote {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dayOfYear = Math.floor((today - start) / 86_400_000);
  return quoteBank[dayOfYear % quoteBank.length];
}

/** Fotos de ambiente reaproveitadas pelas telas (montanha, aurora, amanhecer). */
export const scenery = {
  sunrise: photoUrl("1464822759023-fed622ff2c3b"),
  mountains: photoUrl("1519681393784-d120267933ba"),
  aurora: photoUrl("1483347756197-71ef80e95f73"),
  lake: photoUrl("1506905925346-21bda4d32df4"),
};

/**
 * Plano de Ação por objetivo — sonho → objetivo → etapas.
 * `done` guarda os índices já concluídos; é o que alimenta a contagem
 * "Etapas concluídas · 5 de 7" da tela de progresso.
 */
export type ActionPlan = { steps: string[]; done: number[] };

export const actionPlans: Record<string, ActionPlan> = {
  "1": {
    steps: [
      "Estudar o mercado",
      "Definir investimento",
      "Fazer cursos",
      "Criar identidade da marca",
      "Preparar plano financeiro",
      "Escolher o ponto",
      "Inaugurar",
    ],
    done: [0, 2],
  },
  "2": {
    steps: [
      "Definir a época da viagem",
      "Montar o orçamento",
      "Tirar o passaporte",
      "Reservar passagem e hospedagem",
      "Fechar o roteiro",
    ],
    done: [0],
  },
  "3": {
    steps: [
      "Beber 2L de água por dia",
      "Dormir 7 horas",
      "Treinar 3 vezes por semana",
      "Consulta de rotina",
    ],
    done: [0, 1],
  },
  "4": {
    steps: [
      "Mapear gastos do mês",
      "Montar reserva de emergência",
      "Definir aporte mensal",
      "Escolher onde investir",
    ],
    done: [0],
  },
};

/** O plano de um objetivo, ou um plano vazio se ele ainda não tem etapas. */
export function actionPlanFor(goalId: string): ActionPlan {
  return actionPlans[goalId] ?? { steps: [], done: [] };
}
