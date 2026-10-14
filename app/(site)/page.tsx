import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * Os 4 pontos fortes da landing.
 *
 * Cada um aponta para uma tela real do app — a ordem aqui é a ordem em que
 * eles serão construídos (ver 10-setembro-plano-inicio.md).
 */
const pontosFortes = [
  {
    numero: "01",
    icone: "🪄",
    titulo: "Mural montado por IA",
    texto:
      "Descreva o que você quer viver. A IA escolhe as imagens, organiza o layout e entrega seu mural pronto em segundos.",
    href: "/mural",
    cta: "Ver o IA Designer",
  },
  {
    numero: "02",
    icone: "🗂️",
    titulo: "11 áreas da vida",
    texto:
      "Viagem, carreira, família, casa, finanças, fé, saúde. Cada sonho no seu lugar, em vez de uma lista solta que você nunca revisita.",
    href: "/explorar",
    cta: "Ver as categorias",
  },
  {
    numero: "03",
    icone: "📈",
    titulo: "Progresso que se vê",
    texto:
      "Cada sonho tem meta, prazo e percentual. Você abre o app e sabe exatamente o quanto já caminhou — sem precisar lembrar de nada.",
    href: "/inicio",
    cta: "Ver o mural",
  },
  {
    numero: "04",
    icone: "🎨",
    titulo: "Frases prontas para postar",
    texto:
      "Gere artes com frases sobre as suas fotos, no formato de story ou feed. Sua motivação sai do app e vira post.",
    href: "/frases",
    cta: "Ver o editor de frases",
  },
];

const colagem = [
  {
    legenda: "Conhecer Paris",
    alt: "Torre Eiffel ao fim da tarde",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=85",
  },
  {
    legenda: "Mais tempo em família",
    alt: "Família reunida ao ar livre",
    src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=85",
  },
  {
    legenda: "Meu cantinho",
    alt: "Sala de estar iluminada",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="lp-section lp-hero">
        <div>
          <p className="lp-badge">
            <span aria-hidden="true">✦</span>
            <span>Visualize · Planeje · Viva</span>
          </p>

          <h1 className="lp-title">
            O extraordinário começa <em>na sua mente</em>.
          </h1>

          <p className="lp-lede">
            O VYRA não para na visualização: ele transforma o que você quer viver em
            objetivos, plano de ação e um mural que você vê todos os dias.
          </p>

          <div className="lp-cta-row">
            <Link href="/splash" className="btn btn-primary btn-lg">
              Começar minha jornada
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/login" className="btn btn-ghost btn-lg">
              Já tenho conta
            </Link>
          </div>

          <p className="lp-cta-note">Sem cartão de crédito. Leva menos de um minuto.</p>

          <div className="lp-stats">
            <div>
              <strong>11</strong>
              <span>áreas da vida</span>
            </div>
            <div>
              <strong>3</strong>
              <span>estilos de mural</span>
            </div>
            <div>
              <strong>1 min</strong>
              <span>para começar</span>
            </div>
          </div>
        </div>

        {/* Colagem flutuante: mostra o produto antes de explicá-lo */}
        <div className="lp-collage" aria-hidden="true">
          {colagem.map((foto) => (
            <figure className="lp-collage-card" key={foto.legenda}>
              {/* eslint-disable-next-line @next/next/no-img-element -- fotos externas do Unsplash */}
              <img src={foto.src} alt={foto.alt} />
              <figcaption>{foto.legenda}</figcaption>
            </figure>
          ))}
          <div className="lp-collage-chip">
            <strong>35%</strong>
            <span>
              Paris
              <br />
              em progresso
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- 4 PONTOS FORTES */}
      <section className="lp-section lp-features" id="recursos">
        <Reveal>
          <div className="lp-section-head">
            <p className="eyebrow">Por que funciona</p>
            <h2>Quatro coisas que fazem a diferença</h2>
            <p>
              Não é mais uma lista de tarefas. É o seu mural, com imagem, meta e progresso
              — do jeito que o cérebro realmente lembra do que importa.
            </p>
          </div>
        </Reveal>

        <div className="lp-feature-grid">
          {pontosFortes.map((ponto, indice) => (
            <Reveal key={ponto.numero} delay={indice * 90}>
              <article className="lp-feature">
                <span className="lp-feature-num" aria-hidden="true">
                  {ponto.numero}
                </span>
                <span className="lp-feature-icon" aria-hidden="true">
                  {ponto.icone}
                </span>
                <h3>{ponto.titulo}</h3>
                <p>{ponto.texto}</p>
                <Link href={ponto.href} className="text-link">
                  {ponto.cta} <span aria-hidden="true">→</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- CTA FINAL */}
      <section className="lp-section">
        <Reveal>
          <div className="lp-cta-band">
            <div className="lp-cta-glow" aria-hidden="true" />
            <p className="eyebrow">Comece agora</p>
            <h2>Comece pelo primeiro sonho.</h2>
            <p>
              Crie sua conta, escolha uma área da vida e veja seu mural tomar forma em
              menos de um minuto.
            </p>
            <Link href="/splash" className="btn btn-primary btn-lg">
              Começar minha jornada
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
