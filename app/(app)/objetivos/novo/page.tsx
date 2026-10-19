import Ambience from "@/components/Ambience";
import CriadorObjetivo from "@/components/CriadorObjetivo";

export const metadata = { title: "Novo objetivo" };

/**
 * Novo objetivo por toque (tela 12 das referências).
 *
 * A página fica no servidor para exportar `metadata`; as perguntas, que têm
 * estado, vão para o cliente (components/CriadorObjetivo). O cabeçalho mora
 * lá dentro porque o título é a pergunta da vez.
 */
export default function NovoObjetivoPage() {
  return (
    /* Céu estrelado: é a tela de imaginar, não a de executar. */
    <main className="page" data-ambience="stars">
      <Ambience />
      <CriadorObjetivo />
    </main>
  );
}
