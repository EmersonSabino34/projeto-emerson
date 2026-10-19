import Link from "next/link";
import Ambience from "@/components/Ambience";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { BotaoSair, IdentidadeSessao } from "@/components/SessaoUI";
import { IconArrowLeft } from "@/components/icons";
import { goalProgress, goals } from "@/lib/data";

export const metadata = { title: "Perfil" };

/** Áreas da vida em que a pessoa tem pelo menos um objetivo — e não o
    catálogo inteiro de categorias, que é igual para todo mundo. */
const areasComObjetivo = new Set(goals.map((goal) => goal.category)).size;

/** As linhas do perfil (tela 29). As que ainda não têm tela ficam como
    botões, para não virarem links quebrados. */
const settings = [
  { label: "Minha conta", href: "/conta" },
  { label: "Meu plano", href: "/planos" },
  { label: "Meus murais", href: "/mural" },
  { label: "Minhas conquistas", href: "/conquistas" },
  { label: "Configurações", href: "/configuracoes" },
  { label: "Ajuda e suporte", href: "/ajuda" },
  { label: "Sobre o VYRA", href: "/sobre" },
];

export default function ProfilePage() {
  return (
    /* Horizonte: o perfil era a única aba da navegação sem cenário, e aparecia
       como uma tela lisa entre telas com paisagem. */
    <main className="page" data-ambience="horizon">
      <Ambience />

      <div className="stagger">
        <PageHeader
          eyebrow="Seu espaço"
          title="Perfil"
          action={
            <Link href="/inicio" className="icon-button" aria-label="Voltar para o início">
              <IconArrowLeft />
            </Link>
          }
        />

        <section className="profile-card">
          <IdentidadeSessao />
          {/* Os mesmos números da Home. Antes o perfil lia o modelo antigo de
              sonhos e mostrava 41% de progresso enquanto a Home mostrava 50%. */}
          <div className="profile-stats">
            <div>
              <strong>{goals.length}</strong>
              <span>objetivos</span>
            </div>
            <div>
              <strong>{areasComObjetivo}</strong>
              <span>áreas</span>
            </div>
            <div>
              <strong>{goalProgress}%</strong>
              <span>progresso</span>
            </div>
          </div>
        </section>
      </div>

      <Reveal>
        <div className="settings-list">
          {settings.map((item) =>
            item.href ? (
              <Link href={item.href} key={item.label}>
                <span>{item.label}</span>
                <b aria-hidden="true">→</b>
              </Link>
            ) : (
              <button type="button" key={item.label}>
                <span>{item.label}</span>
                <b aria-hidden="true">→</b>
              </button>
            ),
          )}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <BotaoSair />
      </Reveal>
    </main>
  );
}
