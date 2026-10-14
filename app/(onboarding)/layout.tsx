/**
 * Shell do fluxo de entrada (telas 1 a 9).
 *
 * Não tem a navegação inferior do app nem o cabeçalho público: durante o
 * onboarding a pessoa só avança ou volta, e qualquer outro destino na tela
 * seria um convite a abandonar o fluxo.
 */
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <div className="onboarding-shell">{children}</div>;
}
