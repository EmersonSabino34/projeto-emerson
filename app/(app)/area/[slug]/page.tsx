import Link from "next/link";
import { notFound } from "next/navigation";
import Ambience from "@/components/Ambience";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { areas, findArea } from "@/components/AreaGrid";
import { IconArrowLeft } from "@/components/icons";
import { areaContentFor, type AreaBlock } from "@/lib/areas";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  return { title: findArea(slug)?.label ?? "Área" };
}

/** Só as áreas que têm tela própria — Objetivos, Frases e Mural têm rota
    dedicada e não passam por aqui. */
export function generateStaticParams() {
  return areas
    .filter((area) => areaContentFor(area.slug))
    .map((area) => ({ slug: area.slug }));
}

/** Cada `kind` do conteúdo tem o seu desenho; é o que mantém Vibração,
    Mentalizar e Lugares parecidas com as telas de referência. */
function Block({ block }: { block: AreaBlock }) {
  switch (block.kind) {
    case "moods":
      return (
        <div className="mood-grid">
          {block.items.map((item) => (
            <button type="button" className="mood-tile" key={item.label}>
              <span className="mood-glyph" aria-hidden="true">
                {item.glyph}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      );

    case "sessions":
      return (
        <div className="session-grid">
          {block.items.map((item) => (
            <button
              type="button"
              className="session-card"
              key={item.label}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <span className="session-card-copy">
                <strong>{item.label}</strong>
                <span>{item.minutes} min</span>
              </span>
            </button>
          ))}
        </div>
      );

    case "habits":
      return (
        <div className="mood-grid">
          {block.items.map((item) => (
            <div className="mood-tile" key={item.label}>
              <span className="mood-glyph" aria-hidden="true">
                {item.glyph}
              </span>
              <span>{item.label}</span>
              <strong className="mood-value">{item.value}</strong>
            </div>
          ))}
        </div>
      );

    case "list":
      return (
        <div className="choice-list">
          {block.items.map((item) => (
            <button type="button" className="choice-row" key={item}>
              <span className="choice-label">{item}</span>
              <span className="choice-chevron" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
      );

    case "verse":
      return (
        <div className="glass glass-pad">
          <blockquote className="verse-text">&ldquo;{block.text}&rdquo;</blockquote>
          <cite className="verse-source">— {block.source}</cite>
          <div className="fact-list" style={{ marginTop: "var(--sp-5)" }}>
            <div className="fact-row">
              <span>Plano de leitura</span>
              <strong>{block.plan}</strong>
            </div>
          </div>
        </div>
      );

    case "places":
      return (
        <div className="place-grid">
          {block.items.map((item) => (
            <button
              type="button"
              className="place-card"
              key={item.label}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <span className="place-card-copy">
                <strong>{item.label}</strong>
                <span>{item.note}</span>
              </span>
            </button>
          ))}
        </div>
      );
  }
}

export default async function AreaPage({ params }: Params) {
  const { slug } = await params;
  const area = findArea(slug);
  const content = areaContentFor(slug);

  if (!area || !content) notFound();

  return (
    /* A ambientação vem da própria área: Lugares abre no amanhecer,
       Mentalizar no céu estrelado, Vibração na aurora. */
    <main className="page" data-ambience={area.ambience}>
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Sua área"
          title={area.label}
          action={
            <Link href="/inicio" className="icon-button" aria-label="Voltar para o início">
              <IconArrowLeft />
            </Link>
          }
        />

        <p className="page-lede">{area.lede}</p>

        {/* A paisagem da área já é o cenário de fundo (data-ambience), então
            aqui entra só o vidro com a frase. */}
        <section className="quote-panel section">
          <blockquote>&ldquo;{content.quote.text}&rdquo;</blockquote>
          <cite>— {content.quote.author}</cite>
        </section>
      </div>

      {content.blocks.map((block, index) => (
        <Reveal key={block.title} delay={index * 80}>
          <section className="section">
            <SectionTitle eyebrow={area.label} title={block.title} />
            <Block block={block} />
          </section>
        </Reveal>
      ))}
    </main>
  );
}
