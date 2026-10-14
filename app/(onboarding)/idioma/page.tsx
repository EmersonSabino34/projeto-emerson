import Link from "next/link";
import Ambience from "@/components/Ambience";
import EscolhaIdioma from "@/components/EscolhaIdioma";
import StepDots from "@/components/StepDots";

export const metadata = { title: "Idioma" };

/**
 * Escolher idioma (tela 3).
 *
 * A página fica no servidor para exportar `metadata`; só a lista de idiomas,
 * que marca a opção escolhida, vai para o cliente (components/EscolhaIdioma).
 * O botão só navega, por isso é um Link, como no rodapé do tutorial.
 */
export default function IdiomaPage() {
  return (
    <main className="onboarding" data-ambience="sunrise">
      <Ambience />

      <div className="onboarding-body stagger">
        <StepDots total={5} current={1} />

        <h1 className="onboarding-title">
          Choose
          <br />
          your language
        </h1>

        <EscolhaIdioma />

        <p className="onboarding-signature">A better you · A brighter world</p>
      </div>

      <div className="onboarding-foot">
        <Link href="/cadastro" className="btn btn-primary btn-block">
          Continuar
          <span className="btn-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </main>
  );
}
