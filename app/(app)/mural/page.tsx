import Link from "next/link";
import Ambience from "@/components/Ambience";
import Collage from "@/components/Collage";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { IconArrowLeft, IconPlus } from "@/components/icons";
import { layoutById, murais, muralPhotos } from "@/lib/murais";

export const metadata = { title: "Mural dos Sonhos" };

export default function MuralPage() {
  return (
    /* Aurora: o mural é a tela mais visual do app, e a aurora é a atmosfera
       que a identidade reserva para a criação. */
    <main className="page" data-ambience="aurora">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Seu quadro dos sonhos"
          title="Meus Murais"
          action={
            <Link href="/inicio" className="icon-button" aria-label="Voltar para o início">
              <IconArrowLeft />
            </Link>
          }
        />

        <Link href="/mural/novo" className="btn btn-primary btn-block">
          <IconPlus />
          Novo mural
        </Link>
      </div>

      <Reveal>
        <div className="mural-list">
          {murais.map((mural) => {
            const layout = layoutById(mural.layoutId);
            if (!layout) return null;

            return (
              <article className="mural-card glass" key={mural.id}>
                <Collage
                  layout={layout}
                  photos={muralPhotos(mural)}
                  ratio="4 / 3"
                  className="collage-in-card"
                />
                <div className="mural-card-body">
                  <strong>{mural.title}</strong>
                  <span>{mural.subtitle}</span>
                  <div className="mural-card-actions">
                    <Link href={`/mural/${mural.id}/editar`} className="btn btn-ghost">
                      Editar
                    </Link>
                    <Link href={`/mural/${mural.id}/preview`} className="btn btn-primary">
                      Ver papel de parede
                      <span className="btn-arrow" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Reveal>
    </main>
  );
}
