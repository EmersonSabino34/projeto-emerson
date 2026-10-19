import { notFound } from "next/navigation";
import Ambience from "@/components/Ambience";
import PlayerJornada from "@/components/PlayerJornada";
import { moduloPorId, modulos } from "@/lib/jornadas";
import { resumoPorId } from "@/lib/jornadas/catalogo";

type Params = { params: Promise<{ modulo: string; dia: string }> };

/** O dia pelo número no arco de 31; um número fora dele dá 404. */
function encontrar(moduloId: string, dia: string) {
  const modulo = moduloPorId(moduloId);
  const conteudo = modulo?.dias.find((item) => String(item.dia) === dia);
  return modulo && conteudo ? { modulo, conteudo } : null;
}

export async function generateMetadata({ params }: Params) {
  const { modulo, dia } = await params;
  const achado = encontrar(modulo, dia);
  return { title: achado ? `${achado.conteudo.titulo} · ${achado.modulo.nome}` : "Jornada" };
}

/** Os 186 dias (6 jornadas × 31) saem prontos do build. */
export function generateStaticParams() {
  return modulos.flatMap((modulo) =>
    modulo.dias.map((dia) => ({ modulo: modulo.id, dia: String(dia.dia) })),
  );
}

export default async function DiaJornadaPage({ params }: Params) {
  const { modulo: moduloId, dia } = await params;
  const achado = encontrar(moduloId, dia);
  const resumo = resumoPorId(moduloId);
  if (!achado || !resumo) notFound();

  return (
    <main className="page" data-ambience={achado.modulo.ambience}>
      <Ambience />
      <PlayerJornada modulo={resumo} conteudo={achado.conteudo} />
    </main>
  );
}
