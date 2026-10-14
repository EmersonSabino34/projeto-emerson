import Link from "next/link";
import Ambience from "@/components/Ambience";
import FraseGaleria from "@/components/FraseGaleria";
import PageHeader from "@/components/PageHeader";
import { IconArrowLeft } from "@/components/icons";
import { frasesArte } from "@/lib/frases";

export const metadata = { title: "Frases e Fotos" };

/** Frases e Fotos (tela 22). */
export default function FrasesPage() {
  return (
    <main className="page" data-ambience="horizon">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Seu espaço criativo"
          title="Frases e Fotos"
          action={
            <Link href="/inicio" className="icon-button" aria-label="Voltar para o início">
              <IconArrowLeft />
            </Link>
          }
        />

        <FraseGaleria frases={frasesArte} />
      </div>
    </main>
  );
}
