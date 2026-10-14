import Link from "next/link";
import Ambience from "@/components/Ambience";
import EscolhaLayout from "@/components/EscolhaLayout";
import PageHeader from "@/components/PageHeader";
import { IconArrowLeft } from "@/components/icons";

export const metadata = { title: "Novo mural" };

/**
 * Escolher o layout do mural (tela 25).
 *
 * A página fica no servidor para exportar `metadata`; a escolha de layout,
 * que tem estado, vai para o cliente (components/EscolhaLayout).
 */
export default function NovoMuralPage() {
  return (
    <main className="page" data-ambience="aurora">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Passo 1 de 2"
          title="Escolha um layout"
          action={
            <Link href="/mural" className="icon-button" aria-label="Voltar para os murais">
              <IconArrowLeft />
            </Link>
          }
        />

        <p className="page-lede">
          De 10 a 20 fotos. O VYRA enquadra cada imagem para caber na grade sem
          cortar o que importa.
        </p>
      </div>

      <EscolhaLayout />
    </main>
  );
}
