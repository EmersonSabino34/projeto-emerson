import { photoUrl } from "@/lib/data";

/**
 * O que a pessoa pode atrair — o catálogo das telas de criação por toque.
 *
 * Criar um mural e criar um objetivo não pedem digitação: cada tela faz uma
 * pergunta, mostra várias opções e um toque escolhe. Este arquivo é a fonte
 * das opções. Cada desejo carrega a própria foto, porque é ela que entra no
 * mural, e cada área carrega a pergunta que a apresenta.
 *
 * Toda foto aqui foi conferida contra o rótulo: trocar um id é trocar o que
 * aparece no mural da pessoa, então confira a imagem antes.
 */

export type Desejo = {
  id: string;
  label: string;
  foto: string;
  /** Id da área a que o desejo pertence. */
  area: string;
};

export type AreaDesejo = {
  id: string;
  label: string;
  /** A pergunta da área no criador de mural. */
  pergunta: string;
  /** Foto que representa a área quando ela é a opção (criador de objetivo). */
  capa: string;
  desejos: Desejo[];
  /** As primeiras etapas que o VYRA sugere para um objetivo desta área. */
  passos: string[];
};

type Linha = [id: string, label: string, fotoId: string];

function area(
  id: string,
  label: string,
  pergunta: string,
  linhas: Linha[],
  passos: string[],
): AreaDesejo {
  const desejos = linhas.map(([desejoId, desejoLabel, fotoId]) => ({
    id: desejoId,
    label: desejoLabel,
    foto: photoUrl(fotoId),
    area: id,
  }));
  return { id, label, pergunta, capa: desejos[0].foto, desejos, passos };
}

