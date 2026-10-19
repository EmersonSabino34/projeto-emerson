import { diasAmor } from "@/lib/jornadas/amor";
import { diasCarreira } from "@/lib/jornadas/carreira";
import { catalogo } from "@/lib/jornadas/catalogo";
import { diasFamilia } from "@/lib/jornadas/familia";
import { diasFe } from "@/lib/jornadas/fe";
import { diasProsperidade } from "@/lib/jornadas/prosperidade";
import { diasSaude } from "@/lib/jornadas/saude";
import type { DiaJornada, LinhaDia, ModuloResumo } from "@/lib/jornadas/tipos";

export type { Ambience, DiaJornada, ModuloResumo } from "@/lib/jornadas/tipos";

/**
 * Jornadas de atração.
 *
 * Cada jornada é um tema (amor, carreira, prosperidade...) com 31 dias de
 * texto guiado, todos no sentido daquele desejo e nenhum igual ao outro. A
 * pessoa escolhe quantos dias quer fazer; a voz do aparelho lê o texto do
 * dia, com uma trilha na frequência associada ao tema.
 *
 * Este arquivo carrega os 186 textos e é para o servidor. O cliente usa
 * lib/jornadas/catalogo.ts (nome e frequência) e lib/jornadas/roteiro.ts
 * (durações e o roteiro da voz), e recebe só o texto do dia que vai tocar.
 */

export type ModuloJornada = ModuloResumo & { dias: DiaJornada[] };

const textos: Record<string, LinhaDia[]> = {
  amor: diasAmor,
  carreira: diasCarreira,
  prosperidade: diasProsperidade,
  saude: diasSaude,
  familia: diasFamilia,
  fe: diasFe,
};

export const modulos: ModuloJornada[] = catalogo.map((resumo) => ({
  ...resumo,
  dias: textos[resumo.id].map(([titulo, texto, afirmacao], index) => ({
    dia: index + 1,
    titulo,
    texto,
    afirmacao,
  })),
}));

export function moduloPorId(id: string) {
  return modulos.find((modulo) => modulo.id === id);
}
