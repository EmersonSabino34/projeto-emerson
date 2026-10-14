import Link from "next/link";
import Ambience from "@/components/Ambience";
import { IconCheck } from "@/components/icons";

export const metadata = { title: "Tudo pronto" };

/** Confirmação (tela 8). */
export default function ProntoPage() {
  return (
    <main className="onboarding onboarding-center" data-ambience="aurora">
      <Ambience />

      <div className="stagger" style={{ textAlign: "center" }}>
        <span className="success-ring" aria-hidden="true">
          <IconCheck />
        </span>

        <h1 className="onboarding-title">Tudo pronto!</h1>

        <p className="onboarding-lede" style={{ marginInline: "auto" }}>
          Bem-vindo(a) ao VYRA. Agora é real: você está mais perto da vida que
          deseja.
        </p>

        <blockquote className="pronto-quote">
          &ldquo;Sonhe. Planeje. Vibre. Realize.&rdquo;
        </blockquote>

        <Link href="/tutorial" className="btn btn-primary btn-block">
          Explorar o app
          <span className="btn-arrow" aria-hidden="true">
            →
          </span>
        </Link>

        <p className="onboarding-signature">Disciplina hoje · Resultados sempre</p>
      </div>
    </main>
  );
}