export const areasDesejo: AreaDesejo[] = [
  area(
    "lugares",
    "Lugares",
    "Um lugar que você quer conhecer",
    [
      ["paris", "Conhecer Paris", "1502602898657-3e91760cbb34"],
      ["japao", "Ver as cerejeiras do Japão", "1493976040374-85c8e12f0c0e"],
      ["praia", "Uma praia paradisíaca", "1507525428034-b723cf961d3e"],
      ["santorini", "Pôr do sol em Santorini", "1570077188670-e3a8d69ac5ff"],
      ["aurora", "Ver a aurora boreal", "1483347756197-71ef80e95f73"],
      ["nova-york", "Viver Nova York", "1496442226666-8d4d0e62e6e9"],
      ["roma", "Caminhar por Roma", "1552832230-c0197dd311b5"],
      ["machu-picchu", "Subir Machu Picchu", "1526392060635-9d6019884377"],
    ],
    ["Escolher a época da viagem", "Montar o orçamento", "Separar um valor por mês"],
  ),
  area(
    "casa",
    "Casa e conquistas",
    "A casa e as conquistas que você quer",
    [
      ["casa-sonhos", "A casa dos meus sonhos", "1600585154340-be6161a56a0c"],
      ["casa-piscina", "Casa com piscina", "1564013799919-ab600027ffc6"],
      ["apartamento", "Meu apartamento", "1502672260266-1c1ef2d93688"],
      ["carro", "O carro dos meus sonhos", "1503376780353-7e6692767b70"],
      ["lar", "Um lar do meu jeito", "1586023492125-27b2c045efd7"],
      ["casa-moderna", "Uma casa moderna", "1600596542815-ffad4c1539a9"],
    ],
    ["Definir o valor da entrada", "Abrir uma reserva só para isso", "Pesquisar bairros"],
  ),
  area(
    "carreira",
    "Carreira",
    "Onde você quer chegar no trabalho",
    [
      ["negocio", "Abrir meu próprio negócio", "1509440159596-0249088772ff"],
      ["lideranca", "Um cargo de liderança", "1507679799987-c73779587ccf"],
      ["equipe", "Liderar uma equipe", "1521737604893-d14cc237f11d"],
      ["remoto", "Trabalhar de qualquer lugar", "1498050108023-c5249f4df085"],
      ["escritorio", "O escritório dos sonhos", "1497366754035-f200968a6e72"],
      ["empresa", "Ver minha empresa crescer", "1556761175-5973dc0f32e7"],
    ],
    ["Estudar o mercado", "Fazer um curso da área", "Conversar com quem já chegou lá"],
  ),
  area(
    "financas",
    "Finanças",
    "Como você quer a sua vida financeira",
    [
      ["liberdade", "Liberdade financeira", "1579621970563-ebec7560ff3e"],
      ["prosperidade", "Prosperidade", "1526304640581-d334cdbbf45e"],
      ["organizar", "Finanças organizadas", "1554224155-6726b3ff858f"],
      ["investir", "Investir na bolsa", "1611974789855-9c2a0a7236a3"],
    ],
    ["Mapear os gastos do mês", "Montar a reserva de emergência", "Definir um aporte mensal"],
  ),
  area(
    "saude",
    "Saúde",
    "Como você quer cuidar de você",
    [
      ["corpo", "Um corpo forte e saudável", "1571019613454-1cb2f99b2d8b"],
      ["alimentacao", "Comer bem todos os dias", "1490645935967-10de6ba17061"],
      ["ioga", "Praticar ioga", "1544367567-0f2fcb009e0b"],
      ["corrida", "Correr uma maratona", "1476480862126-209bfaa8edc8"],
      ["equilibrio", "Equilíbrio e leveza", "1545389336-cf090694435e"],
      ["natacao", "Nadar todas as semanas", "1530549387789-4c1017266635"],
    ],
    ["Beber 2 litros de água por dia", "Dormir 7 horas", "Treinar 3 vezes por semana"],
  ),
  area(
    "familia",
    "Família",
    "Um momento em família",
    [
      ["tempo-familia", "Mais tempo em família", "1511895426328-dc8714191300"],
      ["ferias", "Férias com a família", "1475503572774-15a45e5d60b9"],
      ["filhos", "Brincar com meus filhos", "1609220136736-443140cffec6"],
      ["bebe", "Ter um bebê", "1519689680058-324335c77eba"],
    ],
    ["Reservar um dia da semana para a família", "Planejar as próximas férias", "Desligar o celular no jantar"],
  ),
  area(
    "amor",
    "Amor",
    "O amor que você quer viver",
    [
      ["grande-amor", "Encontrar um grande amor", "1516589178581-6cd7833ae3b2"],
      ["casamento", "Meu casamento", "1519741497674-611481863552"],
      ["cerimonia", "Casar ao ar livre", "1522673607200-164d1b6ce486"],
      ["amizades", "Amizades verdadeiras", "1529156069898-49953e39b3ac"],
    ],
    ["Marcar um encontro por semana", "Sair da rotina juntos", "Dizer o que eu sinto"],
  ),
  area(
    "fe",
    "Fé",
    "Sua fé e seu propósito",
    [
      ["fe", "Viver a minha fé", "1507692049790-de58290a4334"],
      ["louvor", "Louvar em comunidade", "1438232992991-995b7058bbb3"],
      ["biblia", "Ler a Bíblia inteira", "1504052434569-70ad5836ab65"],
      ["paz", "Paz interior", "1490730141103-6cac27aaab94"],
      ["meditar", "Meditar todos os dias", "1506126613408-eca07ce68773"],
    ],
    ["Separar 10 minutos por dia", "Escolher um plano de leitura", "Anotar pelo que sou grato"],
  ),
  area(
    "estudos",
    "Estudos",
    "O que você quer aprender",
    [
      ["formatura", "Minha formatura", "1523240795612-9a054b0db644"],
      ["leitura", "Ler 24 livros por ano", "1481627834876-b7833e8f5570"],
      ["voltar-estudar", "Voltar a estudar", "1522202176988-66273c2fd55f"],
      ["livro", "Escrever meu próprio livro", "1456513080510-7bf3a84b82f8"],
    ],
    ["Escolher o curso", "Separar um horário fixo", "Começar pela primeira aula"],
  ),
  area(
    "lazer",
    "Lazer",
    "O que te faz feliz",
    [
      ["arte", "Pintar e criar", "1513364776144-60967b0f800f"],
      ["musica", "Tocar um instrumento", "1511379938547-c1f69419868d"],
      ["acampar", "Acampar na natureza", "1504280390367-361c6d9f38f4"],
      ["estrada", "Pegar a estrada", "1500530855697-b586d89ba3ee"],
      ["montanha", "Subir uma montanha", "1464822759023-fed622ff2c3b"],
    ],
    ["Reservar um horário só meu", "Comprar o que falta para começar", "Chamar alguém para ir junto"],
  ),
];

export function areaDesejoPorId(id: string) {
  return areasDesejo.find((item) => item.id === id);
}

/* ==========================================================================
   Criador de mural · a sequência de perguntas
   ========================================================================== */

