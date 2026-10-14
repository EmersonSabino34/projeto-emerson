import Link from "next/link";
import Ambience from "@/components/Ambience";
import ConquistaFiltro from "@/components/ConquistaFiltro";
import PageHeader from "@/components/PageHeader";
import { IconArrowLeft } from "@/components/icons";
import { conquistas } from "@/lib/conquistas";

export const metadata = { title: "Minhas Conquistas" };

export default function ConquistasPage() {
  return (
    /* Nascer do sol: a tela de celebrar. */
    <main className="page" data-ambience="sunrise">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Sua evolução"
          title="Minhas Conquistas"
          action={
            <Link href="/perfil" className="icon-button" aria-label="Voltar para o perfil">
              <IconArrowLeft />
            </Link>
          }
        />

        <ConquistaFiltro conquistas={conquistas} />
      </div>
    </main>
  );
}
