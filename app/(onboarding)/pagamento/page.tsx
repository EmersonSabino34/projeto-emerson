import Ambience from "@/components/Ambience";
import MetodosPagamento from "@/components/MetodosPagamento";
import StepDots from "@/components/StepDots";
import { formatarEuro, planos } from "@/lib/planos";

export const metadata = { title: "Pagamento" };

type Props = {
  searchParams: Promise<{ plano?: string; ciclo?: string }>;
};

/**
 * Pagamento (tela 7).
 *
 * A tela só escolhe a forma de pagamento — igual à referência. Os dados do
 * cartão não são pedidos aqui: quem coleta isso é o provedor (Stripe, Apple
 * Pay, Google Pay), na folha dele. É a decisão certa também por segurança:
 * número de cartão que não passa pelo nosso front-end é número de cartão que
 * não temos como vazar.
 */
export default async function PagamentoPage({ searchParams }: Props) {
  const { plano: planoId, ciclo } = await searchParams;

  const plano = planos.find((item) => item.id === planoId) ?? planos[1];
  const anual = ciclo === "anual";
  const preco = anual ? plano.anual : plano.mensal;

  return (
    <main className="onboarding" data-ambience="stars">
      <Ambience />

      <div className="onboarding-body stagger">
        <StepDots total={5} current={5} />

        <h1 className="onboarding-title">Pagamento seguro</h1>
        <p className="onboarding-lede">Escolha a forma de pagamento.</p>

        <div className="glass glass-pad order-summary">
          <div className="fact-row" style={{ border: 0, background: "none", padding: 0 }}>
            <span>{plano.nome}</span>
            <strong>
              {formatarEuro(preco)}
              <small>/mês</small>
            </strong>
          </div>
          <p className="muted-copy" style={{ marginTop: "var(--sp-2)" }}>
            {anual ? "Cobrado anualmente, com desconto." : "Cobrado todo mês. Cancele quando quiser."}
          </p>
        </div>

        <MetodosPagamento />
      </div>
    </main>
  );
}
