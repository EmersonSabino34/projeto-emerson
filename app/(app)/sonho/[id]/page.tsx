import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import Reveal from "@/components/Reveal";
import { dreams } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  return { title: dreams.find((item) => item.id === id)?.title ?? "Sonho" };
}

/** Pré-renderiza os sonhos conhecidos; os demais caem no notFound. */
export function generateStaticParams() {
  return dreams.map((dream) => ({ id: dream.id }));
}

export default async function DreamPage({ params }: Params) {
  const { id } = await params;
  const dream = dreams.find((item) => item.id === id);

  // Id inventado dá 404, como em /objetivos/[id] — antes abria o primeiro
  // sonho da lista como se fosse o pedido.
  if (!dream) notFound();

  return (
    <main className="page">
      <div className="stagger">
        <PageHeader
          eyebrow="Detalhes do sonho"
          title={dream.title}
          action={
            <Link href="/inicio" className="icon-button" aria-label="Voltar para o mural">
              ×
            </Link>
          }
        />

        <section className="detail-hero">
          {/* eslint-disable-next-line @next/next/no-img-element -- fotos externas do Unsplash */}
          <img src={dream.image} alt={dream.title} />
          <button className="detail-hero-fav" type="button" aria-label="Favoritar sonho">
            ♡
          </button>
        </section>

        <div className="dream-detail-title">
          <div>
            <p className="eyebrow">{dream.category}</p>
            <h2>{dream.title}</h2>
          </div>
          <strong>{dream.progress}%</strong>
        </div>
      </div>

      <ProgressBar value={dream.progress} delay={380} />

      <Reveal>
        <div className="goal-grid">
          <div>
            <span>Data desejada</span>
            <b>2027</b>
          </div>
          <div>
            <span>Meta financeira</span>
            <b>{dream.target}</b>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <button className="btn btn-primary btn-block" type="button">
          Atualizar progresso
          <span className="btn-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </Reveal>
    </main>
  );
}
