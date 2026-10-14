/**
 * Os planos do VYRA, exatamente como estão nas telas de referência.
 *
 * Os valores mensais aqui (€11,99 e €19,99) são os das imagens, que são a
 * versão mais recente da oferta — o briefing escrito ainda trazia €7 e €10.
 *
 * `anual` é o preço equivalente por mês na cobrança anual (dois meses de
 * desconto), e não o total do ano: é assim que a tela compara os dois ciclos
 * sem fazer a pessoa dividir de cabeça.
 */
export type Plano = {
  id: "plus" | "pro";
  nome: string;
  mensal: number;
  anual: number;
  resumo: string;
  destaque: boolean;
  recursos: string[];
};

export const planos: Plano[] = [
  {
    id: "plus",
    nome: "VYRA PLUS",
    mensal: 11.99,
    anual: 9.99,
    resumo: "Essencial para começar",
    destaque: false,
    recursos: [
      "Todos os pilares",
      "Layouts básicos",
      "Até 15 fotos no mural",
      "Frases e postagens",
      "Suporte por e-mail",
    ],
  },
  {
    id: "pro",
    nome: "VYRA PRO",
    mensal: 19.99,
    anual: 16.99,
    resumo: "Experiência completa",
    destaque: true,
    recursos: [
      "Todos os recursos",
      "Layouts premium",
      "Até 20 fotos no mural",
      "Plano de ação personalizado",
      "Sugestões com IA",
      "Novos conteúdos mensais",
    ],
  },
];

/** "€11,99" — formatação europeia, que é a moeda das telas. */
export function formatarEuro(valor: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(valor);
}
