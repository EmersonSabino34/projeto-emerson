import Link from "next/link";
import Ambience from "@/components/Ambience";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import { IconArrowLeft, IconChevronRight, IconSearch } from "@/components/icons";

export const metadata = { title: "Ajuda e Suporte" };

const topicos = [
  "Central de ajuda",
  "Perguntas frequentes",
  "Falar com o suporte",
  "Tutorial em vídeo",
  "Sugestões",
];

const legais = ["Termos de uso", "Política de privacidade"];

/** Ajuda e Suporte (tela 31). */
export default function AjudaPage() {
  return (
    <main className="page" data-ambience="horizon">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Estamos aqui"
          title="Ajuda e Suporte"
          action={
            <Link href="/perfil" className="icon-button" aria-label="Voltar para o perfil">
              <IconArrowLeft />
            </Link>
          }
        />

        <div className="search-field">
          <span className="search-field-icon" aria-hidden="true">
            <IconSearch />
          </span>
          <input type="search" placeholder="Como podemos ajudar?" aria-label="Buscar ajuda" />
        </div>
      </div>

      <Reveal>
        <section className="section">
          <SectionTitle eyebrow="Suporte" title="Tire sua dúvida" />
          <div className="choice-list">
            {topicos.map((topico) => (
              <button type="button" className="choice-row" key={topico}>
                <span className="choice-label">{topico}</span>
                <span className="choice-chevron" aria-hidden="true">
                  <IconChevronRight />
                </span>
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={80}>
        <section className="section">
          <SectionTitle eyebrow="Legal" title="Documentos" />
          <div className="choice-list">
            {legais.map((item) => (
              <button type="button" className="choice-row" key={item}>
                <span className="choice-label">{item}</span>
                <span className="choice-chevron" aria-hidden="true">
                  <IconChevronRight />
                </span>
              </button>
            ))}
          </div>
        </section>
      </Reveal>
    </main>
  );
}
