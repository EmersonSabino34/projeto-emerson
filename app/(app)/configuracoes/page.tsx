import Link from "next/link";
import Ambience from "@/components/Ambience";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import ThemePicker from "@/components/ThemePicker";
import { IconArrowLeft, IconChevronRight } from "@/components/icons";

export const metadata = { title: "Configurações" };

/** As demais linhas das Configurações (tela 30 das referências). Ainda são
    destinos a construir, então vão como botões e não como links quebrados. */
const rows = [
  { label: "Idioma", value: "Português" },
  { label: "Notificações", value: "Ativadas" },
  { label: "Privacidade", value: "" },
  { label: "Preferências de conteúdo", value: "" },
  { label: "Sincronizar dados", value: "" },
];

export default function ConfiguracoesPage() {
  return (
    <main className="page" data-ambience="horizon">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Seu espaço"
          title="Configurações"
          action={
            <Link href="/perfil" className="icon-button" aria-label="Voltar para o perfil">
              <IconArrowLeft />
            </Link>
          }
        />

        <section className="section">
          <SectionTitle
            eyebrow="Aparência"
            title="Dia ou noite"
          />
          <p className="muted-copy" style={{ marginTop: 0, marginBottom: "var(--sp-4)" }}>
            O VYRA tem dois tipos de visual. No automático, ele acompanha o seu
            aparelho e vira noite quando o seu celular virar.
          </p>
          <ThemePicker />
        </section>
      </div>

      <Reveal>
        <section className="section">
          <SectionTitle eyebrow="Conta" title="Preferências" />
          <div className="choice-list">
            {rows.map((row) => (
              <button type="button" className="choice-row" key={row.label}>
                <span className="choice-label">{row.label}</span>
                {row.value ? <span className="choice-value">{row.value}</span> : null}
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
