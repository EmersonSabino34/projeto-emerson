import Link from "next/link";
import { notFound } from "next/navigation";
import Ambience from "@/components/Ambience";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import WallpaperPreview from "@/components/WallpaperPreview";
import { IconArrowLeft } from "@/components/icons";
import {
  edicaoDaQuery,
  edicaoParaQuery,
  filtroMuralPorId,
  girarFotos,
  layoutById,
  muralById,
  muralPhotos,
  type QueryEdicao,
} from "@/lib/murais";

type Props = {
  params: Promise<{ id: string }>;
  /** O que a pessoa fez no editor: layout, legenda, filtro e giro das fotos. */
  searchParams: Promise<QueryEdicao>;
};

export const metadata = { title: "Papel de parede" };

export default async function PreviewMuralPage({ params, searchParams }: Props) {
  const { id } = await params;

  const mural = muralById(id);
  if (!mural) notFound();

  const edicao = edicaoDaQuery(mural, await searchParams);
  const layout = layoutById(edicao.layoutId);
  if (!layout) notFound();

  return (
    /* Céu estrelado: a tela de ver o resultado é a mais contemplativa do fluxo. */
    <main className="page" data-ambience="stars">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Pré-visualização"
          title={mural.title}
          action={
            // Volta com a edição na URL, para o editor reabrir como estava.
            <Link
              href={`/mural/${mural.id}/editar?${edicaoParaQuery(edicao)}`}
              className="icon-button"
              aria-label="Voltar para o editor"
            >
              <IconArrowLeft />
            </Link>
          }
        />

        <WallpaperPreview
          layout={layout}
          photos={girarFotos(muralPhotos(mural), edicao.giro)}
          caption={edicao.legenda}
          filtro={filtroMuralPorId(edicao.filtroId).css}
        />
      </div>

      <Reveal>
        <button type="button" className="btn btn-primary btn-block">
          Definir como papel de parede
          <span className="btn-arrow" aria-hidden="true">
            →
          </span>
        </button>
        <p className="muted-copy" style={{ textAlign: "center" }}>
          O VYRA salva a imagem na sua galeria; o papel de parede você aplica pelo
          próprio aparelho.
        </p>
      </Reveal>
    </main>
  );
}
