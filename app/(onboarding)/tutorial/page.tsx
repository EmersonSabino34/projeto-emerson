import Link from "next/link";
import Ambience from "@/components/Ambience";
import { IconCheck } from "@/components/icons";
import { scenery } from "@/lib/data";
import { photoBank } from "@/lib/murais";

export const metadata = { title: "Conheça o VYRA" };

/** Os quatro pontos do tutorial (tela 9). */
const pontos = [
  "Defina os seus objetivos",
  "Crie o seu mural dos sonhos",
  "Acompanhe a sua evolução",
  "Visualize, planeje e realize",
];

/**
 * Tutorial (tela 9).
 *
 * As três fotos em leque são decorativas e ficam fora da árvore de
 * acessibilidade: quem usa leitor de tela ouve os quatro pontos, que é onde
 * está a informação de verdade.
 */
export default function TutorialPage() {
  return (
    <main className="onboarding" data-ambience="sunrise">
      <Ambience />

      <div className="onboarding-body stagger">
        <div className="fan" aria-hidden="true">
          <span style={{ backgroundImage: `url(${photoBank[1]})` }} />
          <span style={{ backgroundImage: `url(${scenery.mountains})` }} />
          <span style={{ backgroundImage: `url(${photoBank[4]})` }} />
        </div>

        <h1 className="onboarding-title">
          Descubra um app completo
          <br />
          para a sua evolução
        </h1>

        <ul className="tutorial-list">
          {pontos.map((ponto) => (
            <li key={ponto}>
              <span className="tutorial-check" aria-hidden="true">
                <IconCheck />
              </span>
              {ponto}
            </li>
          ))}
        </ul>
      </div>

      <div className="onboarding-foot">
        <Link href="/inicio" className="btn btn-primary btn-block">
          Vamos lá!
          <span className="btn-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </main>
  );
}
