import Link from "next/link";
import Ambience from "@/components/Ambience";
import { VyraMark } from "@/components/VyraLogo";
import { scenery } from "@/lib/data";

export const metadata = { title: "Bem-vindo" };

/**
 * Boas-vindas (tela 2).
 *
 * A foto é o fundo da tela inteira, não um cartão: é a única tela do fluxo em
 * que a paisagem ocupa tudo, e é o que dá o impacto das referências.
 */
export default function BemVindoPage() {
  return (
    <main className="onboarding onboarding-cover" data-ambience="aurora">
      <Ambience />

      <div
        className="cover-photo"
        style={{ backgroundImage: `url(${scenery.mountains})` }}
        aria-hidden="true"
      />
      <div className="cover-shade" aria-hidden="true" />

      <div className="cover-content">
        <span className="brand-mark" aria-hidden="true">
          <VyraMark size={20} />
        </span>

        <h1 className="cover-title">
          Bem-vindo(a)
          <br />
          ao VYRA
        </h1>

        <p className="cover-lede">
          Onde os seus sonhos encontram um plano.
        </p>

        <div className="cover-actions">
          <Link href="/idioma" className="btn btn-primary btn-block">
            Começar
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/login" className="btn btn-ghost btn-block">
            Já tenho conta
          </Link>
        </div>

        <p className="cover-signature">Sonhe · Planeje · Vibre · Realize</p>
      </div>
    </main>
  );
}
