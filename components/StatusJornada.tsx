"use client";

import { resumoDoProgresso, useJornadas } from "@/lib/jornadas/progresso";

/**
 * O andamento de uma jornada na lista: "Dia 3 de 31", "Concluída" ou as
 * durações possíveis, para quem ainda não começou. Vem depois da frequência,
 * já com o separador.
 */
export default function StatusJornada({ moduloId }: { moduloId: string }) {
  const { mapa, carregando } = useJornadas();

  if (carregando) return null;

  const progresso = mapa[moduloId];
  if (!progresso) return <> · 7, 21 ou 31 dias</>;

  const resumo = resumoDoProgresso(progresso);
  if (resumo.concluida) return <strong> · Concluída</strong>;

  return (
    <strong>
      {" "}
      · Dia {resumo.proxima ?? resumo.liberadas} de {progresso.total}
    </strong>
  );
}
