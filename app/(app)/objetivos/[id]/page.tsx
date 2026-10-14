import Link from "next/link";
import { notFound } from "next/navigation";
import Ambience from "@/components/Ambience";
import Checklist, { EtapasContador, PlanoProvider } from "@/components/Checklist";
import PageHeader from "@/components/PageHeader";
import ProgressRing from "@/components/ProgressRing";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { IconArrowLeft, IconCheck, IconTarget } from "@/components/icons";
import { actionPlanFor, goals } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const goal = goals.find((item) => item.id === id);
  return { title: goal?.title ?? "Objetivo" };
}

/** Pré-renderiza os objetivos conhecidos; os demais caem no notFound. */
export function generateStaticParams() {
  return goals.map((goal) => ({ id: goal.id }));
}

export default async function ObjetivoPage({ params }: Params) {
  const { id } = await params;
  const goal = goals.find((item) => item.id === id);

  // Um id inventado na URL tem de dar 404, não abrir o primeiro objetivo da
  // lista como se fosse o pedido.
  if (!goal) notFound();

  const plan = actionPlanFor(goal.id);

  return (
    // O estado das etapas fica acima da <main> porque a contagem aparece em
    // dois lugares: no cabeçalho da seção e na coluna lateral.
    <PlanoProvider steps={plan.steps} initialDone={plan.done}>
      {/* Montanhas de novo: é a mesma jornada da lista de objetivos. */}
      <main className="page page-split" data-ambience="mountains">
        <Ambience />

        <div>
          <div className="stagger">
            <PageHeader
              eyebrow="Plano de ação"
              title={goal.title}
              action={
                <Link
                  href="/objetivos"
                  className="icon-button"
                  aria-label="Voltar para os objetivos"
                >
                  <IconArrowLeft />
                </Link>
              }
            />

            <section
              className="quote-hero"
              style={{ backgroundImage: `url(${goal.image})` }}
            >
              <div className="quote-hero-copy">
                <blockquote>&ldquo;{goal.why}&rdquo;</blockquote>
                <cite>
                  {goal.category} · meta para {goal.deadline}
                </cite>
              </div>
            </section>
          </div>

          <Reveal>
            <section className="section">
              <SectionTitle
                eyebrow="Um passo de cada vez"
                title="Etapas"
                action={
                  <strong>
                    <EtapasContador />
                  </strong>
                }
              />
              <Checklist />
            </section>
          </Reveal>

          <Reveal delay={80}>
            <button type="button" className="btn btn-ghost btn-block">
              Adicionar etapa
              <span className="btn-arrow" aria-hidden="true">
                +
              </span>
            </button>
          </Reveal>
        </div>

        <aside className="page-aside">
          <Reveal delay={120}>
            <section className="glass glass-pad">
              <p className="eyebrow">Meu progresso</p>
              <ProgressRing
                value={goal.progress}
                label={`Progresso de ${goal.title}: ${goal.progress}%`}
              />
              <p className="muted-copy" style={{ textAlign: "center" }}>
                Você está mais perto do seu sonho.
              </p>

              <div className="fact-list" style={{ marginTop: "var(--sp-5)" }}>
                <div className="fact-row">
                  <span className="choice-icon" aria-hidden="true">
                    <IconCheck />
                  </span>
                  <span>Etapas concluídas</span>
                  <strong>
                    <EtapasContador />
                  </strong>
                </div>
                <div className="fact-row">
                  <span className="choice-icon" aria-hidden="true">
                    <IconTarget />
                  </span>
                  <span>Meta final</span>
                  <strong>{goal.deadline}</strong>
                </div>
              </div>
            </section>
          </Reveal>
        </aside>
      </main>
    </PlanoProvider>
  );
}
