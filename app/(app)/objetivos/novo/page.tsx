import Link from "next/link";
import Ambience from "@/components/Ambience";
import FormularioObjetivo from "@/components/FormularioObjetivo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { IconArrowLeft } from "@/components/icons";

export const metadata = { title: "Novo objetivo" };

/**
 * Novo objetivo (tela 12 das referências).
 *
 * A página fica no servidor para exportar `metadata`; só o formulário, que
 * tem estado, vai para o cliente (components/FormularioObjetivo).
 */
export default function NovoObjetivoPage() {
  return (
    /* Céu estrelado: é a tela de imaginar, não a de executar. */
    <main className="page" data-ambience="stars">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Comece por aqui"
          title="Qual é o seu objetivo?"
          action={
            <Link href="/objetivos" className="icon-button" aria-label="Voltar para os objetivos">
              <IconArrowLeft />
            </Link>
          }
        />

        <FormularioObjetivo />
      </div>

      <Reveal>
        <p className="muted-copy">
          Depois de criar, o VYRA ajuda a quebrar o objetivo em etapas no Plano de Ação.
        </p>
      </Reveal>
    </main>
  );
}
