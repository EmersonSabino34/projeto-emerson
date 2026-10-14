import Ambience from "@/components/Ambience";
import EscolhaPlano from "@/components/EscolhaPlano";
import StepDots from "@/components/StepDots";

export const metadata = { title: "Planos" };

/**
 * Escolher plano (tela 6).
 *
 * A página fica no servidor para exportar `metadata`. O seletor de ciclo, os
 * cartões e o botão dependem da escolha e vão para o cliente
 * (components/EscolhaPlano).
 */
export default function PlanosPage() {
  return (
    <main className="onboarding" data-ambience="mountains">
      <Ambience />

      <EscolhaPlano
        cabecalho={
          <>
            <StepDots total={5} current={4} />

            <h1 className="onboarding-title">Escolha o seu plano</h1>
          </>
        }
      />
    </main>
  );
}
