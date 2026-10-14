import Link from "next/link";
import {
  IconBriefcase,
  IconFaith,
  IconGlobe,
  IconHeart,
  IconImage,
  IconLayers,
  IconMind,
  IconTarget,
  IconVibration,
} from "@/components/icons";

/**
 * As nove áreas da Home — a grade 3×3 das telas de referência.
 *
 * A lista mora aqui, e não em lib/data.ts, porque cada área carrega um
 * componente de ícone: um módulo de dados puro teria de devolver o nome do
 * ícone como string e alguém teria de remapear string → componente na hora
 * de renderizar, o que só adiciona um ponto de erro.
 *
 * `ambience` é a atmosfera que a tela daquela área usa. É o que cumpre o
 * "cada página tem uma ambientação diferente, mantendo a mesma identidade":
 * Lugares abre no nascer do sol, Mentalizar no céu estrelado, e assim por diante.
 */
export type Area = {
  slug: string;
  label: string;
  href: string;
  Icon: (props: { className?: string }) => React.ReactElement;
  ambience: "sunrise" | "aurora" | "mountains" | "stars" | "horizon";
  /** Frase de abertura da tela da área. */
  lede: string;
};

export const areas: Area[] = [
  {
    slug: "objetivos",
    label: "Objetivos",
    href: "/objetivos",
    Icon: IconTarget,
    ambience: "mountains",
    lede: "O que você quer conquistar, com prazo e plano.",
  },
  {
    slug: "vibracao",
    label: "Vibração",
    href: "/area/vibracao",
    Icon: IconVibration,
    ambience: "aurora",
    lede: "Como você está hoje — e como quer estar.",
  },
  {
    slug: "mentalizar",
    label: "Mentalizar",
    href: "/area/mentalizar",
    Icon: IconMind,
    ambience: "stars",
    lede: "Visualizações guiadas e afirmações para praticar.",
  },
  {
    slug: "saude",
    label: "Saúde",
    href: "/area/saude",
    Icon: IconHeart,
    ambience: "horizon",
    lede: "Água, sono, exercício, humor e meditação.",
  },
  {
    slug: "profissao",
    label: "Profissão",
    href: "/area/profissao",
    Icon: IconBriefcase,
    ambience: "mountains",
    lede: "Carreira, cursos, habilidades e metas financeiras.",
  },
  {
    slug: "religiao",
    label: "Religião",
    href: "/area/religiao",
    Icon: IconFaith,
    ambience: "sunrise",
    lede: "Fé, propósito, leitura e paz.",
  },
  {
    slug: "lugares",
    label: "Lugares",
    href: "/area/lugares",
    Icon: IconGlobe,
    ambience: "sunrise",
    lede: "Os lugares que você quer conhecer.",
  },
  {
    slug: "frases",
    label: "Frases e Fotos",
    href: "/frases",
    Icon: IconImage,
    ambience: "horizon",
    lede: "Frases que viram arte para compartilhar.",
  },
  {
    slug: "mural",
    label: "Mural",
    href: "/mural",
    Icon: IconLayers,
    ambience: "aurora",
    lede: "Seu quadro dos sonhos, pronto para virar papel de parede.",
  },
];

/** Busca por slug — usada pela rota /area/[slug]. */
export function findArea(slug: string) {
  return areas.find((area) => area.slug === slug);
}

export default function AreaGrid() {
  return (
    <div className="area-grid">
      {areas.map(({ slug, label, href, Icon }) => (
        <Link href={href} key={slug} className="area-tile">
          <span className="area-tile-icon" aria-hidden="true">
            <Icon />
          </span>
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}
