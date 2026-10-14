import Link from "next/link";
import { notFound } from "next/navigation";
import Ambience from "@/components/Ambience";
import MuralEditor from "@/components/MuralEditor";
import PageHeader from "@/components/PageHeader";
import { IconArrowLeft } from "@/components/icons";
import {
  edicaoDaQuery,
  edicaoParaQuery,
  layoutById,
  muralById,
  muralPhotos,
  type QueryEdicao,
} from "@/lib/murais";

type Props = {
  params: Promise<{ id: string }>;
  /**
   * `?layout=` chega da tela de escolha de layout; layout, legenda, filtro e
   * giro voltam da pré-visualização, para o editor reabrir como estava.
   */
  searchParams: Promise<QueryEdicao>;
};

export const metadata = { title: "Editar mural" };

export default async function EditarMuralPage({ params, searchParams }: Props) {
  const { id } = await params;

  const mural = muralById(id);
  if (!mural) notFound();

  // O layout da URL ganha do layout salvo: é a escolha que a pessoa acabou de
  // fazer na tela anterior. Um valor inválido cai no layout do próprio mural.
  const edicao = edicaoDaQuery(mural, await searchParams);
  const layout = layoutById(edicao.layoutId);
  if (!layout) notFound();

  return (
    <main className="page" data-ambience="aurora">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Passo 2 de 2"
          title="Editar mural"
          action={
            <Link href="/mural" className="icon-button" aria-label="Voltar para os murais">
              <IconArrowLeft />
            </Link>
          }
        />

        <MuralEditor
          // A chave muda com a URL, então o editor recomeça do estado que
          // chegou nela em vez de manter o de uma edição anterior.
          key={edicaoParaQuery(edicao)}
          muralId={mural.id}
          initialLayout={layout}
          photos={muralPhotos(mural)}
          initialCaption={edicao.legenda}
          initialFilterId={edicao.filtroId}
          initialOffset={edicao.giro}
        />
      </div>
    </main>
  );
}