/**
 * A primeira pergunta do mural é a da foto de destaque, a maior da colagem.
 * Ela mistura o desejo mais comum de seis áreas, para a pessoa começar pelo
 * sonho que mais pesa e não pela área que por acaso vem primeiro na lista.
 */
export const PERGUNTA_DESTAQUE = -1;

const destaques = ["lugares", "casa", "carreira", "familia", "amor", "saude"].map(
  (id) => areaDesejoPorId(id)!.desejos[0],
);

/** Quantas opções cada pergunta mostra: uma grade 2×2 cabe na tela do celular. */
const POR_PERGUNTA = 4;

export type Pergunta = {
  /** Índice em areasDesejo, ou PERGUNTA_DESTAQUE. */
  indice: number;
  titulo: string;
  dica: string;
  opcoes: Desejo[];
};

/**
 * A próxima pergunta a partir de `cursor`, pulando áreas que já não têm
 * desejo livre. Áreas se repetem em rodadas: um mural de 20 fotos passa duas
 * vezes por Lugares, e a segunda vez mostra os lugares que ficaram de fora.
 */
export function perguntaMural(cursor: number, usados: ReadonlySet<string>): Pergunta | null {
  if (cursor === PERGUNTA_DESTAQUE) {
    return {
      indice: PERGUNTA_DESTAQUE,
      titulo: "O que você mais quer atrair agora?",
      dica: "Essa vai ser a foto de destaque, a maior do seu mural.",
      opcoes: destaques.filter((desejo) => !usados.has(desejo.id)),
    };
  }

  for (let passo = 0; passo < areasDesejo.length; passo++) {
    const indice = (cursor + passo) % areasDesejo.length;
    const atual = areasDesejo[indice];
    const livres = atual.desejos.filter((desejo) => !usados.has(desejo.id));
    if (livres.length > 0) {
      return {
        indice,
        titulo: atual.pergunta,
        dica: `${atual.label} · toque em uma opção`,
        opcoes: livres.slice(0, POR_PERGUNTA),
      };
    }
  }

  return null;
}

/** Depois de responder (ou pular) a pergunta `indice`, a vez é da área seguinte. */
export function cursorDepois(indice: number) {
  return indice === PERGUNTA_DESTAQUE ? 0 : (indice + 1) % areasDesejo.length;
}

/** As frases que podem ir sobre o mural. A quebra de linha é a do mural. */
export const frasesMural = [
  "Disciplina hoje.\nResultados sempre.",
  "Sonhe. Planeje.\nConquiste.",
  "Eu mereço tudo\nque estou construindo.",
  "A sua vibração\natrai o que você vive.",
  "Tudo posso naquele\nque me fortalece.",
];

/* ==========================================================================
   Criador de objetivo · prazo e motivo
   ========================================================================== */

/** `meses: null` é o objetivo sem data, como "Vida saudável · Contínuo". */
export const prazos = [
  { id: "3m", label: "Em 3 meses", meses: 3 },
  { id: "6m", label: "Em 6 meses", meses: 6 },
  { id: "1a", label: "Em 1 ano", meses: 12 },
  { id: "2a", label: "Em 2 anos", meses: 24 },
  { id: "5a", label: "Em 5 anos", meses: 60 },
  { id: "continuo", label: "Sem prazo, é para a vida", meses: null },
] as const;

export type Prazo = (typeof prazos)[number];

/**
 * "Dez 2027", no mesmo formato dos objetivos que já existem.
 * Calculado na hora do toque, e não no render: a página é estática, e uma data
 * calculada no build divergiria da do navegador na hidratação.
 */
export function rotuloPrazo(prazo: Prazo, hoje = new Date()) {
  if (prazo.meses === null) return "Contínuo";
  const alvo = new Date(hoje.getFullYear(), hoje.getMonth() + prazo.meses, 1);
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(alvo)
    .replace(".", "");
  return `${mes.charAt(0).toUpperCase()}${mes.slice(1)} ${alvo.getFullYear()}`;
}

/** O "por que isso importa", já escrito como a frase que vai no objetivo. */
export const motivos = [
  "Para ter liberdade de escolher o meu tempo.",
  "Para dar o melhor à minha família.",
  "Porque é o que me faz feliz de verdade.",
  "Para viver com mais paz.",
  "Para provar a mim que eu consigo.",
  "Para ter saúde e energia para viver.",
];
