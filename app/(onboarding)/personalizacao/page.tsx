import Ambience from "@/components/Ambience";
import EscolhaAreas from "@/components/EscolhaAreas";
import StepDots from "@/components/StepDots";

export const metadata = { title: "Personalização" };

/**
 * Personalização (tela 5).
 *
 * A página fica no servidor para exportar `metadata`. A escolha de áreas e o
 * rodapé dependem da seleção e vão para o cliente (components/EscolhaAreas).
 */
export default function PersonalizacaoPage() {
  return (
    <main className="onboarding" data-ambience="horizon">
      <Ambience />

      <EscolhaAreas
        cabecalho={
          <>
            <StepDots total={5} current={3} />

            <h1 className="onboarding-title">
              O que mais importa
              <br />
              para você?
            </h1>
          </>
        }
      />
    </main>
  );
}
