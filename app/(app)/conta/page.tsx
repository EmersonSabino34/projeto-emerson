import Link from "next/link";
import Ambience from "@/components/Ambience";
import PageHeader from "@/components/PageHeader";
import PainelConta from "@/components/PainelConta";
import { IconArrowLeft } from "@/components/icons";

export const metadata = { title: "Minha conta" };

/**
 * Painel da conta: ver, editar e excluir o próprio cadastro.
 * A tela inteira depende da sessão, que só existe no cliente
 * (components/PainelConta).
 */
export default function ContaPage() {
  return (
    <main className="page" data-ambience="horizon">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Painel"
          title="Minha conta"
          action={
            <Link href="/perfil" className="icon-button" aria-label="Voltar para o perfil">
              <IconArrowLeft />
            </Link>
          }
        />
      </div>

      <PainelConta />
    </main>
  );
}
