import Link from "next/link";
import Ambience from "@/components/Ambience";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import VyraLogo from "@/components/VyraLogo";
import { IconArrowLeft } from "@/components/icons";

export const metadata = { title: "Sobre o VYRA" };

/** Sobre o VYRA (tela 32). */
export default function SobrePage() {
  return (
    /* Aurora: a tela da marca é a mais atmosférica do app. */
    <main className="page" data-ambience="aurora">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="A marca"
          title="Sobre o VYRA"
          action={
            <Link href="/perfil" className="icon-button" aria-label="Voltar para o perfil">
              <IconArrowLeft />
            </Link>
          }
        />

        <section className="sobre-card glass glass-pad">
          <VyraLogo className="vyra-logo-stacked" />

          <p className="sobre-claim">
            Mais que um app.
            <br />
            Um novo você.
          </p>

          <p className="muted-copy">Versão 1.0.0</p>
        </section>
      </div>

      <Reveal>
        <section className="section">
          <p className="page-lede" style={{ marginTop: 0 }}>
            O VYRA existe para transformar o que você deseja em algo que você
            consegue executar: sonho vira objetivo, objetivo vira plano de ação, e
            o plano vira um mural que você vê todos os dias.
          </p>
          <p className="muted-copy">
            Visualizar ajuda a manter a direção — mas quem realiza é a ação. O VYRA
            cuida das duas pontas, e não promete que pensar baste.
          </p>
        </section>
      </Reveal>

      <Reveal delay={80}>
        <p className="onboarding-signature">Sonhe mais · Viva melhor</p>
      </Reveal>
    </main>
  );
}
