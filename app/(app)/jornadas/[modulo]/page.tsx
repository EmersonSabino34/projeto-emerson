import Link from "next/link";
import { notFound } from "next/navigation";
import Ambience from "@/components/Ambience";
import JornadaModulo from "@/components/JornadaModulo";
import PageHeader from "@/components/PageHeader";
import { IconArrowLeft } from "@/components/icons";
import { moduloPorId, modulos } from "@/lib/jornadas";
import { resumoPorId } from "@/lib/jornadas/catalogo";

type Params = { params: Promise<{ modulo: string }> };

export async function generateMetadata({ params }: Params) {
  const { modulo } = await params;
  return { title: resumoPorId(modulo)?.titulo ?? "Jornada" };
}

export function generateStaticParams() {
  return modulos.map((modulo) => ({ modulo: modulo.id }));
}

export default async function JornadaPage({ params }: Params) {
  const { modulo: id } = await params;
  const modulo = moduloPorId(id);
  const resumo = resumoPorId(id);
  if (!modulo || !resumo) notFound();

  return (
    <main className="page" data-ambience={modulo.ambience}>
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow={`Jornada de ${modulo.nome.toLowerCase()}`}
          title={modulo.titulo}
          action={
            <Link href="/jornadas" className="icon-button" aria-label="Voltar para as jornadas">
              <IconArrowLeft />
            </Link>
          }
        />
      </div>

      {/* O cliente recebe só os títulos dos dias; o texto de cada um vem na
          página do dia, quando ele for tocar. */}
      <JornadaModulo modulo={resumo} titulos={modulo.dias.map((dia) => dia.titulo)} />
    </main>
  );
}
