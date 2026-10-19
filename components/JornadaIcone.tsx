import {
  IconBriefcase,
  IconCoins,
  IconFaith,
  IconFamily,
  IconHeart,
  IconLeaf,
} from "@/components/icons";

/**
 * O ícone de cada jornada. O mapa mora aqui, e não em lib/jornadas, pelo
 * mesmo motivo do AreaGrid: dados puros não carregam componentes.
 */
const icones: Record<string, (props: { className?: string }) => React.ReactElement> = {
  amor: IconHeart,
  carreira: IconBriefcase,
  prosperidade: IconCoins,
  saude: IconLeaf,
  familia: IconFamily,
  fe: IconFaith,
};

export default function JornadaIcone({ id, className }: { id: string; className?: string }) {
  const Icone = icones[id] ?? IconHeart;
  return <Icone className={className} />;
}
