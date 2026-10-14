import Link from "next/link";
import Ambience from "@/components/Ambience";
import ExplorarBusca from "@/components/ExplorarBusca";
import PageHeader from "@/components/PageHeader";
import { IconArrowLeft } from "@/components/icons";
import { categories } from "@/lib/data";
import { areaContent } from "@/lib/areas";

export const metadata = { title: "Explorar" };

/** Os destinos da aba "Lugares" saem do conteúdo da própria área, para não
    existir a mesma lista escrita em dois lugares. */
function lugares() {
  const block = areaContent.lugares.blocks.find((item) => item.kind === "places");
  return block?.kind === "places" ? block.items : [];
}

export default function ExplorarPage() {
  return (
    /* Horizonte: a tela de descobrir olha para longe. */
    <main className="page" data-ambience="horizon">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Descubra"
          title="Explorar"
          action={
            <Link href="/inicio" className="icon-button" aria-label="Voltar para o início">
              <IconArrowLeft />
            </Link>
          }
        />

        <p className="page-lede">
          Templates de mural, frases e destinos para alimentar os seus objetivos.
        </p>

        <ExplorarBusca categorias={categories} lugares={lugares()} />
      </div>
    </main>
  );
}
