import Link from "next/link";
import Ambience from "@/components/Ambience";
import GoalFilter from "@/components/GoalFilter";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { IconArrowLeft } from "@/components/icons";
import { goals } from "@/lib/data";

export const metadata = { title: "Meus Objetivos" };

export default function ObjetivosPage() {
  return (
    /* Montanhas: a tela da escalada. */
    <main className="page" data-ambience="mountains">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Sua escalada"
          title="Meus Objetivos"
          action={
            <Link href="/inicio" className="icon-button" aria-label="Voltar para o início">
              <IconArrowLeft />
            </Link>
          }
        />

        <section className="section">
          <GoalFilter goals={goals} />
        </section>
      </div>

      <Reveal>
        <Link href="/objetivos/novo" className="btn btn-primary btn-block">
          Novo objetivo
          <span className="btn-arrow" aria-hidden="true">
            +
          </span>
        </Link>
      </Reveal>
    </main>
  );
}
