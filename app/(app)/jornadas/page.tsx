import Link from "next/link";
import Ambience from "@/components/Ambience";
import JornadaIcone from "@/components/JornadaIcone";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import StatusJornada from "@/components/StatusJornada";
import { IconArrowLeft } from "@/components/icons";
import { catalogo } from "@/lib/jornadas/catalogo";

export const metadata = { title: "Jornadas de atração" };

/** As jornadas de atração: uma por desejo, cada uma com a sua frequência. */
export default function JornadasPage() {
  return (
    /* Céu estrelado: as jornadas são a parte contemplativa do app. */
    <main className="page" data-ambience="stars">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Um texto novo por dia"
          title="Jornadas de atração"
          action={
            <Link href="/inicio" className="icon-button" aria-label="Voltar para o início">
              <IconArrowLeft />
            </Link>
          }
        />

        <p className="page-lede">
          Escolha o que você quer atrair. A cada dia, um texto diferente lido em voz alta, com
          música na frequência daquele desejo.
        </p>
      </div>

      <Reveal>
        <div className="jornada-list">
          {catalogo.map((modulo) => (
            <Link href={`/jornadas/${modulo.id}`} key={modulo.id} className="jornada-card">
              <span className="jornada-icone" aria-hidden="true">
                <JornadaIcone id={modulo.id} />
              </span>
              <span className="jornada-card-body">
                <strong>{modulo.titulo}</strong>
                <span>{modulo.chamada}</span>
                <span className="jornada-card-meta">
                  {modulo.frequencia} Hz
                  <StatusJornada moduloId={modulo.id} />
                </span>
              </span>
              <span className="choice-chevron" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </Reveal>
    </main>
  );
}
