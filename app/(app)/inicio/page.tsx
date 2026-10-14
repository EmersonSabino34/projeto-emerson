import Link from "next/link";
import Ambience from "@/components/Ambience";
import AreaGrid from "@/components/AreaGrid";
import DataDeHoje from "@/components/DataDeHoje";
import PeriodTabs from "@/components/PeriodTabs";
import ProgressRing from "@/components/ProgressRing";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { AvatarSessao, SaudacaoSessao } from "@/components/SessaoUI";
import { IconBell } from "@/components/icons";
import { goalProgress, goals, quoteOfTheDay } from "@/lib/data";

export const metadata = { title: "Início" };

/**
 * A página é estática, e sem isto a frase do dia ficava congelada no dia do
 * build. Uma hora é o atraso máximo para a frase virar depois da meia-noite
 * UTC. A data do cabeçalho não depende disto: <DataDeHoje /> formata no
 * navegador, no fuso de quem está vendo.
 */
export const revalidate = 3600;

/** Só o que ainda está em andamento conta como ativo. */
const objetivosAtivos = goals.filter((goal) => goal.status === "andamento").length;

export default function HomePage() {
  const quote = quoteOfTheDay();

  return (
    /* A Home abre no nascer do sol: é a tela que a pessoa vê todo dia, e o
       amanhecer é o que a identidade do VYRA promete de manhã. */
    <main className="page page-split" data-ambience="sunrise">
      <Ambience />

      <div>
        <div className="stagger">
          <header className="greet">
            <AvatarSessao />
            <div className="greet-copy">
              <DataDeHoje className="eyebrow" />
              <strong>
                <SaudacaoSessao />
              </strong>
              <span>Que bom te ver aqui ✨</span>
            </div>
            <button type="button" className="icon-button" aria-label="Notificações">
              <IconBell />
            </button>
          </header>

          <div className="section">
            <PeriodTabs />
          </div>

          {/* Sem foto própria: a paisagem desta tela é o cenário de fundo,
              e um cartão com imagem aqui seria foto sobre foto. */}
          <section className="quote-panel">
            <blockquote>&ldquo;{quote.text}&rdquo;</blockquote>
            <cite>— {quote.author}</cite>
          </section>
        </div>

        <Reveal>
          <section className="section">
            <SectionTitle
              eyebrow="Seu universo"
              title="Áreas da sua vida"
              action={
                <Link href="/explorar" className="text-link">
                  Explorar <span aria-hidden="true">→</span>
                </Link>
              }
            />
            <AreaGrid />
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="section">
            <SectionTitle
              eyebrow="Em movimento"
              title="Meus objetivos"
              action={
                <Link href="/objetivos" className="text-link">
                  Ver todos <span aria-hidden="true">→</span>
                </Link>
              }
            />
            <div className="goal-list">
              {goals.slice(0, 3).map((goal) => (
                <Link href={`/objetivos/${goal.id}`} key={goal.id} className="goal-row">
                  <span
                    className="goal-thumb"
                    style={{ backgroundImage: `url(${goal.image})` }}
                    aria-hidden="true"
                  />
                  <span className="goal-body">
                    <strong>{goal.title}</strong>
                    <span className="muted-copy" style={{ marginTop: 2 }}>
                      {goal.category} · {goal.deadline}
                    </span>
                  </span>
                  <span className="goal-percent">{goal.progress}%</span>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      {/* Vira coluna lateral fixa a partir de 1320px; abaixo disso, segue o
          fluxo normal no fim da página. */}
      <aside className="page-aside">
        <Reveal delay={120}>
          <section className="glass glass-pad">
            <p className="eyebrow">Meu progresso</p>
            <ProgressRing
              value={goalProgress}
              label={`Progresso médio dos objetivos: ${goalProgress}%`}
            />
            <p className="muted-copy" style={{ textAlign: "center" }}>
              Você está mais perto do seu sonho.
            </p>
          </section>
        </Reveal>

        <Reveal delay={160}>
          <div className="glass glass-pad">
            <p className="eyebrow">Resumo</p>
            <div className="fact-list" style={{ marginTop: "var(--sp-3)" }}>
              <div className="fact-row">
                <span>Objetivos ativos</span>
                <strong>{objetivosAtivos}</strong>
              </div>
              <div className="fact-row">
                <span>Progresso médio</span>
                <strong>{goalProgress}%</strong>
              </div>
              <div className="fact-row">
                <span>Meta mais próxima</span>
                <strong>{goals[1].deadline}</strong>
              </div>
            </div>
          </div>
        </Reveal>
      </aside>
    </main>
  );
}
