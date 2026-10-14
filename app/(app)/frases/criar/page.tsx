import Link from "next/link";
import Ambience from "@/components/Ambience";
import CriadorPost from "@/components/CriadorPost";
import PageHeader from "@/components/PageHeader";
import { IconArrowLeft } from "@/components/icons";
import { fraseArtePorId, frasesArte } from "@/lib/frases";

export const metadata = { title: "Criador de Posts" };

type Props = { searchParams: Promise<{ frase?: string }> };

/** Criador de Posts (tela 23). */
export default async function CriarPostPage({ searchParams }: Props) {
  const { frase: fraseId } = await searchParams;
  const frase = (fraseId ? fraseArtePorId(fraseId) : undefined) ?? frasesArte[0];

  return (
    <main className="page" data-ambience="horizon">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Sua arte"
          title="Criador de Posts"
          action={
            <Link href="/frases" className="icon-button" aria-label="Voltar para as frases">
              <IconArrowLeft />
            </Link>
          }
        />

        <CriadorPost frase={frase} />
      </div>
    </main>
  );
}
